import { cloneElement, useState } from 'react';

import Tooltip, { TooltipProps } from '@mui/material/Tooltip';

type Props = {
  tooltipContent: any;
  openOnClick: boolean;
  onOpen?: () => void;
  children: JSX.Element;
  tooltipProps?: Partial<TooltipProps>;
};

const CustomTooltip: React.FC<Props> = ({
  openOnClick,
  tooltipContent,
  children,
  onOpen,
  tooltipProps,
}) => {
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
    <Tooltip
      arrow
      leaveTouchDelay={5000}
      title={tooltipContent}
      onClose={handleTooltipClose}
      open={openOnClick ? open : undefined}
      disableHoverListener={openOnClick}
      enterTouchDelay={0}
      onOpen={onOpen}
      {...tooltipProps}
    >
      {children}
    </Tooltip>
  );
};

export default CustomTooltip;
