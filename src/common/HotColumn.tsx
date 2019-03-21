import React from 'react';
import ReactDOM from 'react-dom';
import Handsontable from 'handsontable';
import { HotTableProps, HotColumnProps } from './types';


export class HotColumn extends React.Component<HotColumnProps, {}> {
  internalProps: string[];
  columnSettings: HotTableProps;

  // TODO: remove
  rrr: any = null;

  constructor(props) {
    super(props);

    this.createColumnSettings();

    this.emitColumnSettings();
  }

  /**
   * TODO: docs
   * @param children
   * @param type
   */
  getColumnChild(children, type): React.ReactNode|null {
    let wantedChild = null;

    if (!children) {
      return wantedChild;
    }

    if (children.length) {
      wantedChild = children.find((child) => {
        return child.props[type] !== void 0;
      });

    } else if (children && children.props[type]) {
      wantedChild = children;
    }

    return wantedChild || null;
  }

  getSettingsProps() {
    this.internalProps = ['_emitColumnSettings', '_columnIndex', '_getRendererCache',];

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
   * TODO: docs
   * @param propName
   */
  hasProp(propName) {
    return !!this.props[propName];
  }

  /**
   * TODO: docs
   * @param rendererElement
   */
  getRendererWrapper(rendererElement: any): Handsontable.renderers.Base {
    const hotColumnComponent = this;

    return function (instance, TD, row, col, prop, value, cellProperties) {
      if (TD) {
        const rendererCache = hotColumnComponent.props._getRendererCache();

        if (rendererCache && !rendererCache.has(TD)) {

          const extendedReactElement = React.cloneElement(rendererElement, {
            instance,
            TD,
            row,
            col,
            prop,
            value,
            cellProperties,

            ref: c => (hotColumnComponent.rrr = c)
          });

          rendererCache.set(TD, extendedReactElement);
        }

        const cachedReactElement: React.ReactElement<object> = rendererCache.get(TD);

        ReactDOM.render(cachedReactElement, TD);
      }

      return TD;
    };
  }

  // /**
  //  * Create a fresh class to be used as an editor, based on the editor component provided.
  //  *
  //  * @param {Object} vNode VNode for the editor child component.
  //  * @returns {Class} The class used as an editor in Handsontable.
  //  */
  // getEditorClass(editorElement: any): typeof Handsontable.editors.BaseEditor {
  //   const requiredMethods: string[] = ['focus', 'open', 'close', 'getValue', 'setValue'];
  //   const componentName: string = (editorElement.componentOptions.Ctor as any).options.name;
  //   const editorCache = this.props._getRendererCache();
  //   let mountedComponent: EditorComponent = null;
  //
  //   class CustomEditor extends Handsontable.editors.BaseEditor implements Handsontable._editors.Base {
  //     prepare(row, col, prop, td, originalValue, cellProperties) {
  //       super.prepare(row, col, prop, td, originalValue, cellProperties);
  //
  //       mountedComponent.$data.row = row;
  //       mountedComponent.$data.column = col;
  //       mountedComponent.$data.columnProp = prop;
  //       mountedComponent.$data.td = td;
  //       mountedComponent.$data.originalValue = originalValue;
  //       mountedComponent.$data.cellProperties = cellProperties;
  //
  //       mountedComponent.finishEditing = (restoreOriginalValue, ctrlDown, callback) => {
  //         super.finishEditing(restoreOriginalValue, ctrlDown, callback);
  //       };
  //     }
  //
  //     focus() {}
  //     getValue() {
  //       Handsontable.editors.BaseEditor.prototype.getValue();
  //     }
  //     setValue() {
  //       Handsontable.editors.BaseEditor.prototype.setValue();
  //     }
  //     open() {
  //       Handsontable.editors.BaseEditor.prototype.open();
  //     }
  //     close() {
  //       Handsontable.editors.BaseEditor.prototype.close();
  //     }
  //   }
  //
  //   if (editorCache && !editorCache.has(componentName)) {
  //     mountedComponent = createVueComponent(vNode, this, {});
  //
  //     editorCache.set(componentName, mountedComponent);
  //
  //   } else {
  //     mountedComponent = editorCache.get(componentName);
  //   }
  //
  //   Object.entries(Handsontable.editors.BaseEditor.prototype).forEach(entry => {
  //     const methodName: string = entry[0];
  //
  //     if ((requiredMethods.includes(methodName) || methodName !== 'prepare') && mountedComponent[methodName]) {
  //       CustomEditor.prototype[methodName] = function () {
  //         return mountedComponent[methodName](...arguments);
  //       }
  //
  //     } else if (methodName === 'prepare') {
  //       const defaultPrepare: (...args: any[]) => any = CustomEditor.prototype[methodName];
  //
  //       CustomEditor.prototype[methodName] = function () {
  //         defaultPrepare.call(this, ...arguments);
  //         return mountedComponent[methodName](...arguments);
  //       }
  //     }
  //   });
  //
  //   return CustomEditor;
  // }

  /**
   * Create the column settings based on the data provided to the `hot-column` component and it's child components.
   */
  createColumnSettings(): void {
    const rendererElement: React.ReactNode = this.getColumnChild(this.props.children, 'hot-renderer');
    const editorElement: React.ReactNode = this.getColumnChild(this.props.children, 'hot-editor');

    this.columnSettings = this.getSettingsProps();

    if (rendererElement !== null) {
      this.columnSettings.renderer = this.getRendererWrapper(rendererElement);

    } else if (this.hasProp('renderer')) {
      this.columnSettings.renderer = this.props.renderer;
    }
    //
    // if (editorVNode !== null) {
    //   this.columnSettings.editor = this.getEditorClass(editorVNode);
    //
    // } else if (this.hasProp('editor')) {
    //   this.columnSettings.editor = this.$props.editor;
    // }
  }

  /**
   * TODO: docs
   */
  emitColumnSettings(): void {
    // Emit the column settings to the parent using a prop passed from the parent
    this.props._emitColumnSettings(this.columnSettings, this.props._columnIndex);
  }


  // /**
  //  * TODO: docs
  //  */
  // render(): any {
  //   return (
  //     <div>
  //       {this.testRefRenderer}
  //     </div>
  //   );
  // }


  /**
   * TODO: docs
   */
  render(): null {
    return null;
  }
}
