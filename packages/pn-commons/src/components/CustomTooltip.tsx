import { cloneElement, useState } from 'react';

import Tooltip, { TooltipProps } from '@mui/material/Tooltip';

type Props = {
  tooltipContent: any;
  openOnClick: boolean;
  onOpen?: () => void;
  children: JSX.Element;
  tooltipProps?: Partial<TooltipProps>;
  id?: string;
};

const CustomTooltip: React.FC<Props> = ({
  openOnClick,
  tooltipContent,
  children,
  onOpen,
  tooltipProps,
  id,
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
    <Tooltip
      id={id}
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
      {openOnClick
        ? cloneElement(children, {
            onClick: handleTooltipOpen,
            'aria-describedby': open ? id : undefined,
          })
        : children}
    </Tooltip>
  );
};

export default CustomTooltip;
