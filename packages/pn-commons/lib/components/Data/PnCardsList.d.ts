/// <reference types="react" />
import { SxProps } from '@mui/material';
type Props = {
    /** Custom style */
    sx?: SxProps;
    /** Cards test id */
    testId?: string;
    children: React.ReactNode;
};
declare const PnCardsList: React.FC<Props>;
export default PnCardsList;
