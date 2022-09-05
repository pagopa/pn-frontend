import { MouseEventHandler, ReactNode, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContentText, DialogActions } from '@mui/material';

import { useIsMobile } from '../hooks';

type Props = {
  open: boolean;
  title: string;
  message: ReactNode;
  onConfirm?: MouseEventHandler<HTMLButtonElement>;
  onConfirmLabel?: string;
  handleClose?: () => void;
  initTimeout?: boolean;
};

/* eslint-disable functional/no-let */
let timeout: NodeJS.Timeout;

/**
 * Session Modal to handle end of session or unauthenticated scenarios.
 * @param open boolean - if modal is open or no
 * @param title string - title of the modal
 * @param message string - message to show inside the modal
 * @param onConfirm action to perform when user click on "confirm" button
 * @param onConfirmLabel label to show on confirm button, default is "Riprova"
 * @param handleClose action to perform when closing modal when clicking outside of it
 * @param initTimeout init timeout after which modal close
 */
const SessionModal = ({
  open,
  title,
  message,
  onConfirm,
  onConfirmLabel = 'Riprova',
  handleClose,
  initTimeout = false,
}: Props) => {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!initTimeout) {
      return;
    }
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      if (handleClose) {
        handleClose();
      }
    }, 2000);

    // clean function
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="session-dialog-title">
      <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>{title}</DialogTitle>
      <DialogContentText id="session-dialog-description" sx={{ textAlign: 'center', px: 3, pb: 1 }}>
        {message}
      </DialogContentText>
      <DialogActions
        sx={{ textAlign: 'center', flexDirection: isMobile ? 'column' : 'row', padding: 3 }}
      >
        {onConfirm && (
          <Button sx={{ width: '100%' }} color="primary" variant="contained" onClick={onConfirm}>
            {onConfirmLabel}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SessionModal;
