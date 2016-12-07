import React from 'react';
import Handsontable from '../node_modules/handsontable-pro/dist/handsontable.full';
require('../node_modules/handsontable-pro/dist/handsontable.full.css');

class HotTable extends React.Component {
  constructor() {
    super();

    this.hotInstance = null;
    this.state = {data: null};
    this.options = [];
  }

  //TODO: docs
  componentDidMount() {
    if (this.props.data) {
      this.setState({data: this.props.data});
    }

    this.hotInstance = new Handsontable(document.getElementById(this.props.root), {
      data: this.props.data || this.state.data,
      contextMenu: this.props.contextMenu === 'true',
      width: this.props.width,
      height: this.props.height,
      startRows: this.props.startRows,
      startCols: this.props.startCols,
      readOnly: this.props.readOnly
    });
  }

  //TODO: docs
  shouldComponentUpdate(nextProps, nextState) {
    let currentProps = Handsontable.helper.deepClone(this.props);
    if (nextProps.data == null) {
      delete currentProps.data;
    }

    return !Handsontable.helper.isObjectEquals(currentProps, nextProps);
  }

  //TODO: docs
  componentWillUpdate(nextProps, nextState) {
    this.props = nextProps;
    this.hotInstance.destroy();
    this.componentDidMount();
  }

  //TODO: docs
  render() {
    return <div id={this.props.root}></div>
  }

  /* custom methods */


}

export { HotTable };
