import { Fragment } from 'react';
import Chip from '@mui/material/Chip';

import CustomTooltip from '../CustomTooltip';

const StatusTooltip = ({
  tooltip,
  label,
  color,
}: {
  tooltip: string;
  label: string;
  color: 'warning' | 'error' | 'success' | 'info' | 'default' | 'primary' | 'secondary' | undefined;
}) => {
  const tooltipContent = <Fragment>{tooltip}</Fragment>;

  return (
    <CustomTooltip openOnClick={false} tooltipContent={tooltipContent}>
      <Chip label={label} color={color} sx={{cursor: 'default'}}/>
    </CustomTooltip>
  );
};

export default StatusTooltip;
