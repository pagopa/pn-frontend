import { GridProps } from '@mui/material';

export interface CardElement<T> {
  id: keyof T;
  position?: string;
  label: string;
  wrapValueInTypography?: boolean;
  gridProps?: GridProps;
}

export interface CardSort<T> {
  id: string;
  field: keyof T;
  label: string;
  value: 'asc' | 'desc';
}
