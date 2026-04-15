import React, { ReactNode, useRef, useState } from 'react';

import { Box, SxProps, Theme, Typography } from '@mui/material';
import { MITooltip } from '@pagopa/mui-italia';

import { ValueMode } from '../../../models/SmartTable';

type Props = {
  children: ReactNode;
  label: ReactNode;
  mode?: ValueMode;
  wrapValueInTypography?: boolean;
  testId?: string;
};

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

const PnCardContentItem: React.FC<Props> = ({
  children,
  label,
  mode,
  wrapValueInTypography = true,
  testId,
}) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const valueRef = useRef<HTMLSpanElement>(null);

  const checkOverflow = () => {
    const el = valueRef.current;
    if (el) {
      const hasOverflow = el.scrollWidth > el.clientWidth;
      setIsTruncated(hasOverflow);
      return;
    }
    setIsTruncated(false);
  };

  return (
    <>
      <Typography
        sx={{ fontWeight: 'bold' }}
        variant="caption"
        data-testid={testId ? `${testId}Label` : null}
      >
        {label}
      </Typography>
      {wrapValueInTypography && (
        <MITooltip title={children} disabled={!isTruncated}>
          <Typography
            variant="body2"
            data-testid={testId ? `${testId}Value` : null}
            sx={{ ...(mode && strategies[mode]) }}
            ref={valueRef}
            onMouseEnter={checkOverflow}
            onTouchStart={checkOverflow}
            tabIndex={isTruncated ? 0 : undefined}
          >
            {children}
          </Typography>
        </MITooltip>
      )}
      {!wrapValueInTypography && (
        <MITooltip title={children} disabled={!isTruncated}>
          <Box
            data-testid={testId ? `${testId}Value` : null}
            sx={{ ...(mode && strategies[mode]) }}
            ref={valueRef}
            onMouseEnter={checkOverflow}
            onTouchStart={checkOverflow}
            tabIndex={isTruncated ? 0 : undefined}
          >
            {children}
          </Box>
        </MITooltip>
      )}
    </>
  );
};

export default PnCardContentItem;
