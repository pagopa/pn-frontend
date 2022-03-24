import { ReactNode } from 'react';
import { Row } from './NotificationsTable';

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

export interface CardAction {
  id: string;
  component: ReactNode;
  onClick(cardData: Row): void;
}