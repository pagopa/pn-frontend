import { cloneElement, ReactElement, useState } from 'react'; // ReactNode, cloneElement
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

type Props = {
  tooltipContent: any;
  openOnClick: boolean;
  children: ReactElement<any, any>;
};

// TODO: utilizzare colori tema
const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(() => ({
  // { theme }
  [`& .${tooltipClasses.arrow}`]: {
    color: '#455B71',
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#455B71',
  },
  [`& .${tooltipClasses.tooltip} .title`]: {
    textAlign: 'center',
  },
}));

function CustomTooltip({openOnClick, tooltipContent, children}: Props) {
  // tooltip state
  const [open, setOpen] = useState(false);
  const handleTooltipClose = () => {
    if (openOnClick) {
      setOpen(false);
    }
  };

  const handleTooltipOpen = () => {
    if (openOnClick) {
      setOpen(true);
    }
  };

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <Box>
        <BootstrapTooltip
          title={tooltipContent}
          arrow
          placement="bottom"
          PopperProps={{
            disablePortal: true,
          }}
          onClose={handleTooltipClose}
          open={open}
          disableFocusListener={openOnClick}
          disableHoverListener={openOnClick}
          disableTouchListener={openOnClick}
        >
          {cloneElement(children, {
            onClick: handleTooltipOpen,
          })}
        </BootstrapTooltip>
      </Box>
    </ClickAwayListener>
  );
}

export default CustomTooltip;
