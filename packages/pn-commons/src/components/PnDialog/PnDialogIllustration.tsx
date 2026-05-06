import { Box, BoxProps } from '@mui/material';

const PnDialogIllustration: React.FC<BoxProps> = ({ children, ...props }) => (
  <Box {...props}>{children}</Box>
);

export default PnDialogIllustration;
