import Handsontable from 'handsontable';

/**
 * Interface for the `prop` of the HotTable component - extending the default Handsontable settings with additional,
 * component-related properties.
 */
export interface HotTableProps extends Handsontable.DefaultSettings {
  data?: any[][] | object[];
  id?: string,
  className?: string,
  style?: React.CSSProperties,
  settings?: Handsontable.DefaultSettings,
  children?: any // TODO: change this
}

/**
 * TODO: docs
 */
export interface HotColumnProps extends Handsontable.DefaultSettings {
  _emitColumnSettings?: Function,
  _columnIndex?: number,
  _getRendererCache?: Function
}
