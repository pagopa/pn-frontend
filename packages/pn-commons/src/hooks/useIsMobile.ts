import { Theme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

/**
 * Checks if we are on a mobile device
 */
export const useIsMobile = () => useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));
