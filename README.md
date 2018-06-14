# react-handsontable  [![Build Status](https://travis-ci.org/handsontable/react-handsontable.png?branch=master)](https://travis-ci.org/handsontable/react-handsontable)
### Available as `@handsontable/react` and `@handsontable-pro/react`
A React wrapper for the the [Handsontable](https://github.com/handsontable/handsontable) spreadsheet component.

## Table of contents
1. [Installation](#installation)
2. [Basic usage](#basic-usage)
3. [Examples](#examples)
4. [License](#license)
5. [Contact](#contact)
6. [Other wrappers](#other-wrappers)

## Installation
Depending on whether you're using [Handsontable](https://github.com/handsontable/handsontable) or [Handsontable Pro](https://github.com/handsontable/handsontable-pro), you'll need to install:

```sh
npm install @handsontable/react handsontable
```

or

```sh
npm install @handsontable-pro/react handsontable-pro
```

Running either one of these commands will install both the wrapper and the Handsontable/Handsontable Pro library itself.

## Basic usage
`@handsontable/react` contains a `<HotTable>` component. You can use it just like any other React component. For example:

```jsx
// import React...
import React from 'react';
import ReactDOM from 'react-dom';

// ... and HotTable
import {HotTable} from '@handsontable/react';

class ExampleComponent extends React.Component {
  constructor(props) {
    super(props);
    this.handsontableData = [
      ["", "Ford", "Volvo", "Toyota", "Honda"],
      ["2016", 10, 11, 12, 13],
      ["2017", 20, 11, 14, 13],
      ["2018", 30, 15, 12, 13]
    ];
  }

  render() {
    return (
      <div id="example-component">
        <HotTable id="hot" data={this.handsontableData} colHeaders={true} rowHeaders={true} width="600" height="300" stretchH="all" />
      </div>
    );
  }
}
```

(You'll need to include the Handsontable styles separately, they're located under `handsontable/dist/handsontable.full.css`)

Note, that you can provide the Handsontable options either as:
* individual component properties
```jsx
<HotTable id="hot" data={this.handsontableData} colHeaders={true} rowHeaders={true} width="600" height="300" stretchH="all" />
```
* an object passed to a single `settings` property
```jsx
<HotTable id="hot" settings={{
    data: this.handsontableData,
    colHeaders: true,
    rowHeaders: true,
    width: 600,
    height: 300,
    stretchH: 'all'
}} />
```

The `id` property declares the `id` of the root element for the table. It is optional - if it isn't provided, the table will get a random generated `id`. You can
also declare the `className` and `style` properties in a similar fashion.

## Examples
- [Simple react-handsontable implementation](https://jsfiddle.net/js_ziggle/qu0p48hj/)
- [Simple react-handsontable implementation with a single-property configuration](https://jsfiddle.net/js_ziggle/5xkua8ec/)
- [Interactive HotTable demo](https://jsfiddle.net/js_ziggle/6gdx2rb0/)
- [Simple Redux implementation demo](https://jsfiddle.net/js_ziggle/5chpod7q/)

## License
`react-handsontable`, `@handsontable/react` and `@handsontable-pro/react` are released under the [MIT license](https://github.com/handsontable/react-handsontable/blob/master/LICENSE).
Copyrights belong to Handsoncode sp. z o.o.

## Contact
Feel free to give us feedback on this wrapper using this [contact form](https://handsontable.com/contact.html) or write directly at hello@handsontable.com.

## Other Wrappers
Handsontable comes with more wrappers and directives for popular frameworks:

- [hot-table](https://github.com/handsontable/hot-table) (Polymer - WebComponents)
- [ngHandsontable](https://github.com/handsontable/ngHandsontable) (Angular 1)
- [@handsontable/angular](https://github.com/handsontable/angular-handsontable)
- [@handsontable/vue](https://github.com/handsontable/vue-handsontable-official) (Vue.js)
