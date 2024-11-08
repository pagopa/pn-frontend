import { ReactNode } from 'react';

import { Box, Typography } from '@mui/material';

export const FormBox = ({ testid, children }: { testid?: string; children: ReactNode }) => (
  <Box
    data-testid={testid}
    sx={{
      borderRadius: '8px',
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
  <Typography variant="body2" fontSize={'14px'} marginTop={1} marginBottom={1}>
    {text}
  </Typography>
);
