import React from 'react';
import Handsontable from 'handsontable';
import { SettingsMapper } from './settingsMapper';
import { PortalManager } from './portalManager';
import { HotColumn } from './hotColumn';
import * as packageJson from '../package.json';
import { HotTableProps } from './types';
import {
  createEditorPortal,
  createPortal,
  getChildElementByType,
  getComponentNodeName,
  getExtendedEditorElement,
  addUnsafePrefixes,
  removeEditorContainers
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
class HotTable extends React.Component<HotTableProps, {}> {
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
   * Component used to manage the renderer portals.
   *
   * @type {React.Component}
   */
  portalManager: React.Component = null;

  /**
   * Array containing the portals cashed to be rendered in bulk after Handsontable's render cycle.
   */
  portalCacheArray: React.ReactPortal[] = [];


  /**
   * Global editor portal cache.
   *
   * @private
   * @type {React.ReactPortal}
   */
  private globalEditorPortal: React.ReactPortal = null;

  /**
   * The rendered cells cache.
   *
   * @private
   * @type {Map}
   */
  private renderedCellCache: Map<string, HTMLTableCellElement> = new Map();

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
   * Get the rendered table cell cache.
   *
   * @returns {Map}
   */
  getRenderedCellCache(): Map<string, HTMLTableCellElement> {
    return this.renderedCellCache;
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
   * @return {React.ReactPortal} The global editor portal.
   */
  getGlobalEditorPortal(): React.ReactPortal {
    return this.globalEditorPortal;
  }

  /**
   * Set the private editor portal cache property.
   *
   * @param {React.ReactPortal} portal Global editor portal.
   */
  setGlobalEditorPortal(portal: React.ReactPortal): void {
    this.globalEditorPortal = portal;
  }

  /**
   * Clear both the editor and the renderer cache.
   */
  clearCache(): void {
    const renderedCellCache = this.getRenderedCellCache();

    this.setGlobalEditorPortal(null);
    this.getEditorCache().clear();
    removeEditorContainers(this.hotElementRef ? this.hotElementRef.ownerDocument : document);

    renderedCellCache.clear();
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
  getRendererWrapper(rendererElement: React.ReactElement): Handsontable.renderers.Base | any {
    const hotTableComponent = this;

    return function (instance, TD, row, col, prop, value, cellProperties) {
      const renderedCellCache = hotTableComponent.getRenderedCellCache();

      if (renderedCellCache.has(`${row}-${col}`)) {
        TD.innerHTML = renderedCellCache.get(`${row}-${col}`).innerHTML;
      }

      if (TD && !TD.getAttribute('ghost-table')) {

        const {portal, portalContainer} = createPortal(rendererElement, {
          TD,
          row,
          col,
          prop,
          value,
          cellProperties,
          isRenderer: true
        }, () => {
        }, TD.ownerDocument);

        while (TD.firstChild) {
          TD.removeChild(TD.firstChild);
        }

        TD.appendChild(portalContainer);

        hotTableComponent.portalCacheArray.push(portal);
      }

      renderedCellCache.set(`${row}-${col}`, TD);

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
      editorComponent: React.Component;

      constructor(hotInstance, row, col, prop, TD, cellProperties) {
        super(hotInstance, row, col, prop, TD, cellProperties);

        (editorComponent as any).hotCustomEditorInstance = this;

        this.editorComponent = editorComponent;
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
  getGlobalRendererElement(): React.ReactElement {
    const hotTableSlots: React.ReactNode = this.props.children;

    return getChildElementByType(hotTableSlots, 'hot-renderer');
  }

  /**
   * Get the editor element for the entire HotTable instance.
   *
   * @param {React.ReactNode} [children] Children of the HotTable instance. Defaults to `this.props.children`.
   * @returns {React.ReactElement} React editor component element.
   */
  getGlobalEditorElement(children: React.ReactNode = this.props.children): React.ReactElement | null {
    return getExtendedEditorElement(children, this.getEditorCache());
  }

  /**
   * Create the global editor portal and its destination HTML element if needed.
   *
   * @param {React.ReactNode} [children] Children of the HotTable instance. Defaults to `this.props.children`.
   */
  createGlobalEditorPortal(children: React.ReactNode = this.props.children): void {
    const globalEditorElement: React.ReactElement = this.getGlobalEditorElement(children);

    if (globalEditorElement) {
      this.setGlobalEditorPortal(createEditorPortal(globalEditorElement))
    }
  }

  /**
   * Create a new settings object containing the column settings and global editors and renderers.
   *
   * @returns {Handsontable.GridSettings} New global set of settings for Handsontable.
   */
  createNewGlobalSettings(): Handsontable.GridSettings {
    const newSettings = SettingsMapper.getSettings(this.props);
    const globalRendererNode = this.getGlobalRendererElement();
    const globalEditorNode = this.getGlobalEditorElement();

    newSettings.columns = this.columnSettings.length ? this.columnSettings : newSettings.columns;

    if (globalEditorNode) {
      newSettings.editor = this.getEditorClass(globalEditorNode);

    } else {
      newSettings.editor = this.props.editor || this.props.settings ? this.props.settings.editor : void 0;
    }

    if (globalRendererNode) {
      newSettings.renderer = this.getRendererWrapper(globalRendererNode);

    } else {
      newSettings.renderer = this.props.renderer || this.props.settings ? this.props.settings.renderer : void 0;
    }

    return newSettings;
  }

  /**
   * Detect if `autoRowSize` or `autoColumnSize` is defined, and if so, throw an incompatibility warning.
   *
   * @param {Handsontable.GridSettings} newGlobalSettings New global settings passed as Handsontable config.
   */
  displayAutoSizeWarning(newGlobalSettings: Handsontable.GridSettings): void {
    if (this.hotInstance.getPlugin('autoRowSize').enabled || this.hotInstance.getPlugin('autoColumnSize').enabled) {
      const isNativeRenderer = (renderer, column?) => {
        const standaloneColumnRenderer = this.props.columns && this.props.columns[column] ? this.props.columns[column].renderer : null;
        const settingsObjectColumnRenderer = this.props.settings && this.props.settings.columns && this.props.settings.columns[column] ? this.props.settings.columns[column].renderer : null;

        return column ?
          standaloneColumnRenderer === renderer || settingsObjectColumnRenderer === renderer :
          this.props.renderer === renderer || this.props.settings.renderer === renderer;
      };
      let rendererDefined = false;

      if (newGlobalSettings.renderer && !isNativeRenderer(newGlobalSettings.renderer)) {
        rendererDefined = true;
      }

      if (!rendererDefined && newGlobalSettings.columns) {
        for (let i = 0; i < newGlobalSettings.columns.length; i++) {
          if (newGlobalSettings.columns[i].renderer && !isNativeRenderer(newGlobalSettings.columns[i].renderer, i)) {
            rendererDefined = true;
            break;
          }
        }
      }

      if (rendererDefined) {
        console.warn('Your `HotTable` configuration includes `autoRowSize`/`autoColumnSize` options, which are not compatible with ' +
          ' the component-based renderers`. Disable `autoRowSize` and `autoColumnSize` to prevent row and column misalignment.');
      }
    }
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
   * Handsontable's `beforeRender` hook callback.
   */
  handsontableBeforeRender(): void {
    this.getRenderedCellCache().clear();
  }

  /**
   * Handsontable's `afterRender` hook callback.
   */
  handsontableAfterRender(): void {
    this.portalManager.setState(() => {
      return Object.assign({}, {
        portals: this.portalCacheArray
      });

    }, () => {
      this.portalCacheArray.length = 0;
    });
  }

  /**
   * Call the `updateSettings` method for the Handsontable instance.
   *
   * @param {Object} newSettings The settings object.
   */
  private updateHot(newSettings: Handsontable.GridSettings): void {
    this.hotInstance.updateSettings(newSettings, false);
  }

  /**
   * Set the portal manager ref.
   *
   * @param {React.ReactComponent} pmComponent The PortalManager component.
   */
  private setPortalManagerRef(pmComponent: React.Component): void {
    this.portalManager = pmComponent;
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
    const hotTableComponent = this;
    const newGlobalSettings = this.createNewGlobalSettings();

    this.hotInstance = new Handsontable.Core(this.hotElementRef, newGlobalSettings);

    this.hotInstance.addHook('beforeRender', function (isForced) {
      hotTableComponent.handsontableBeforeRender();
    });

    this.hotInstance.addHook('afterRender', function () {
      hotTableComponent.handsontableAfterRender();
    });

    // `init` missing in Handsontable's type definitions.
    (this.hotInstance as any).init();

    this.displayAutoSizeWarning(newGlobalSettings);
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
    const newGlobalSettings = this.createNewGlobalSettings();
    this.updateHot(newGlobalSettings);

    this.displayAutoSizeWarning(newGlobalSettings);
  }

  /**
   * Destroy the Handsontable instance when the parent component unmounts.
   */
  componentWillUnmount(): void {
    this.hotInstance.destroy();
    removeEditorContainers(this.hotElementRef.ownerDocument);
  }

  /**
   * Render the component.
   */
  render(): React.ReactElement {
    const isHotColumn = (childNode: any) => childNode.type === HotColumn;
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
      <React.Fragment>
        <div ref={this.setHotElementRef.bind(this)} id={this.id} className={this.className} style={this.style}>
          {childClones}
        </div>
        <PortalManager ref={this.setPortalManagerRef.bind(this)}></PortalManager>
      </React.Fragment>
    )
  }
}

const PrefixedHotTable = addUnsafePrefixes(HotTable);
export default PrefixedHotTable;
export { PrefixedHotTable as HotTable };
