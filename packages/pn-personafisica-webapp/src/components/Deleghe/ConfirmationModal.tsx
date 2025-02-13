import * as React from 'react';

import { Button, DialogTitle } from '@mui/material';
import { PnDialog, PnDialogActions } from '@pagopa-pn/pn-commons';

type Props = {
  open: boolean;
  title: string;
  onConfirm?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  onConfirmLabel?: string;
  handleClose: React.MouseEventHandler<HTMLButtonElement> | undefined;
  onCloseLabel?: string;
  width?: string;
};
export default function ConfirmationModal({
  open,
  title,
  onConfirm,
  onConfirmLabel = 'Riprova',
  handleClose,
  onCloseLabel = 'Annulla',
}: Props) {
  return (
    <PnDialog
      id="confirmation-dialog"
      open={open}
      onClose={handleClose}
      aria-labelledby="confirmation-dialog-delegations"
      maxWidth="lg"
    >
      <DialogTitle id="confirmation-dialog-delegations">{title}</DialogTitle>
      <PnDialogActions>
        <Button
          id="dialog-close-button"
          onClick={handleClose}
          color="primary"
          variant="outlined"
          data-testid="dialogAction"
        >
          {onCloseLabel}
        </Button>
        {onConfirm && (
          <Button
            id="dialog-action-button"
            color="primary"
            variant="contained"
            onClick={onConfirm}
            data-testid="dialogAction"
          >
            {onConfirmLabel}
          </Button>
        )}
      </PnDialogActions>
    </PnDialog>
  );
}
