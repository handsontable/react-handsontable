import React from 'react';
import { HotTable } from '../src/common/index';
import Handsontable from 'hot-alias';

export class IndividualPropsWrapper extends React.Component<{ref?: string, id?: string}, {hotSettings: object}> {
  hotTable: HotTable;

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.setState({});
  }

  private setHotElementRef(component: HotTable): void {
    this.hotTable = component;
  }

  render(): React.ReactNode {
    return (
      <div>
        <HotTable ref={this.setHotElementRef.bind(this)} id="hot" {...this.state.hotSettings} />
      </div>
    );
  }
}

export class SingleObjectWrapper extends React.Component<{ref?: string, id?: string}, {hotSettings: object}> {
  hotTable: HotTable;

  constructor(props) {
    super(props);
  }

  private setHotElementRef(component: HotTable): void {
    this.hotTable = component;
  }

  componentWillMount() {
    this.setState({});
  }

  render(): React.ReactNode {
    return (
      <div>
        <HotTable ref={this.setHotElementRef.bind(this)} id="hot" settings={this.state.hotSettings}/>
      </div>
    );
  }
}

export function wait(amount: number, body: () => any, resolveFunc?: () => any) {
  if (!resolveFunc) {
    resolveFunc = body;
    body = () => {
    };
  }

  return new Promise((resolve, reject) => {
    body();

    setTimeout(() => {
      resolve();
    }, amount);

  }).then(resolveFunc);
}
