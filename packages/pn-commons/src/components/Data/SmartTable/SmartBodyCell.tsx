import { ReactNode } from 'react';

import { ValueMode } from '../../../models/SmartTable';
import { PnCardHeaderItemProps } from '../PnCard/PnCardHeaderItem';
import { PnTableBodyCellProps } from '../PnTable/PnTableBodyCell';

type Props<T> = {
  columnId: keyof T;
  isCardHeader?: boolean;
  mode?: ValueMode;
  tableProps: Omit<PnTableBodyCellProps, 'children' | 'testId'>;
  cardProps?: Omit<PnCardHeaderItemProps, 'children' | 'testId'>;
  children: ReactNode;
  testId?: string;
  hideInCard?: boolean;
};

const SmartBodyCell = <T,>({ children }: Props<T>) => <>{children}</>;

export default SmartBodyCell;
