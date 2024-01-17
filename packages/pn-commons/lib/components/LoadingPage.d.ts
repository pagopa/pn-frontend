/// <reference types="react" />
import { GridSize, SxProps } from '@mui/material';
type Props = {
    renderType?: 'whole' | 'part';
    layout?: Array<{
        id: string;
        lg?: boolean | GridSize;
        md?: boolean | GridSize;
        sm?: boolean | GridSize;
        xl?: boolean | GridSize;
        xs?: boolean | GridSize;
    }>;
    sx?: SxProps;
};
declare const LoadingPage: ({ renderType, layout, sx }: Props) => JSX.Element;
export default LoadingPage;
