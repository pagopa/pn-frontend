import { ReactNode } from 'react';

import { Box, Typography } from '@mui/material';

export const FormBox = ({ children }: { children: ReactNode }) => (
  <Box
    sx={{
      borderRadius: 1,
      borderColor: 'divider',
      borderStyle: 'solid',
      borderWidth: '1px',
      padding: 3,
      marginTop: 2,
    }}
  >
    {children}
  </Box>
);

export const FormBoxTitle = ({ text }: { text: string }) => (
  <Typography variant="sidenav" fontWeight={600} fontSize={'16px'}>
    {text}
  </Typography>
);

export const FormBoxSubtitle = ({ text }: { text: string }) => (
  <Typography variant="body2" fontSize={'14px'} marginTop={0.5}>
    {text}
  </Typography>
);
