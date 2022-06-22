import { ReactNode } from 'react';
import { GridProps } from '@mui/material';

import { Item } from './ItemsTable';

export interface CardElement {
  id: string;
  label: string;
  getLabel(value: string | number | Array<string>, row?: Item): ReactNode;
  notWrappedInTypography?: boolean;
  gridProps?: GridProps
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
  onClick(cardData: Item): void;
}
