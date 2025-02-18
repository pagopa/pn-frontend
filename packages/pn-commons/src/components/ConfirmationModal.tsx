import * as React from 'react';

import { Button, DialogTitle } from '@mui/material';
import { PnDialog, PnDialogActions, PnDialogContent } from '@pagopa-pn/pn-commons';

type Props = {
  open: boolean;
  title: string;
  onConfirm?: React.MouseEventHandler<HTMLButtonElement>;
  onConfirmLabel?: string;
  onClose: React.MouseEventHandler<HTMLButtonElement> | undefined;
  onCloseLabel?: string;
  width?: string;
  children?: React.ReactNode;
};
export default function ConfirmationModal({
  open,
  title,
  onConfirm,
  onConfirmLabel = 'Riprova',
  onClose,
  onCloseLabel = 'Annulla',
  children,
}: Readonly<Props>) {
  return (
    <PnDialog
      id="confirmation-dialog"
      open={open}
      onClose={onClose}
      aria-labelledby="confirmation-dialog-title"
      maxWidth="sm"
      data-testid="confirmationDialog"
    >
      <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
      {children && <PnDialogContent>{children}</PnDialogContent>}
      <PnDialogActions>
        {onConfirm && (
          <Button
            id="dialog-confirm-button"
            color="primary"
            variant="contained"
            onClick={onConfirm}
            data-testid="confirmButton"
          >
            {onConfirmLabel}
          </Button>
        )}
        <Button
          id="dialog-close-button"
          color="primary"
          variant="outlined"
          onClick={onClose}
          data-testid="closeButton"
        >
          {onCloseLabel}
        </Button>
      </PnDialogActions>
    </PnDialog>
  );
}
