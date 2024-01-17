import { ReactChild, ReactFragment } from 'react';
import { TableCellProps } from '@mui/material';
import { Sort } from '../../../models';
export type PnTableHeaderCellProps<T> = {
    testId?: string;
    sort?: Sort<T>;
    cellProps?: TableCellProps;
    handleClick?: (s: Sort<T>) => void;
    columnId: keyof T;
    children: ReactChild | ReactFragment;
    sortable?: boolean;
};
declare const PnTableHeaderCell: <T>({ testId, sort, cellProps, handleClick, sortable, columnId, children, }: PnTableHeaderCellProps<T>) => JSX.Element;
export default PnTableHeaderCell;
