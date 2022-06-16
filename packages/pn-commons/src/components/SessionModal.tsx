import * as React from 'react';
import { Button, DialogTitle, DialogContentText, DialogActions } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { useIsMobile } from '../hooks/IsMobile';

type Props = {
  open: boolean;
  title: string;
  message: React.ReactNode;
  onConfirm?: React.MouseEventHandler<HTMLButtonElement>;
  onConfirmLabel?: string;
  handleClose?: React.MouseEventHandler<HTMLButtonElement>;
};

/**
 * Session Modal to handle end of session or unauthenticated scenarios.
 * @param open boolean - if modal is open or no
 * @param title string - title of the modal
 * @param message string - message to show inside the modal
 * @param onConfirm action to perform when user click on "confirm" button
 * @param onConfirmLabel label to show on confirm button, default is "Riprova"
 * @param handleClose action to perform when closing modal when clicking outside of it
 */
const SessionModal = ({
  open,
  title,
  message,
  onConfirm,
  onConfirmLabel = 'Riprova',
  handleClose,
}: Props) => {
  const isMobile = useIsMobile();

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
