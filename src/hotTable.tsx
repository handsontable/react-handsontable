import React, { ReactPortal } from 'react';
import ReactDOM from 'react-dom';
import Handsontable from 'handsontable';
import { SettingsMapper } from './settingsMapper';
import * as packageJson from '../package.json';
import { HotTableProps } from './types';
import { LRUMap } from './lib/lru/lru';
import {
  areChildrenEqual,
  createEditorPortal,
  getChildElementByType,
  getComponentNodeName,
  getExtendedEditorElement
} from './helpers';

/**
 * A Handsontable-ReactJS wrapper.
 *
 * To implement, use the `HotTable` tag with properties corresponding to Handsontable options.
 * For example:
 *
 * ```js
 * <HotTable id="hot" data={dataObject} contextMenu={true} colHeaders={true} width={600} height={300} stretchH="all" />
 *
 * // is analogous to
 * let hot = new Handsontable(document.getElementById('hot'), {
 *    data: dataObject,
 *    contextMenu: true,
 *    colHeaders: true,
 *    width: 600
 *    height: 300
 * });
 *
 * ```
 *
 * @class HotTable
 */
export default class HotTable extends React.Component<HotTableProps, {}> {
  /**
   * Reference to the `SettingsMapper` instance.
   *
   * @type {SettingsMapper}
   */
  private settingsMapper: SettingsMapper = new SettingsMapper();
  /**
   * The `id` of the main Handsontable DOM element.
   *
   * @type {String}
   */
  id: string = null;
  /**
   * Reference to the Handsontable instance.
   *
   * @type {Object}
   */
  hotInstance: Handsontable = null;
  /**
   * Reference to the main Handsontable DOM element.
   *
   * @type {HTMLElement}
   */
  hotElementRef: HTMLElement = null;
  /**
   * Class name added to the component DOM element.
   *
   * @type {String}
   */
  className: string;
  /**
   * Style object passed to the component.
   *
   * @type {React.CSSProperties}
   */
  style: React.CSSProperties;

  /**
   * Array of object containing the column settings.
   *
   * @type {Array}
   */
  columnSettings: object[] = [];

  /**
   * Global editor portal cache.
   *
   * @private
   * @type {ReactPortal}
   */
  private globalEditorPortal: ReactPortal = null;

  /**
   * LRU renderer cache.
   *
   * @private
   * @type {LRUMap}
   */
  private rendererCache: LRUMap<string, React.ReactElement> = new LRUMap(5000);

  /**
   * Editor cache.
   *
   * @private
   * @type {Map}
   */
  private editorCache: Map<string, React.Component> = new Map();

  /**
   * Package version getter.
   *
   * @returns The version number of the package.
   */
  static get version(): string {
    return (packageJson as any).version;
  }

  /**
   * Get the renderer cache and return it.
   *
   * @returns {LRUMap}
   */
  //TODO: fix this typing problem with the definition file
  getRendererCache(): any {
    //getRendererCache(): LRUMap<string, React.ReactElement> {
    return this.rendererCache;
  }

  /**
   * Get the editor cache and return it.
   *
   * @returns {Map}
   */
  getEditorCache(): Map<string, React.Component> {
    return this.editorCache;
  }

  /**
   * Get the global editor portal property.
   *
   * @return {ReactPortal} The global editor portal.
   */
  getGlobalEditorPortal(): ReactPortal {
    return this.globalEditorPortal;
  }

  /**
   * Set the private editor portal cache property.
   *
   * @param {ReactPortal} portal Global editor portal.
   */
  setGlobalEditorPortal(portal: ReactPortal): void {
    this.globalEditorPortal = portal;
  }

  /**
   * Clear both the editor and the renderer cache.
   */
  clearCache(): void {
    this.setGlobalEditorPortal(null);
    this.getEditorCache().clear();
    this.getRendererCache().clear();
  }

  /**
   * Set the reference to the main Handsontable DOM element.
   *
   * @param {HTMLElement} element The main Handsontable DOM element.
   */
  private setHotElementRef(element: HTMLElement): void {
    this.hotElementRef = element;
  }

