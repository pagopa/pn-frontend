import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
};

export const FormBox = ({ children, title, subtitle }: Props) => (
  <Box
    // TODO dove prendo colore
    sx={{
      borderRadius: '8px',
      border: '1px solid #E3E7EB',
      padding: '24px',
      marginTop: '16px',
    }}
  >
    {title && (
      // TODO variante "Label and Link"
      <Typography variant="sidenav" fontWeight={600} fontSize={16}>
        {title}
      </Typography>
    )}
    {subtitle && (
      <Typography variant="body2">
        {subtitle}
      </Typography>
    )}
    {children}
  </Box>
);
