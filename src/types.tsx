import Handsontable from 'handsontable';
import React from 'react';

/**
 * Interface for the `prop` of the HotTable component - extending the default Handsontable settings with additional,
 * component-related properties.
 */
export interface HotTableProps extends Handsontable.GridSettings {
  data?: any[][] | object[];
  id?: string,
  className?: string,
  style?: React.CSSProperties,
  settings?: Handsontable.DefaultSettings
}

/**
 * Properties related to the HotColumn architecture.
 */
export interface HotColumnProps extends Handsontable.GridSettings {
  _emitColumnSettings?: Function,
  _columnIndex?: number,
  _getRendererCache?: Function,
  _getEditorCache?: Function
}

