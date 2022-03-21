import { ReactNode } from 'react';

export interface CardElem {
  id: string;
  label: string;
  getLabel(value: string | number | Array<string>): ReactNode;
}

export interface CardSort {
  id: string;
  field: string;
  label: string;
  value: 'asc' | 'desc';
}