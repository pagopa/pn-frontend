import { cloneElement, ReactElement, useState } from 'react'; // ReactNode, cloneElement
import Tooltip from '@mui/material/Tooltip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { Box, SxProps } from '@mui/material';

type Props = {
  tooltipContent: any;
  openOnClick: boolean;
  children: ReactElement<any, any>;
  sx?: SxProps;
  onOpen?: () => void;
};

function CustomTooltip({ openOnClick, tooltipContent, children, sx, onOpen }: Props) {
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
          PopperProps={{
            disablePortal: true,
          }}
          onClose={handleTooltipClose}
          open={openOnClick ? open : undefined}
          disableFocusListener={openOnClick}
          disableHoverListener={openOnClick}
          disableTouchListener={openOnClick}
          enterTouchDelay={0}
          onOpen={onOpen}
        >
          {cloneElement(children, {
            onClick: handleTooltipOpen,
          })}
        </Tooltip>
      </Box>
    </ClickAwayListener>
  );
}

export default CustomTooltip;
