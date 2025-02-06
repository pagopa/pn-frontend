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
  const tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`;

  const handleFocus = () => {
    handleTooltipOpen();
  };

  const handleMouseOver = () => {
    handleTooltipOpen();
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
      aria-live="polite"
      aria-describedby={open ? tooltipId : undefined}
      {...tooltipProps}
    >
      {openOnClick
        ? cloneElement(children, {
            onClick: () => handleTooltipOpen(),
            'aria-describedby': tooltipId,
          })
        : cloneElement(children, {
            onFocus: handleFocus,
            onMouseOver: handleMouseOver,
            'aria-describedby': tooltipId,
            tabIndex: 0,
          })}
    </Tooltip>
  );
};

export default CustomTooltip;
