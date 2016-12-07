import React from 'react';
import numbro from 'numbro';
import moment from 'moment';
import pikaday from 'pikaday';
import Zeroclipboard from 'zeroclipboard';
import Handsontable from 'handsontable';
import HotSettingsMapper from './handsontableSettingsMapper';
require('handsontable/dist/handsontable.full.css');

class HotTable extends React.Component {
  constructor() {
    super();

    this.hotInstance = null;
    this.hotSettingsMapper = new HotSettingsMapper();
  }

  //TODO: docs
  componentDidMount() {
    const newSettings = this.hotSettingsMapper.getSettings(this.props);
    this.hotInstance = new Handsontable(document.getElementById(this.props.root), newSettings);
  }

  //TODO: docs
  shouldComponentUpdate(nextProps, nextState) {
    this.updateHot(this.hotSettingsMapper.getSettings(nextProps));

    return false;
  }

  //TODO: docs
  render() {
    return <div id={this.props.root}></div>
  }

  //TODO: docs
  updateHot(newSettings) {
    this.hotInstance.updateSettings(newSettings);
  }
}

export { HotTable };
