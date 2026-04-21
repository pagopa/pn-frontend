import { TableCellProps, TableContainerProps, TableProps } from '@mui/material';

import { ValueMode } from './SmartTable';

type Order = 'asc' | 'desc';

export interface Sort<T> {
  orderBy: keyof T | '';
  order: Order;
}

type CustomTableCellProps = Pick<TableCellProps, 'width' | 'align'>;

export type { CustomTableCellProps as TableCellProps };

export interface Column<T> {
  id: keyof T;
  label: string;
  mode?: ValueMode;
  cellProps?: CustomTableCellProps;
  sortable?: boolean;
}

export type Row<T> = T & { id: string };

export type SlotProps = {
  tableContainer?: TableContainerProps;
  table?: TableProps;
};
