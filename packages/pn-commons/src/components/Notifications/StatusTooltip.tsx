import { FC, Fragment, ReactNode, forwardRef } from 'react';

import { SxProps, TooltipProps } from '@mui/material';
import { MIChip } from '@pagopa/mui-italia';

import { useIsMobile } from '../../hooks/useIsMobile';
import CustomTooltip from '../CustomTooltip';

type Props = {
  tooltip: string | ReactNode;
  label: string;
  color: 'default' | 'info' | 'warning' | 'error' | 'success' | 'highlight' | 'neutral' | undefined;
  tooltipProps?: Partial<TooltipProps>;
  chipProps?: SxProps;
  ariaLabel?: string;
  useNewChip?: boolean;
};

const StatusTooltipChip = forwardRef<never, Omit<Props, 'tooltip'>>(
  ({ useNewChip, label, ariaLabel, color, chipProps, ...rest }, ref) => {
    const isMobile = useIsMobile();

    if (useNewChip) {
      return (
        <MIChip
          {...rest}
          id={`status-chip-${label}`}
          data-testid={`statusChip-${label}`}
          aria-label={ariaLabel}
          label={isMobile ? <span aria-hidden="true">{label}</span> : label}
          color={color ?? 'default'}
          sx={chipProps}
          ref={ref}
        />
      );
    }

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
          cursor: 'default',
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
  useNewChip,
}) => {
  const tooltipContent = <Fragment>{tooltip}</Fragment>;

  const computedAriaLabel = `${label}: ${tooltip}`;

  return (
    <CustomTooltip openOnClick={false} tooltipContent={tooltipContent} tooltipProps={tooltipProps}>
      <StatusTooltipChip
        label={label}
        aria-label={ariaLabel ?? computedAriaLabel}
        color={color}
        useNewChip={useNewChip}
        chipProps={chipProps}
      />
    </CustomTooltip>
  );
};

export default StatusTooltip;
