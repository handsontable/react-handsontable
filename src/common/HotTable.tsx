import React from 'react';
import Handsontable from 'handsontable';
import { SettingsMapper } from './settingsMapper';
import * as packageJson from './../../package.json';
import { HotTableProps } from './types';

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

  // TODO: check why the @type is messing this up
  // /**
  //  * Reference to the `SettingsMapper` instance.
  //  *
  //  * @type {SettingsMapper}
  //  */
  private settingsMapper: SettingsMapper = new SettingsMapper();
  /**
   * Component props.
   *
   * @type {HotTableProps}
   */
  props: HotTableProps;
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
   * TODO:docs
   */
  columnSettings: object[] = [];

  /**
   * TODO: docs
   */
  // rendererCache: WeakMap<HTMLElement, React.ReactElement<object>> = new WeakMap(); //TODO: check why it's wrong
  rendererCache: WeakMap<HTMLElement, any> = new WeakMap();

  static get version(): string {
    return (packageJson as any).version;
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
   * TODO: docs
   */
  getRendererCache() {
    return this.rendererCache;
  }

  /**
   * Initialize Handsontable after the component has mounted.
   */
  componentDidMount(): void {
    const newSettings = this.settingsMapper.getSettings(this.props);

    newSettings.columns = this.columnSettings.length ? this.columnSettings : newSettings.columns;

    this.hotInstance = new Handsontable(this.hotElementRef, newSettings);
  }

  /**
   * Call the `updateHot` method and prevent the component from re-rendering the instance.
   *
   * @param {Object} nextProps
   * @param {Object} nextState
   * @returns {Boolean}
   */
  shouldComponentUpdate(nextProps: HotTableProps, nextState: {}): boolean {
    this.updateHot(this.settingsMapper.getSettings(nextProps));

    return false;
  }

  /**
   * Destroy the Handsontable instance when the parent component unmounts.
   */
  componentWillUnmount(): void {
    this.hotInstance.destroy();
  }

  /**
   * TODO: docs
   */
  getHotColumnSettings(columnSettings, columnIndex) {
    this.columnSettings[columnIndex] = columnSettings;
  }

  /**
   * Render the table.
   */
  render(): React.ReactNode {
    const childClones = React.Children.map(this.props.children, (hotColumn, columnIndex) => {
      return React.cloneElement(hotColumn, {
        _emitColumnSettings: this.getHotColumnSettings.bind(this),
        _columnIndex: columnIndex,
        _getRendererCache: this.getRendererCache.bind(this),
        children: hotColumn.props.children
      })
    });

    this.id = this.props.id || 'hot-' + Math.random().toString(36).substring(5);
    this.className = this.props.className || '';
    this.style = this.props.style || {};

    return (
      <div ref={this.setHotElementRef.bind(this)} id={this.id} className={this.className} style={this.style}>
        {childClones}
      </div>
    )
  }

  /**
   * Call the `updateSettings` method for the Handsontable instance.
   *
   * @param {Object} newSettings The settings object.
   */
  private updateHot(newSettings: Handsontable.DefaultSettings): void {
    this.hotInstance.updateSettings(newSettings, false);
  }
}

export { HotTable };
