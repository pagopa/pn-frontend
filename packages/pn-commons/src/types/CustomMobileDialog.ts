import { ReactNode } from 'react';

export type CustomDialogAction = {
  key: string,
  component: ReactNode,
  closeOnClick?: boolean
}