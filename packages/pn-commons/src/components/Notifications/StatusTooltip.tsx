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
  iun,
}: {
  tooltip: string | ReactNode;
  label: string;
  color: 'warning' | 'error' | 'success' | 'info' | 'default' | 'primary' | 'secondary' | undefined;
  tooltipProps?: Partial<TooltipProps>;
  chipProps?: SxProps;
  iun?: string;
}) => {
  const isMobile = useIsMobile();
  const tooltipContent = <Fragment key={`tooltip-${iun}`}>{tooltip}</Fragment>;

  return (
    <CustomTooltip
      openOnClick={isMobile}
      tooltipContent={tooltipContent}
      tooltipProps={{
        ...tooltipProps,
        id: `notification-status-${iun}`,
      }}
    >
      <Chip
        label={label}
        color={color}
        sx={{
          ...chipProps,
          cursor: 'default',
        }}
        data-testid={`statusChip-${label}-${iun}`}
      />
    </CustomTooltip>
  );
};

export default StatusTooltip;
