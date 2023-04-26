import { ReactNode } from 'react';
import { GridProps } from '@mui/material';

import { Align, Column, Item } from './ItemsTable';

/**
 * @typedef TableConfiguration configuration for the table view
 * @prop {string} width width of the column
 * @prop {boolean} sortable if the table column is sortable or not
 * @prop {Align} align alignment into the table cell
 * @prop {Function} onClick function called when user click on cell
 */
interface TableConfiguration<ColumnId> {
  width: string;
  sortable?: boolean;
  align?: Align;
  onClick?: (row: Item, column: Column<ColumnId>) => void;
}

/**
 * @typedef CardConfiguration configuration for the card view
 * @prop {('header' | 'body')} position position of the field into the card
 * @prop {GridProps} gridProps style properties to override custom ones
 * @prop {boolean} notWrappedInTypography element will be not enclosed in a Typrography element
 * @prop {boolean} hideIfEmpty element will be not shown if empty
 */
interface CardConfiguration {
  position: 'header' | 'body';
  gridProps?: GridProps;
  notWrappedInTypography?: boolean;
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
export interface SmartTableData<ColumnId> {
  id: ColumnId;
  label: string;
  getValue(
    value: string | number | Array<string | ReactNode>,
    data?: Item,
    isMobile?: boolean
  ): ReactNode;
  tableConfiguration: TableConfiguration<ColumnId>;
  cardConfiguration: CardConfiguration;
}

/**
 * @typedef SmartTableData SmartTable data structure
 * @prop {string} id id of the action
 * @prop {ReactNode} component component to render for the action
 * @prop {Function} onClick function called when user click on action
 * @prop {('table' | 'card' | 'everywhere')} position position of the action
 */
export interface SmartTableAction {
  id: string;
  component: ReactNode;
  onClick(data: Item): void;
  position: 'table' | 'card' | 'everywhere';
}
