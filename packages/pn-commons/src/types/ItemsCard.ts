import { ReactNode } from 'react';
import { GridProps } from '@mui/material';

import { Item } from './ItemsTable';

export interface CardElement {
  id: string;
  label: string;
  getLabel(value: string | number | Array<string | ReactNode>, row?: Item): ReactNode;
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

export interface CardAction {
  id: string;
  component: ReactNode;
  onClick(cardData: Item): void;
}
