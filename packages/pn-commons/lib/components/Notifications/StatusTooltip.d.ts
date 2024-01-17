import { ReactNode } from 'react';
import { SxProps, TooltipProps } from '@mui/material';
declare const StatusTooltip: ({ tooltip, label, color, eventTrackingCallback, tooltipProps, chipProps, }: {
    tooltip: string | ReactNode;
    label: string;
    color: 'warning' | 'error' | 'success' | 'info' | 'default' | 'primary' | 'secondary' | undefined;
    eventTrackingCallback?: (() => void) | undefined;
    tooltipProps?: Partial<TooltipProps> | undefined;
    chipProps?: SxProps | undefined;
}) => JSX.Element;
export default StatusTooltip;
