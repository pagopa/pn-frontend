import { Fragment, ReactNode } from 'react';

import { SxProps, TooltipProps } from '@mui/material';
import Chip from '@mui/material/Chip';

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
  const chipLabel = <span aria-label={`${label}: ${tooltip}`}>{label}</span>;

  return (
    <CustomTooltip openOnClick={false} tooltipContent={tooltipContent} tooltipProps={tooltipProps}>
      <Chip
        id={`status-chip-${label}`}
        label={chipLabel}
        color={color}
        sx={{
          ...chipProps,
          cursor: 'default',
        }}
        data-testid={`statusChip-${label}`}
      />
    </CustomTooltip>
  );
};

export default StatusTooltip;