  /**
   * Return a renderer wrapper function for the provided renderer component.
   *
   * @param {React.ReactElement} rendererElement React renderer component.
   * @returns {Handsontable.renderers.Base} The Handsontable rendering function.
   */
  getRendererWrapper(rendererElement: React.ReactElement): Handsontable.renderers.Base {
    const hotTableComponent = this;

    return function (instance, TD, row, col, prop, value, cellProperties) {
      if (TD && !TD.getAttribute('ghost-table')) {
        const rendererCache = hotTableComponent.getRendererCache();

        if (rendererCache && !rendererCache.has(`${row}-${col}`)) {
          rendererCache.set(`${row}-${col}`, rendererElement);
        }

        const cachedReactElement: React.ReactElement = rendererCache.get(`${row}-${col}`);

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
   * Create a fresh class to be used as an editor, based on the provided editor React element.
   *
   * @param {React.ReactElement} editorElement React editor component.
   * @returns {Function} A class to be passed to the Handsontable editor settings.
   */
  getEditorClass(editorElement: React.ReactElement): typeof Handsontable.editors.BaseEditor {
    const componentName: string = getComponentNodeName(editorElement);
    const editorCache = this.getEditorCache();
    let cachedComponent: React.Component = editorCache.get(componentName);

    return this.makeEditorClass(cachedComponent);
  }

  /**
   * Create a class to be passed to the Handsontable's settings.
   *
   * @param {React.ReactElement} editorComponent React editor component.
   * @returns {Function} A class to be passed to the Handsontable editor settings.
   */
  makeEditorClass(editorComponent: React.Component): typeof Handsontable.editors.BaseEditor {
    const customEditorClass = class CustomEditor extends Handsontable.editors.BaseEditor implements Handsontable._editors.Base {
      constructor(hotInstance, row, col, prop, TD, cellProperties) {
        super(hotInstance, row, col, prop, TD, cellProperties);

        (editorComponent as any).hotCustomEditorInstance = this;
      }

      focus() {
      }

      getValue() {
      }

      setValue() {
      }

      open() {
      }

      close() {
      }
    } as any;

    // Fill with the rest of the BaseEditor methods
    Object.getOwnPropertyNames(Handsontable.editors.BaseEditor.prototype).forEach(propName => {
      if (propName === 'constructor') {
        return;
      }

      customEditorClass.prototype[propName] = function (...args) {
        return editorComponent[propName].call(editorComponent, ...args);
      }
    });

    return customEditorClass;
  }

  /**
   * Get the renderer element for the entire HotTable instance.
   *
   * @returns {React.ReactElement} React renderer component element.
   */
  getGlobalRendererElement(): React.ReactElement | null {
    const hotTableSlots: React.ReactNode = this.props.children;
    return getChildElementByType(hotTableSlots, 'hot-renderer');
  }

  /**
   * Get the editor element for the entire HotTable instance.
   *TODO: docs
   * @returns {React.ReactElement} React editor component element.
   */
  getGlobalEditorElement(children = this.props.children): React.ReactElement | null {
    return getExtendedEditorElement(children, this.getEditorCache());
  }

  /**
   * Create the global editor portal and its destination HTML element if needed. TODO: docs
   */
  createGlobalEditorPortal(children = this.props.children): void {
    const globalEditorElement: React.ReactElement = this.getGlobalEditorElement(children);

    if (globalEditorElement) {
      this.setGlobalEditorPortal(createEditorPortal(globalEditorElement))
    }
  }

  /**
   * Create a new settings object containing the column settings and global editors and renderers.
   *
   * @return {Handsontable.GridSettings} New global set of settings for Handsontable.
   */
  createNewGlobalSettings(): Handsontable.GridSettings {
    const newSettings = this.settingsMapper.getSettings(this.props);
    const globalRendererNode = this.getGlobalRendererElement();
    const globalEditorNode = this.getGlobalEditorElement();

    newSettings.columns = this.columnSettings.length ? this.columnSettings : newSettings.columns;

    if (globalEditorNode) {
      newSettings.editor = this.getEditorClass(globalEditorNode);

    } else {
      newSettings.editor = void 0;
    }

    if (globalRendererNode) {
      newSettings.renderer = this.getRendererWrapper(globalRendererNode);

    } else {
      newSettings.renderer = void 0;
    }

    return newSettings;
  }

  /**
   * Sets the column settings based on information received from HotColumn.
   *
   * @param {HotTableProps} columnSettings Column settings object.
   * @param {Number} columnIndex Column index.
   */
  setHotColumnSettings(columnSettings: HotTableProps, columnIndex: number): void {
    this.columnSettings[columnIndex] = columnSettings;
  }

  /**
   * Call the `updateSettings` method for the Handsontable instance.
   *
   * @param {Object} newSettings The settings object.
   */
  private updateHot(newSettings: Handsontable.GridSettings): void {
    this.hotInstance.updateSettings(newSettings, false);
  }

  /*
  ---------------------------------------
  ------- React lifecycle methods -------
  ---------------------------------------
  */

  /**
   * Logic performed before the mounting of the component.
   */
  componentWillMount(): void {
    this.clearCache();
    this.createGlobalEditorPortal();
  }

  /**
   * Initialize Handsontable after the component has mounted.
   */
  componentDidMount(): void {
    this.hotInstance = new Handsontable(this.hotElementRef, this.createNewGlobalSettings());
  }

  /**
   * Call the `updateHot` method and prevent the component from re-rendering the instance if there's no need to do so.
   *
   * @param {HotTableProps} nextProps Props passed to the component.
   * @param {Object} nextState Changed state of the component.
   * @returns {Boolean}
   */
  shouldComponentUpdate(nextProps: HotTableProps, nextState: {}): boolean {
    if (!areChildrenEqual(this.props.children, nextProps.children)) {
      return true;
    }

    this.updateHot(this.settingsMapper.getSettings(nextProps));

    return false;
  }

  /**
   * Logic performed before the component update.
   */
  componentWillUpdate(nextProps: Readonly<HotTableProps>, nextState: Readonly<{}>, nextContext: any): void {
    this.clearCache();
    this.createGlobalEditorPortal(nextProps.children);
  }

  /**
   * Logic performed after the component update.
   */
  componentDidUpdate(): void {
    this.updateHot(this.createNewGlobalSettings());
  }

  /**
   * Destroy the Handsontable instance when the parent component unmounts.
   */
  componentWillUnmount(): void {
    this.hotInstance.destroy();
  }

  /**
   * Render the component.
   */
  render(): React.ReactElement {
    const isHotColumn = (childNode: any) => childNode.type.name === 'HotColumn';
    let children = React.Children.toArray(this.props.children);

    // filter out anything that's not a HotColumn
    children = children.filter(function (childNode: any) {
      return isHotColumn(childNode);
    });

    // clone the HotColumn nodes and extend them with the callbacks
    let childClones = children.map((childNode: React.ReactElement, columnIndex: number) => {
      return React.cloneElement(childNode, {
        _emitColumnSettings: this.setHotColumnSettings.bind(this),
        _columnIndex: columnIndex,
        _getChildElementByType: getChildElementByType.bind(this),
        _getRendererWrapper: this.getRendererWrapper.bind(this),
        _getEditorClass: this.getEditorClass.bind(this),
        _getEditorCache: this.getEditorCache.bind(this),
        children: childNode.props.children
      })
    });

    // add the global editor to the list of children
    childClones = childClones.concat(this.getGlobalEditorPortal());

    this.id = this.props.id || 'hot-' + Math.random().toString(36).substring(5);
    this.className = this.props.className || '';
    this.style = this.props.style || {};

    return (
      <div ref={this.setHotElementRef.bind(this)} id={this.id} className={this.className} style={this.style}>
        {childClones}
      </div>
    )
  }
}

export { HotTable };
