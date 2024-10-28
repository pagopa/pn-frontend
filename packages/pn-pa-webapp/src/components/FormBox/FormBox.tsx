import { ReactNode } from 'react';

import { Box } from '@mui/material';

type Props = {
  children: ReactNode;
};

export const FormBox = ({ children }: Props) => (
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
