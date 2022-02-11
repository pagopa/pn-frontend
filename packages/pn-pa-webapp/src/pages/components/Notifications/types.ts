export type Order = 'asc' | 'desc';

export interface Column {
  id: string;
  label: string;
  width: string;
  align?: 'center' | 'inherit' | 'left' | 'right' | 'justify';
  sortable?: boolean;

  getCellLabel(value: string | number): any;
}

export interface Row {
  id: string;
  [key: string]: string | number;
}