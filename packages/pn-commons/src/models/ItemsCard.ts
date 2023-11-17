import { ReactNode } from 'react';

import { GridProps } from '@mui/material';

import { Row } from './PnTable';

export interface CardElement<T> {
  id: keyof T;
  position?: string;
  label: string;
  getLabel?(value: string | number | Array<string | ReactNode>, row?: Row<T>): ReactNode;
  notWrappedInTypography?: boolean;
  hideIfEmpty?: boolean;
  gridProps?: GridProps;
}

export interface CardSort<OrderByOption> {
  id: string;
  field: OrderByOption;
  label: string;
  value: 'asc' | 'desc';
}

export interface CardAction<T> {
  id: string;
  component: ReactNode;
  onClick(cardData: Row<T>): void;
}
