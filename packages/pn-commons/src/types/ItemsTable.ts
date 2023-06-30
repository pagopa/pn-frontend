import { ReactNode } from 'react';

type Order = 'asc' | 'desc';
export type Align = 'center' | 'inherit' | 'left' | 'right' | 'justify';

export interface Sort<OrderByOption> {
  orderBy: OrderByOption;
  order: Order;
}

export interface Column<ColumnId> {
  id: ColumnId;
  label: string;
  width: string;
  align?: Align;
  sortable?: boolean;
  getCellLabel(value: string | number | Array<string | ReactNode>, row?: Item): ReactNode;
  onClick?(row: Item, column: Column<ColumnId>): void;
  disableAccessibility?: boolean;
}

export interface Item {
  id: string;
  [key: string]: string | number | Array<string | ReactNode>;
}
