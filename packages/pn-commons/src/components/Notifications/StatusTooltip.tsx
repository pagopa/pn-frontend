import { FC, Fragment, ReactNode, forwardRef } from 'react';

import { ChipProps, TooltipProps } from '@mui/material';
import { MIChip, MIChipProps } from '@pagopa/mui-italia';

import { useIsMobile } from '../../hooks/useIsMobile';
import CustomTooltip from '../CustomTooltip';

type Props = {
  tooltip: string | ReactNode;
  label: string;
  color: MIChipProps['color'];
  tooltipProps?: Partial<TooltipProps>;
  chipProps?: ChipProps['sx'];
  ariaLabel?: string;
};

const StatusTooltipChip = forwardRef<never, Omit<Props, 'tooltip'>>(
  ({ label, ariaLabel, color, chipProps, ...rest }, ref) => {
    const isMobile = useIsMobile();

    return (
      <MIChip
        {...rest}
        id={`status-chip-${label}`}
        data-testid={`statusChip-${label}`}
        aria-label={ariaLabel}
        label={isMobile ? <span aria-hidden="true">{label}</span> : label}
        color={color ?? 'default'}
        sx={{
          ...chipProps,
          textAlign: 'center',
          '& .MuiChip-label': { whiteSpace: 'normal', wordWrap: 'break-word' },
        }}
        ref={ref}
      />
    );
  }
);

const StatusTooltip: FC<Props> = ({
  tooltip,
  label,
  color,
  tooltipProps,
  chipProps,
  ariaLabel,
}) => {
  const tooltipContent = <Fragment>{tooltip}</Fragment>;

  const computedAriaLabel = `${label}: ${tooltip}`;

  return (
    <CustomTooltip openOnClick={false} tooltipContent={tooltipContent} tooltipProps={tooltipProps}>
      <StatusTooltipChip
        label={label}
        aria-label={ariaLabel ?? computedAriaLabel}
        color={color}
        chipProps={chipProps}
      />
    </CustomTooltip>
  );
};

export default StatusTooltip;
