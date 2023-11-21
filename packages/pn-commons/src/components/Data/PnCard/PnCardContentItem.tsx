import React from 'react';

import { Box, Typography } from '@mui/material';

type Props = {
  children: React.ReactNode;
  label: React.ReactNode;
  wrapValueInTypography?: boolean;
};

const PnCardContentItem: React.FC<Props> = ({ children, label, wrapValueInTypography = true }) => (
  <>
    <Typography sx={{ fontWeight: 'bold' }} variant="caption" data-testid="cardBodyLabel">
      {label}
    </Typography>
    {wrapValueInTypography && (
      <Typography variant="body2" data-testid="cardBodyValue">
        {children}
      </Typography>
    )}
    {!wrapValueInTypography && <Box data-testid="cardBodyValue">{children}</Box>}
  </>
);

export default PnCardContentItem;
