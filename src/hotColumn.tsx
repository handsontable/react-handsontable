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

  /**
   * TODO: docs
   */
  getSettingsProps(): HotTableProps {
    this.internalProps = ['_emitColumnSettings', '_columnIndex', '_getRendererCache'];

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

  /**
   * TODO: docs
   */
  render(): null {
    return null;
  }
}
