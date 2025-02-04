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
  const tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`; // Genera un ID unico per ogni tooltip

  // Funzione per gestire il focus su tastiera
  const handleFocus = () => {
    handleTooltipOpen(); // Apre il tooltip quando l'elemento riceve il focus
  };

  // Funzione per gestire il mouseover
  const handleMouseOver = () => {
    handleTooltipOpen(); // Apre il tooltip quando il mouse passa sopra l'elemento
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
      aria-live="polite" // Tooltip letto dal lettore di schermo quando visibile
      aria-describedby={open ? tooltipId : undefined} // Associa il tooltip se visibile
      {...tooltipProps}
    >
      {openOnClick
        ? cloneElement(children, {
            onClick: () => handleTooltipOpen(), // Apre il tooltip su click
            'aria-describedby': tooltipId, // Associa il tooltip all'elemento
          })
        : cloneElement(children, {
            onFocus: handleFocus, // Apre il tooltip su focus
            onMouseOver: handleMouseOver, // Apre il tooltip su mouseover
            'aria-describedby': tooltipId,
            tabIndex: 0, // Associa il tooltip all'elemento
          })}
    </Tooltip>
  );
};

export default CustomTooltip;
