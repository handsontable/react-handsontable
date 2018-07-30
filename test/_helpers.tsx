import React from 'react';
import {HotTable} from '../src/common/index';

export class IndividualPropsWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <HotTable ref="hotTable" id="hot" {...this.state.hotSettings} />
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
        <HotTable ref="hotTable" id="hot" settings={this.state.hotSettings} />
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
