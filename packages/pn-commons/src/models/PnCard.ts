import { GridProps } from '@mui/material';

import { ValueMode } from './SmartTable';

export interface CardElement<T> {
  id: keyof T;
  position?: string;
  label: string;
  mode?: ValueMode;
  wrapValueInTypography?: boolean;
  gridProps?: Pick<GridProps, 'xs' | 'sm' | 'md' | 'lg' | 'xl'>;
}

export interface CardSort<T> {
  id: string;
  field: keyof T;
  label: string;
  value: 'asc' | 'desc';
}
