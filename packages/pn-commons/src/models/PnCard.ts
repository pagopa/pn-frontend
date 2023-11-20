import { ReactNode } from 'react';

import { GridProps } from '@mui/material';

import { Row } from './PnTable';

export interface CardElement<T> {
  id: keyof T;
  position?: string;
  label: string;
  getLabel?(value: Row<T>[keyof T], row?: Row<T>): ReactNode;
  wrappedInTypography?: boolean;
  gridProps?: GridProps;
}

export interface CardSort<T> {
  id: string;
  field: keyof T;
  label: string;
  value: 'asc' | 'desc';
}

export interface CardAction<T> {
  id: string;
  component: JSX.Element;
  onClick(cardData: Row<T>): void;
}
