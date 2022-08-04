import { ReactNode } from 'react';

type Order = 'asc' | 'desc';

export interface Sort<OrderByOption> {
  orderBy: OrderByOption;
  order: Order;
}

export interface Column<ColumnId> {
  id: ColumnId;
  label: string;
  width: string;
  align?: 'center' | 'inherit' | 'left' | 'right' | 'justify';
  sortable?: boolean;
  getCellLabel(value: string | number | Array<string>, row?: Item): ReactNode;
  onClick?(row: Item, column: Column<ColumnId>): void;
}

export interface Item {
  id: string;
  [key: string]: string | number | Array<string>;
}
