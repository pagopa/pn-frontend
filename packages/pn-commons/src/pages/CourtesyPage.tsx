import React from 'react';

import { Box, Typography } from '@mui/material';
import { MIButton } from '@pagopa/mui-italia';

type Props = {
  icon?: React.ReactNode;
  title: string;
  subtitle?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onClickLabel?: string;
};

const CourtesyPage: React.FC<Props> = ({ icon, title, subtitle, onClick, onClickLabel }) => (
  <Box
    data-testid="courtesy-page"
    sx={{
      maxWidth: '480px',
      minHeight: '400px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      mx: 'auto',
      my: 12,
    }}
  >
    <Box sx={{ svg: { height: '64px' } }}>{icon}</Box>
    <Typography mt={4} mb={1} align="center" color="textPrimary" variant="h4">
      {title}
    </Typography>
    {subtitle && (
      <Typography align="center" color="textPrimary">
        {subtitle}
      </Typography>
    )}
    {onClick && (
      <MIButton
        id="courtesy-page-button"
        sx={{ marginTop: '24px' }}
        variant="contained"
        onClick={onClick}
      >
        {onClickLabel}
      </MIButton>
    )}
  </Box>
);

export default CourtesyPage;
