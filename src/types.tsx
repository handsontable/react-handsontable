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
  settings?: Handsontable.GridSettings
  children?: React.ReactNode
}

/**
 * Properties related to the HotColumn architecture.
 */
export interface HotColumnProps extends Handsontable.GridSettings {
  _componentRendererColumns?: Map<number | string, boolean>;
  _emitColumnSettings?: (columnSettings: Handsontable.GridSettings, columnIndex: number) => void;
  _columnIndex?: number,
  _getChildElementByType?: (children: React.ReactNode, type: string) => React.ReactElement;
  _getRendererWrapper?: (rendererNode: React.ReactElement) => Handsontable.renderers.Base;
  _getEditorClass?: (editorElement: React.ReactElement) => typeof Handsontable.editors.BaseEditor;
  _getEditorCache?: () => Map<Function, React.Component>;
  _getOwnerDocument?: () => Document;
  children?: React.ReactNode;
}

