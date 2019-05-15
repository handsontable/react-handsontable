import React from 'react';
import ReactDOM from 'react-dom';
import Handsontable from 'handsontable';
import { HotTableProps, HotColumnProps } from './types';

export class HotColumn extends React.Component<HotColumnProps, {}> {
  internalProps: string[];
  columnSettings: HotTableProps;

  constructor(props) {
    super(props);

    this.createColumnSettings();

    this.emitColumnSettings();
  }

  /**
   * Filter out and return elements of the provided `type` from the `HotColumn` component's children.
   *
   * @param {String} type Either `'hot-renderer'` or `'hot-editor'`.
   * @returns {Object|null} A child (React node) or `null`, if no child of that type was found.
   */
  getColumnChild(type: string): React.ReactElement | null {
    const children: React.ReactNode | React.ReactNode[] = this.props.children;
    const childrenArray: React.ReactNode[] = React.Children.toArray(children);
    const childrenCount: number = React.Children.count(children);
    let wantedChild: React.ReactNode | null = null;

    if (childrenCount !== 0) {
      if (childrenCount === 1 && (children as React.ReactElement).props[type]) {
        wantedChild = children;

      } else {
        wantedChild = childrenArray.find((child) => {
          return (child as React.ReactElement).props[type] !== void 0;
        });
      }
    }

    return (wantedChild as React.ReactElement) || null;
  }

  /**
   * Filter out all the internal properties and return an object with just the Handsontable-related props.
   *
   * @returns {Object}
   */
  getSettingsProps(): HotTableProps {
    this.internalProps = ['_emitColumnSettings', '_columnIndex', '_getRendererCache', 'hot-renderer', 'hot-editor'];

    return Object.keys(this.props)
      .filter(key => {
        return !this.internalProps.includes(key);
      })
      .reduce((obj, key) => {
        obj[key] = this.props[key];

        return obj;
      }, {});
  }

  /**
   * Check whether the HotColumn component contains a provided prop.
   *
   * @param {String} propName Property name.
   * @returns {Boolean}
   */
  hasProp(propName: string) {
    return !!this.props[propName];
  }

  /**
   * Get the renderer wrapper from the renderer react element.
   *
   * @param {Object} rendererElement
   */
  getRendererWrapper(rendererElement: React.ReactElement): Handsontable.renderers.Base {
    const hotColumnComponent = this;

    return function (instance, TD, row, col, prop, value, cellProperties) {
      if (TD && !TD.getAttribute('ghost-table')) {
        const rendererCache = hotColumnComponent.props._getRendererCache();

        if (rendererCache && !rendererCache.has(`${row}-${col}`)) {
          rendererCache.set(`${row}-${col}`, rendererElement);
        }

        const cachedReactElement: React.ReactElement<object> = rendererCache.get(`${row}-${col}`);

        ReactDOM.render(cachedReactElement, TD, function () {
          this.setState({
            hotRole: 'renderer',
            hotInstance: instance,
            TD,
            row,
            col,
            prop,
            value,
            cellProperties,
          });
        });
      }

      return TD;
    };
  }

  /**
   * Create a fresh class to be used as an editor, based on the editor React element provided.
   *
   * @param {Object} editorElement
   */
  getEditorClass(editorElement: React.ReactElement): typeof Handsontable.editors.BaseEditor {
    const requiredMethods: string[] = ['focus', 'open', 'close', 'getValue', 'setValue'];
    const componentName: string = (editorElement.type as Function).name;
    const editorCache = this.props._getEditorCache();
    let editorComponent: any = editorCache.get(componentName);

    class CustomEditor extends Handsontable.editors.BaseEditor implements Handsontable._editors.Base {
      prepare(row, col, prop, td, originalValue, cellProperties) {
        super.prepare(row, col, prop, td, originalValue, cellProperties);

        editorComponent.setState({
          hotRole: 'editor',
          hotInstance: cellProperties.instance,
          row,
          col,
          prop,
          td,
          originalValue,
          cellProperties,
        });

        editorComponent.finishEditing = (restoreOriginalValue, ctrlDown, callback) => {
          super.finishEditing(restoreOriginalValue, ctrlDown, callback);
        };
      }

      focus() {
      }

      getValue() {
        Handsontable.editors.BaseEditor.prototype.getValue();
      }

      setValue() {
        Handsontable.editors.BaseEditor.prototype.setValue();
      }

      open() {
        Handsontable.editors.BaseEditor.prototype.open();
      }

      close() {
        Handsontable.editors.BaseEditor.prototype.close();
      }
    }

    if (editorCache && !editorCache.has(componentName)) {
      let editorContainer = document.querySelector('#hot-wrapper-editor-container-' + componentName);
      if (!document.querySelector('#hot-wrapper-editor-container-' + componentName)) {
        editorContainer = document.createElement('DIV');
        editorContainer.id = 'hot-wrapper-editor-container-' + componentName;
        document.body.appendChild(editorContainer);
      }

      ReactDOM.render(editorElement, editorContainer, function () {
        editorComponent = this;
      });

      editorCache.set(componentName, editorElement);

    }

    Object.getOwnPropertyNames(Handsontable.editors.BaseEditor.prototype).forEach(propName => {
      if (propName === 'constructor') {
        return;
      }

      if ((requiredMethods.includes(propName) || propName !== 'prepare') && editorComponent[propName]) {
        CustomEditor.prototype[propName] = function () {
          return editorComponent[propName](...arguments);
        }

      } else if (propName === 'prepare') {
        const defaultPrepare: (...args: any[]) => any = CustomEditor.prototype[propName];

        CustomEditor.prototype[propName] = function () {
          defaultPrepare.call(this, ...arguments);
          return editorComponent[propName](...arguments);
        }
      }
    });

    return CustomEditor;
  }

  /**
   * Create the column settings based on the data provided to the `HotColumn` component and it's child components.
   */
  createColumnSettings(): void {
    const rendererElement: React.ReactElement = this.getColumnChild('hot-renderer');
    const editorElement: React.ReactElement = this.getColumnChild('hot-editor');

    this.columnSettings = this.getSettingsProps();

    if (rendererElement !== null) {
      this.columnSettings.renderer = this.getRendererWrapper(rendererElement);

    } else if (this.hasProp('renderer')) {
      this.columnSettings.renderer = this.props.renderer;
    }

    if (editorElement !== null) {
      this.columnSettings.editor = this.getEditorClass(editorElement);

    } else if (this.hasProp('editor')) {
      this.columnSettings.editor = this.props.editor;
    }
  }

  /**
   * Emits the column settings to the parent using a prop passed from the parent.
   */
  emitColumnSettings(): void {
    this.props._emitColumnSettings(this.columnSettings, this.props._columnIndex);
  }

  /**
   * Prevent HotColumn from rendering.
   *
   * @returns {null}
   */
  render(): null {
    return null;
  }
}
