import { MouseEventHandler, useEffect } from 'react';

import { Button, DialogContentText, DialogTitle } from '@mui/material';

import PnDialog from './PnDialog/PnDialog';
import PnDialogActions from './PnDialog/PnDialogActions';
import PnDialogContent from './PnDialog/PnDialogContent';

type Props = {
  open: boolean;
  title: string;
  message: React.ReactNode;
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
const SessionModal: React.FC<Props> = ({
  open,
  title,
  message,
  onConfirm,
  onConfirmLabel = 'Riprova',
  handleClose,
  initTimeout = false,
}) => {
  useEffect(() => {
    if (!initTimeout || !open) {
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
  }, [open]);

  return (
    <PnDialog
      open={open}
      onClose={handleClose}
      aria-labelledby="session-dialog-title"
      aria-describedby="session-dialog-description"
      data-testid="session-modal"
    >
      <DialogTitle id="session-dialog-title" sx={{ textAlign: 'center' }}>
        {title}
      </DialogTitle>
      <PnDialogContent>
        <DialogContentText id="session-dialog-description">{message}</DialogContentText>
      </PnDialogContent>
      {onConfirm && (
        <PnDialogActions>
          <Button
            sx={{ width: '100%' }}
            color="primary"
            variant="contained"
            data-testid="buttonOfSessionModal"
            onClick={onConfirm}
            autoFocus
          >
            {onConfirmLabel}
          </Button>
        </PnDialogActions>
      )}
    </PnDialog>
  );
};

export default SessionModal;
