# react-handsontable  [![Build Status](https://travis-ci.org/handsontable/react-handsontable.png?branch=master)](https://travis-ci.org/handsontable/react-handsontable)
### Available as `@handsontable/react` and `@handsontable-pro/react`
A React wrapper for the the [Handsontable](https://github.com/handsontable/handsontable) spreadsheet component.

## Table of contents
1. [Installation](#installation)
2. [Building](#building)
3. [Basic usage](#basic-usage)
4. [Examples](#examples)
5. [License](#license)
6. [Contact](#contact)
7. [Other wrappers](#other-wrappers)

## Installation
Depending on whether you're using [Handsontable](https://github.com/handsontable/handsontable) or [Handsontable Pro](https://github.com/handsontable/handsontable-pro), you'll need to install:

```sh
npm install @handsontable/react handsontable
```

or

```sh
npm install @handsontable-pro/react handsontable-pro
```

Installing the `react-handsontable` package will have the same effect as installing `@handsontable/react`, which is the wrapper for the CE version.

**Important:** The wrapper does NOT contain `Handsontable`/`Handsontable Pro`, that's why it needs to be installed separately.

For more detailed installation instructions, please take a look at our wiki under ["Installation guide"](https://github.com/handsontable/react-handsontable/wiki/Installation-guide).

## Building
If you used npm to download the library, you should be good to go, but if you want to make a build yourself, go to the directory where `react-handsontable` source is located and run either:


* `npm run build-ce`

Creates a `/dist/ce/` directory with `react-handsontable-ce.js` and `react-handsontable-ce.min.js` files inside.

* `npm run build-pro`

Creates a `/dist/pro/` directory with `react-handsontable-pro.js` and `react-handsontable-pro.min.js` files inside.

* `npm run build`

Equivalent for running both of the commands above.</sup>

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
        <HotTable root="hot" data={this.handsontableData} colHeaders={true} rowHeaders={true} width="600" height="300" stretchH="all" />
      </div>
    );
  }
}
```

(You'll need to include the Handsontable styles separately, they're located under `handsontable/dist/handsontable.full.css`)

Note, that you can provide the Handsontable options either as:
* individual component properties
```jsx
<HotTable root="hot" data={this.handsontableData} colHeaders={true} rowHeaders={true} width="600" height="300" stretchH="all" />
```
* an object passed to a single `settings` property
```jsx
<HotTable root="hot" settings={{
    data: this.handsontableData,
    colHeaders: true,
    rowHeaders: true,
    width: 600,
    height: 300,
    stretchH: 'all'
}} />
```

The `root` property declares the `id` of the root element for the table. It is optional - if it isn't provided, the table will get a random generated `id`.

## Examples
- [Simple react-handsontable implementation](http://codepen.io/handsoncode/pen/ygvaxv?editors=0010)
- [Simple react-handsontable implementation with a single-property configuration](http://codepen.io/handsoncode/pen/pRamwZ?editors=0010)
- [Interactive HotTable demo](http://codepen.io/handsoncode/pen/zNRoxb?editors=0010)
- [Simple Redux implementation demo](http://codepen.io/handsoncode/pen/LWmvPX?editors=0010)

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
