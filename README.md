# react-handsontable  [![Build Status](https://travis-ci.org/handsontable/react-handsontable.png?branch=master)](https://travis-ci.org/handsontable/react-handsontable)
A React wrapper for the the [Handsontable](https://github.com/handsontable/handsontable) spreadsheet component.

## Table of contents
1. [Installation](#installation)
2. [Basic usage](#basic-usage)
3. [Examples](#examples)
4. [Documentation](#documentation)
6. [License](#license)
7. [Contact](#contact)
5. [Other wrappers](#other-wrappers)

## Installation
You can install the component using npm:

```
npm install react-handsontable
```

If you don't want to use npm, you can download the latest version as a `.zip` file. The file you need is located in the `/dist/` directory.

[Download ZIP](https://github.com/handsontable/react-handsontable/archive/master.zip)

## Basic usage
Assuming you have downloaded or otherwise acquired the code, you can use use the `<HotTable>` component just like a normal React component. For example:

```jsx
import HotTable from 'react-handsontable';

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

The `root` declares the `id` property of the root element for the table. It is optional - if it isn't provided, the table will get a random generated `id`.

## Examples
- [Simple react-handsontable implementation](http://codepen.io/handsoncode/pen/ygvaxv?editors=0010)
- [Simple react-handsontable implementation with a single-property configuration](http://codepen.io/handsoncode/pen/pRamwZ?editors=0010)
- [Interactive HotTable demo](http://codepen.io/handsoncode/pen/zNRoxb?editors=0010)

## License
`react-handsontable` is released under the [MIT license](https://github.com/handsontable/react-handsontable/blob/master/LICENSE).
Copyrights belong to Handsoncode sp. z o.o.

## Contact
Feel free to give us feedback on this wrapper using this [contact form](https://handsontable.com/contact.html) or write directly at hello@handsontable.com.

## Other Wrappers
Handsontable comes with more wrappers and directives for popular frameworks:

- [hot-table](https://github.com/handsontable/hot-table) (Polymer - WebComponents)
- [ngHandsontable](https://github.com/handsontable/ngHandsontable) (Angular 1)