import { cloneElement, useState } from 'react';

import { Box, SxProps } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
// ReactNode, cloneElement
import Tooltip, { TooltipProps } from '@mui/material/Tooltip';

type Props = {
  tooltipContent: any;
  openOnClick: boolean;
  sx?: SxProps;
  onOpen?: () => void;
  children: JSX.Element;
  tooltipProps?: Partial<TooltipProps>;
};

const CustomTooltip: React.FC<Props> = ({
  openOnClick,
  tooltipContent,
  children,
  sx,
  onOpen,
  tooltipProps,
}) => {
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

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <Box sx={sx}>
        <Tooltip
          arrow
          leaveTouchDelay={5000}
          title={tooltipContent}
          onClose={handleTooltipClose}
          open={openOnClick ? open : undefined}
          disableFocusListener={openOnClick}
          disableHoverListener={openOnClick}
          disableTouchListener={openOnClick}
          enterTouchDelay={0}
          onOpen={onOpen}
          {...tooltipProps}
        >
          {cloneElement(children, {
            onClick: openOnClick && handleTooltipOpen,
          })}
        </Tooltip>
      </Box>
    </ClickAwayListener>
  );
};

export default CustomTooltip;
