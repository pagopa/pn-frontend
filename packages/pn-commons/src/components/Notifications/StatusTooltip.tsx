import { Fragment, ReactNode } from 'react';

import { SxProps, TooltipProps } from '@mui/material';
import Chip from '@mui/material/Chip';

import { useIsMobile } from '../../hooks';
import CustomTooltip from '../CustomTooltip';

const StatusTooltip = ({
  tooltip,
  label,
  color,
  tooltipProps,
  chipProps,
}: {
  tooltip: string | ReactNode;
  label: string;
  color: 'warning' | 'error' | 'success' | 'info' | 'default' | 'primary' | 'secondary' | undefined;
  tooltipProps?: Partial<TooltipProps>;
  chipProps?: SxProps;
}) => {
  const isMobile = useIsMobile();
  const tooltipContent = <Fragment>{tooltip}</Fragment>;

  return (
    <CustomTooltip
      openOnClick={isMobile}
      tooltipContent={tooltipContent}
      tooltipProps={tooltipProps}
    >
      <Chip
        id={`status-chip-${label}`}
        label={isMobile ? <span aria-hidden="true">{label}</span> : label}
        color={color}
        sx={{
          ...chipProps,
          cursor: 'default',
        }}
        data-testid={`statusChip-${label}`}
        aria-label={isMobile ? `${label}: ${tooltip}` : undefined}
        aria-describedby={`tooltip-${label}`} // Associa il chip al tooltip
      />
    </CustomTooltip>
  );
};

export default StatusTooltip;
