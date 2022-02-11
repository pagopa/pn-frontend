import { useState } from 'react';

import Chip from '@mui/material/Chip';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { styled } from '@mui/material/styles';

// TODO: utilizzare colori tema
const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(() => ({ // { theme }
  [`& .${tooltipClasses.arrow}`]: {
    color: '#455B71',
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#455B71'
  },
  [`& .${tooltipClasses.tooltip} .title`]: {
    textAlign: 'center'
  }
}));

function StatusTooltip(props: {tooltip: string; label: string}) {
  const [title, body] = props.tooltip.split(':');

  const tooltipContent = 
    <div>
      <div className="title">{title.trim().toUpperCase()}</div>
      <div>{body.trim()}</div>
    </div>;
  
    // tooltip state
    const [open, setOpen] = useState(false);
    const handleTooltipClose = () => {
      setOpen(false);
    };
    const handleTooltipOpen = () => {
      setOpen(true);
    };

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <div>
        <BootstrapTooltip  
          title={tooltipContent}
          arrow
          placement="bottom"
          PopperProps={{
            disablePortal: true,
          }}
          onClose={handleTooltipClose}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
        >
          <Chip label={props.label} onClick={handleTooltipOpen}/>
        </BootstrapTooltip >
      </div>
    </ClickAwayListener>
  );
}

export default StatusTooltip;