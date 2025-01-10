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
    <CustomTooltip
      openOnClick={isMobile}
      tooltipContent={tooltipContent}
      tooltipProps={tooltipProps}
    >
      <Chip
        id={`status-chip-${label}`}
        label={label}
        color={color}
        sx={{
          ...chipProps,
          cursor: 'default',
          '&:focus': {
            outline: '2px solid currentColor',
          },
        }}
        data-testid={`statusChip-${label}`}
        // for a11y
        onClick={() => {}}
      />
    </CustomTooltip>
  );
};

export default StatusTooltip;
