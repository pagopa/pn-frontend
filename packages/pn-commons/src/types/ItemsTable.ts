import { ReactNode } from 'react';

type Order = 'asc' | 'desc';

export interface Sort<OrderByOptions> {
  orderBy: OrderByOptions;
  order: Order;
}

export interface Column {
  id: string;
  label: string;
  width: string;
  align?: 'center' | 'inherit' | 'left' | 'right' | 'justify';
  sortable?: boolean;
  getCellLabel(value: string | number | Array<string>, row?: Item): ReactNode;
  onClick?(row: Item, column: Column): void;
}

export interface Item {
  id: string;
  [key: string]: string | number | Array<string>;
}
