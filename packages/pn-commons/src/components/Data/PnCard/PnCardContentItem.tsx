import React, { ReactChild, ReactFragment } from 'react';

import { Box, Typography } from '@mui/material';

type Props = {
  children: ReactChild | ReactFragment;
  label: ReactChild | ReactFragment;
  wrapValueInTypography?: boolean;
  testId?: string;
};

const PnCardContentItem: React.FC<Props> = ({
  children,
  label,
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
      <Typography variant="body2" data-testid={testId ? `${testId}Value` : null}>
        {children}
      </Typography>
    )}
    {!wrapValueInTypography && <Box data-testid={testId ? `${testId}Value` : null}>{children}</Box>}
  </>
);

export default PnCardContentItem;
