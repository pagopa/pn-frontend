import React from 'react';
import { Box, Button, Typography } from '@mui/material';

type Props = {
  icon?: React.ReactNode;
  title: string;
  subtitle?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onClickLabel?: string;
};

const SuccessPage = ({ icon, title, subtitle, onClick, onClickLabel }: Props) => (
  <Box
    sx={{
      maxWidth: '480px',
      minHeight: '400px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    mx={'auto'}
    mt={'3rem'}
  >
    {icon}
    <Typography align="center" color="textPrimary" variant="h4">
      {title}
    </Typography>
    {subtitle && (
      <Typography align="center" color="textPrimary" variant="subtitle2">
        {subtitle}
      </Typography>
    )}
    {onClick && (
      <Button sx={{ marginTop: '24px' }} variant="contained" onClick={onClick}>
        {onClickLabel}
      </Button>
    )}
  </Box>
);

export default SuccessPage;
