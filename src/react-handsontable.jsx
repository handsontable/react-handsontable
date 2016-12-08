import React from 'react';
import moment from 'moment';
import numbro from 'numbro';
import pikaday from 'pikaday';
import Zeroclipboard from 'zeroclipboard';
import Handsontable from 'handsontable';
import HotSettingsMapper from './handsontableSettingsMapper';
require('handsontable/dist/handsontable.full.css');

/**
 * @class HotTable
 */
export default class HotTable extends React.Component {
  constructor() {
    super();

    this.hotInstance = null;
    this.hotSettingsMapper = new HotSettingsMapper();
    this.root = null;
  }

  //TODO: docs
  componentDidMount() {
    const newSettings = this.hotSettingsMapper.getSettings(this.props);

    this.hotInstance = new Handsontable(document.getElementById(this.root), newSettings);
  }

  //TODO: docs
  shouldComponentUpdate(nextProps, nextState) {
    this.updateHot(this.hotSettingsMapper.getSettings(nextProps));

    return false;
  }

  //TODO: docs
  render() {
    this.root = this.props.root || 'hot' + new Date().getTime();
    return <div id={this.root}></div>
  }

  //TODO: docs
  updateHot(newSettings) {
    this.hotInstance.updateSettings(newSettings);
  }
}
