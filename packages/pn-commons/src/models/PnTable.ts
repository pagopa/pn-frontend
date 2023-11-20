import { ReactNode } from 'react';

type Order = 'asc' | 'desc';
export type Align = 'center' | 'inherit' | 'left' | 'right' | 'justify';

export interface Sort<T> {
  orderBy: keyof T | '';
  order: Order;
}

export interface Column<T> {
  id: keyof T;
  label: string;
  width: string;
  align?: Align;
  sortable?: boolean;
  getCellLabel?(value: Row<T>[keyof T], row?: Row<T>): ReactNode;
  onClick?(row: Row<T>, column: Column<T>): void;
}

export type Row<T> = T & { id: string };
