import { ReactChild, ReactFragment } from 'react';
import { PnCardHeaderItemProps } from '../PnCard/PnCardHeaderItem';
import { PnTableBodyCellProps } from '../PnTable/PnTableBodyCell';
type Props<T> = {
    columnId: keyof T;
    isCardHeader?: boolean;
    tableProps: Omit<PnTableBodyCellProps, 'children' | 'testId'>;
    cardProps?: Omit<PnCardHeaderItemProps, 'children' | 'testId'>;
    children: ReactChild | ReactFragment;
    testId?: string;
    hideInCard?: boolean;
};
declare const SmartBodyCell: <T>({ children }: Props<T>) => JSX.Element;
export default SmartBodyCell;
