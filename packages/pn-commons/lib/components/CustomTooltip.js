import { jsx as _jsx } from "react/jsx-runtime";
import { cloneElement, useState } from 'react';
import { Box } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
// ReactNode, cloneElement
import Tooltip from '@mui/material/Tooltip';
const CustomTooltip = ({ openOnClick, tooltipContent, children, sx, onOpen, tooltipProps, }) => {
    // tooltip state
    const [open, setOpen] = useState(false);
    const handleTooltipClose = () => {
        if (openOnClick) {
            setOpen(false);
        }
    };
    const handleTooltipOpen = () => {
        if (openOnClick) {
            setOpen(!open);
        }
    };
    return (_jsx(ClickAwayListener, { onClickAway: handleTooltipClose, children: _jsx(Box, { sx: sx, children: _jsx(Tooltip, { arrow: true, leaveTouchDelay: 5000, title: tooltipContent, onClose: handleTooltipClose, open: openOnClick ? open : undefined, disableFocusListener: openOnClick, disableHoverListener: openOnClick, disableTouchListener: openOnClick, enterTouchDelay: 0, onOpen: onOpen, ...tooltipProps, children: cloneElement(children, {
                    onClick: handleTooltipOpen,
                }) }) }) }));
};
export default CustomTooltip;
