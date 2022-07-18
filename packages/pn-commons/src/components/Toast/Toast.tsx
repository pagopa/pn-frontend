import { useState, Fragment, useEffect } from 'react';
import { Grid, Typography, Box, IconButton, Alert } from '@mui/material'; // SvgIcon
import CloseIcon from '@mui/icons-material/Close';

import { useIsMobile } from '../../hooks';
import { MessageType } from '../../types';

type Props = {
  /** whether the sneakbar should be open or not */
  open: boolean;
  /** title to be shown */
  title: string;
  /** message type (error, success, info, warning) */
  type: MessageType;
  /** message to be shown */
  message: React.ReactNode;
  /** A closing delay: if specified the sneakbar would close itself */
  closingDelay?: number;
  /** onClose action */
  onClose?: () => void;
  variant?: 'outlined' | 'standard' | 'filled';
};

/**
 * Sneakbar provided for user feedback
 * @param Props
 */
const Toast = ({
  title,
  message,
  open,
  type,
  closingDelay,
  onClose,
  variant = 'outlined',
}: Props) => {
  const [openStatus, setOpenStatus] = useState(open);
  const isMobile = useIsMobile();

  const closeToast = () => {
    setOpenStatus(false);
    if (onClose) {
      onClose();
    }
  };

  const getColor = new Map<MessageType, 'error' | 'warning' | 'success' | 'info'>([
    [MessageType.ERROR, 'error'],
    [MessageType.WARNING, 'warning'],
    [MessageType.SUCCESS, 'success'],
    [MessageType.INFO, 'info'],
  ]);

  useEffect(() => {
    if (closingDelay && openStatus) {
      const timer = setTimeout(() => {
        closeToast();
      }, closingDelay);
      return () => clearTimeout(timer);
    }
    return;
  }, []);

  return (
    <Fragment>
      {openStatus && (
        <Box px={2} data-testid="toastContainer">
          <Alert
            sx={{
              position: 'fixed',
              bottom: '64px',
              right: isMobile ? '5%' : '64px',
              zIndex: 100,
              width: isMobile ? 'calc(100vw - 10%)' : '376px',
              '& .MuiAlert-message': {
                width: '100%',
              },
            }}
            variant={variant}
            severity={getColor.get(type)}
          >
            <Grid container>
              <Grid item xs={10}>
                <Typography pb={1} fontWeight={600} fontSize={'16px'}>
                  {title}
                </Typography>
                <Typography variant="body2">{message}</Typography>
              </Grid>
              <Grid item xs={2}>
                <IconButton onClick={closeToast} aria-label="Close toast icon">
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Alert>
        </Box>
      )}
    </Fragment>
  );
};

export default Toast;
