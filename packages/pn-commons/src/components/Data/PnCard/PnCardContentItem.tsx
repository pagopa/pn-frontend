import React from 'react';

import { Box, Typography } from '@mui/material';

type Props = {
  children: React.ReactNode;
  label: React.ReactNode;
  wrappedInTypography?: boolean;
};

const PnCardContentItem: React.FC<Props> = ({ children, label, wrappedInTypography = true }) => (
  <>
    <Typography sx={{ fontWeight: 'bold' }} variant="caption" data-testid="cardBodyLabel">
      {label}
    </Typography>
    {wrappedInTypography && (
      <Typography variant="body2" data-testid="cardBodyValue">
        {children}
      </Typography>
    )}
    {!wrappedInTypography && <Box data-testid="cardBodyValue">{children}</Box>}
  </>
);

export default PnCardContentItem;
