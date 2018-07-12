import React from 'react';
import Handsontable from 'hot-alias';
import {SettingsMapper} from './settingsMapper';

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
export class HotTable extends React.Component {
  constructor() {
    super();

    this.settingsMapper = new SettingsMapper();
    this.id = null;
    this.hotInstance = null;
    this.hotElementRef = React.createRef();
  }

  /**
   * Initialize Handsontable after the component has mounted.
   */
  componentDidMount() {
    const newSettings = this.settingsMapper.getSettings(this.props);
    this.hotInstance = new Handsontable(this.hotElementRef.current, newSettings);
  }

  /**
   * Call the `updateHot` method and prevent the component from re-rendering the instance.
   *
   * @param {Object} nextProps
   * @param {Object} nextState
   * @returns {Boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    this.updateHot(this.settingsMapper.getSettings(nextProps));

    return false;
  }

  /**
   * Destroy the Handsontable instance when the parent component unmounts.
   */
  componentWillUnmount() {
    this.hotInstance.destroy();
  }

  /**
   * Render the table.
   *
   * @returns {XML}
   */
  render() {
    this.id = this.props.id || 'hot' + new Date().getTime();
    this.className = this.props.className || '';
    this.style = this.props.style || {};

    return <div ref={this.hotElementRef} id={this.id} className={this.className} style={this.style}></div>
  }

  /**
   * Call the `updateSettings` method for the Handsontable instance.
   * @param newSettings
   */
  updateHot(newSettings) {
    this.hotInstance.updateSettings(newSettings);
  }
}
