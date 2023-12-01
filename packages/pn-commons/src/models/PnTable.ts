import { TableCellProps } from '@mui/material';

type Order = 'asc' | 'desc';

export interface Sort<T> {
  orderBy: keyof T | '';
  order: Order;
}

export interface Column<T> {
  id: keyof T;
  label: string;
  cellProps?: TableCellProps;
  sortable?: boolean;
  onClick?(row?: Row<T>, columnId?: keyof T): void;
}

export type Row<T> = T & { id: string };
