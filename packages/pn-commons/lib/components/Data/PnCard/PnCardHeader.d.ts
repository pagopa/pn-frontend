/// <reference types="react" />
import { GridProps } from '@mui/material';
type Props = {
    testId?: string;
    headerGridProps?: GridProps;
    children: React.ReactNode;
};
declare const PnCardHeader: React.FC<Props>;
export default PnCardHeader;
