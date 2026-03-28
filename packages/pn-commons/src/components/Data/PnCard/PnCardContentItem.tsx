import React, { ReactNode } from 'react';

import { Box, SxProps, Theme, Typography } from '@mui/material';

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
}) => (
  <>
    <Typography
      sx={{ fontWeight: 'bold' }}
      variant="caption"
      data-testid={testId ? `${testId}Label` : null}
    >
      {label}
    </Typography>
    {wrapValueInTypography && (
      <Typography
        variant="body2"
        data-testid={testId ? `${testId}Value` : null}
        sx={{ ...(mode && strategies[mode]) }}
      >
        {children}
      </Typography>
    )}
    {!wrapValueInTypography && (
      <Box data-testid={testId ? `${testId}Value` : null} sx={{ ...(mode && strategies[mode]) }}>
        {children}
      </Box>
    )}
  </>
);

export default PnCardContentItem;
