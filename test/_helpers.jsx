import React from 'react';
import ReactDOM from 'react-dom';
import HotTable from '../dist/react-handsontable';

export class IndividualPropsWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <HotTable ref="hotTable" root="hot" {...this.state.hotSettings} />
      </div>
    );
  }
}

export class SingleObjectWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <HotTable ref="hotTable" root="hot" settings={this.state.hotSettings} />
      </div>
    );
  }
}

export function wait(amount, body, resolveFunc) {
  if (!resolveFunc) {
    resolveFunc = body;
    body = ()=>{};
  }
  return new Promise((resolve, reject) => {
    body();
    setTimeout(() => {
      resolve();
    }, amount);
  }).then(resolveFunc);
}