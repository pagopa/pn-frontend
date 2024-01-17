import { jsx as _jsx } from "react/jsx-runtime";
import { Fragment } from 'react';
import Chip from '@mui/material/Chip';
import CustomTooltip from '../CustomTooltip';
const StatusTooltip = ({ tooltip, label, color, eventTrackingCallback, tooltipProps, chipProps, }) => {
    const tooltipContent = _jsx(Fragment, { children: tooltip });
    return (_jsx(CustomTooltip, { openOnClick: false, tooltipContent: tooltipContent, onOpen: eventTrackingCallback, tooltipProps: tooltipProps, children: _jsx(Chip, { id: `status-chip-${label}`, label: label, color: color, sx: { ...chipProps, cursor: 'default' }, "data-testid": `statusChip-${label}` }) }));
};
export default StatusTooltip;
