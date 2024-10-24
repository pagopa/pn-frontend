import { ReactNode } from 'react';

import { Box } from '@mui/material';

type Props = {
  children: ReactNode;
};

export const FormBox = ({ children }: Props) => (
  <Box
    sx={{
      borderRadius: '8px',
      borderColor: 'divider',
      borderStyle: 'solid',
      borderWidth: '1px',
      padding: '24px',
      marginTop: '16px',
    }}
  >
    {children}
  </Box>
);
