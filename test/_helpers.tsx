import React from 'react';
import { HotTable } from '../src/hotTable';
import { addUnsafePrefixes } from '../src/helpers';
import Handsontable from 'handsontable';

class IndividualPropsWrapper extends React.Component<{ref?: string, id?: string}, {hotSettings: object}> {
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

  render(): React.ReactElement {
    return (
      <div>
        <HotTable licenseKey="non-commercial-and-evaluation" ref={this.setHotElementRef.bind(this)} id="hot" {...this.state.hotSettings} />
      </div>
    );
  }
}
const PrefixedIPW = addUnsafePrefixes(IndividualPropsWrapper);
export { PrefixedIPW as IndividualPropsWrapper };

class SingleObjectWrapper extends React.Component<{ref?: string, id?: string}, {hotSettings: object}> {
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

  render(): React.ReactElement {
    return (
      <div>
        <HotTable licenseKey="non-commercial-and-evaluation" ref={this.setHotElementRef.bind(this)} id="hot" settings={this.state.hotSettings}/>
      </div>
    );
  }
}

const PrefixedSOW = addUnsafePrefixes(SingleObjectWrapper);
export { PrefixedSOW as SingleObjectWrapper };

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
