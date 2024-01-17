/// <reference types="react" />
import { SxProps } from '@mui/material';
import { TooltipProps } from '@mui/material/Tooltip';
type Props = {
    tooltipContent: any;
    openOnClick: boolean;
    sx?: SxProps;
    onOpen?: () => void;
    children: JSX.Element;
    tooltipProps?: Partial<TooltipProps>;
};
declare const CustomTooltip: React.FC<Props>;
export default CustomTooltip;
