import { Fragment, ReactNode } from 'react';
import Chip from '@mui/material/Chip';

import CustomTooltip from '../CustomTooltip';

const StatusTooltip = ({
  tooltip,
  label,
  color,
  eventTrackingCallback,
}: {
  tooltip: string | ReactNode;
  label: string;
  color: 'warning' | 'error' | 'success' | 'info' | 'default' | 'primary' | 'secondary' | undefined;
  eventTrackingCallback?: () => void;
}) => {
  const tooltipContent = <Fragment>{tooltip}</Fragment>;

  return (
    <CustomTooltip openOnClick={false} tooltipContent={tooltipContent} onOpen={eventTrackingCallback}>
      <Chip label={label} color={color} sx={{ cursor: 'default' }} data-testid={`statusChip-${label}`} />
    </CustomTooltip>
  );
};

export default StatusTooltip;
