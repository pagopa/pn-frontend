/// <reference types="react" />
import { SxProps } from '@mui/material';
export type PnTableBodyCellProps = {
    testId?: string;
    cellProps?: SxProps;
    onClick?: () => void;
    children: React.ReactNode;
};
declare const PnTableBodyCell: React.FC<PnTableBodyCellProps>;
export default PnTableBodyCell;
