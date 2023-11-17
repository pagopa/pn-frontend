import { ReactNode } from 'react';

type Order = 'asc' | 'desc';
export type Align = 'center' | 'inherit' | 'left' | 'right' | 'justify';

export interface Sort<OrderByOption> {
  orderBy: OrderByOption;
  order: Order;
}

export interface Column<T> {
  id: keyof T;
  label: string;
  width: string;
  align?: Align;
  sortable?: boolean;
  getCellLabel?(value: string | number | Array<string | ReactNode>, row?: Row<T>): ReactNode;
  onClick?(row: Row<T>, column: Column<T>): void;
  disableAccessibility?: boolean;
}

export type Row<T> = T & { id: string };
