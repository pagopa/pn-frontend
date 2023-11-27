import { ReactNode } from 'react';

import { GridProps } from '@mui/material';

import { Align, Column, Row } from './PnTable';

/**
 * @typedef TableConfiguration configuration for the table view
 * @prop {string} width width of the column
 * @prop {boolean} sortable if the table column is sortable or not
 * @prop {Align} align alignment into the table cell
 * @prop {Function} onClick function called when user click on cell
 */
interface TableConfiguration<T> {
  width: string;
  sortable?: boolean;
  align?: Align;
  onClick?: (row: Row<T>, column: Column<T>) => void;
}

/**
 * @typedef CardConfiguration configuration for the card view
 * @prop {('header' | 'body')} position position of the field into the card
 * @prop {GridProps} gridProps style properties to override custom ones
 * @prop {boolean} wrapValueInTypography element will be not enclosed in a Typrography element
 */
interface CardConfiguration {
  position: 'header' | 'body';
  gridProps?: GridProps;
  wrapValueInTypography?: boolean;
  hideIfEmpty?: boolean;
}

/**
 * @typedef SmartTableData SmartTable data structure
 * @prop {ColumnId} id id of the data
 * @prop {string} label label of the field
 * @prop {Function} getValue function to parse the value of the field
 * @prop {TableConfiguration} tableConfiguration field configuration for the table view
 * @prop {CardConfiguration} cardConfiguration field configuration for the card view
 */
export interface SmartTableData<T> {
  id: keyof T;
  label: string;
  getValue(value: Row<T>[keyof T], data?: Row<T>, isMobile?: boolean): ReactNode;
  tableConfiguration: TableConfiguration<T>;
  cardConfiguration: CardConfiguration;
}

/**
 * @typedef SmartTableData SmartTable data structure
 * @prop {string} id id of the action
 * @prop {JSX.Element} component component to render for the action
 * @prop {Function} onClick function called when user click on action
 * @prop {('table' | 'card' | 'everywhere')} position position of the action
 */
export interface SmartTableAction<T> {
  id: string;
  component: JSX.Element;
  onClick(data: Row<T>): void;
  position: 'table' | 'card' | 'everywhere';
}
