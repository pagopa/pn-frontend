import { ReactChild, ReactFragment } from 'react';
import { GridProps } from '@mui/material';
export type PnCardHeaderItemProps = {
    gridProps?: GridProps;
    children: ReactChild | ReactFragment;
    position?: string;
    testId?: string;
};
declare const PnCardHeaderItem: React.FC<PnCardHeaderItemProps>;
export default PnCardHeaderItem;
