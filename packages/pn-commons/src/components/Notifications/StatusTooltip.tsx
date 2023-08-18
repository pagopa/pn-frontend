import { Fragment, ReactNode } from 'react';

import { SxProps, TooltipProps } from '@mui/material';
import Chip from '@mui/material/Chip';

import CustomTooltip from '../CustomTooltip';

const StatusTooltip = ({
  tooltip,
  label,
  color,
  eventTrackingCallback,
  tooltipProps,
  chipProps,
}: {
  tooltip: string | ReactNode;
  label: string;
  color: 'warning' | 'error' | 'success' | 'info' | 'default' | 'primary' | 'secondary' | undefined;
  eventTrackingCallback?: () => void;
  tooltipProps?: Partial<TooltipProps>;
  chipProps?: SxProps;
}) => {
  const tooltipContent = <Fragment>{tooltip}</Fragment>;

  return (
    <CustomTooltip
      openOnClick={false}
      tooltipContent={tooltipContent}
      onOpen={eventTrackingCallback}
      tooltipProps={tooltipProps}
    >
      <Chip
        id="notification-status-tooltip"
        label={label}
        color={color}
        sx={{ ...chipProps, cursor: 'default' }}
        data-testid={`statusChip-${label}`}
      />
    </CustomTooltip>
  );
};

export default StatusTooltip;
