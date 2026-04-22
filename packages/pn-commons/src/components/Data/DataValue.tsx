import { ComponentProps, ElementType, ReactNode, useRef } from 'react';

import { Box, SxProps, Theme } from '@mui/material';
import { MITooltip, useIsTruncated } from '@pagopa/mui-italia';

import { ValueMode } from '../../models/SmartTable';

interface Props<T extends ElementType = typeof Box> {
  mode?: ValueMode;
  children: ReactNode;
  slots?: {
    root?: T;
  };
  slotProps?: {
    root?: ComponentProps<T>;
  };
  'data-testid'?: string;
}

const strategies: Record<ValueMode, SxProps<Theme>> = {
  truncate: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  wrap: {
    whiteSpace: 'normal',
    wordBreak: 'break-word',
  },
};

const DataValue = <T extends React.ElementType = typeof Box>({
  children,
  mode,
  slots,
  slotProps,
  'data-testid': dataTestId,
}: Props<T>) => {
  const valueRef = useRef<HTMLElement>(null);
  const isTruncated = useIsTruncated<HTMLElement>(valueRef, mode === 'truncate');

  const RootComponent = slots?.root ?? Box;
  const rootProps = slotProps?.root ?? {};
  const { sx: extRootSx, ...restRootProps } = rootProps as { sx?: SxProps<Theme> };
  const rootSx = { ...extRootSx, ...(mode && strategies[mode]) };

  return (
    <MITooltip title={children} disabled={!isTruncated}>
      <RootComponent
        {...restRootProps}
        ref={valueRef}
        tabIndex={isTruncated ? 0 : undefined}
        sx={rootSx}
        data-testid={dataTestId}
      >
        {children}
      </RootComponent>
    </MITooltip>
  );
};

// eslint-disable-next-line functional/immutable-data
DataValue.displayName = 'DataValue';
export default DataValue;
