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
  const tooltipContent = <Fragment>{tooltip}</Fragment>;
  const isMobile = useIsMobile();

  return (
    <CustomTooltip openOnClick={false} tooltipContent={tooltipContent} tooltipProps={tooltipProps}>
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
        aria-describedby={`tooltip-${label}`}
      />
    </CustomTooltip>
  );
};

export default StatusTooltip;
