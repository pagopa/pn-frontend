import { Fragment } from 'react';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';

import CustomTooltip from '../CustomTooltip';

const CustomChip = styled(Chip)(() => ({
  maxWidth: '100%',
  height: '100%',
  textAlign: 'center',

  '& .MuiChip-label': {
    overflowWrap: 'break-word',
    whiteSpace: 'normal',
    textOverflow: 'clip',
    padding: '5px 12px',
    lineHeight: '16px'
  }
}));

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
    <CustomTooltip openOnClick tooltipContent={tooltipContent}>
      <CustomChip label={label} color={color} />
    </CustomTooltip>
  );
};

export default StatusTooltip;
