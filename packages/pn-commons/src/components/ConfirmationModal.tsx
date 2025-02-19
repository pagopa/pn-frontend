import * as React from 'react';

import { Button, ButtonProps, DialogTitle } from '@mui/material';
import { PnDialog, PnDialogActions, PnDialogContent } from '@pagopa-pn/pn-commons';

type Props = {
  open: boolean;
  title: string;
  slotsProps?: {
    confirmButton?: ButtonProps;
    closeButton?: ButtonProps;
  };
  onConfirmLabel?: string;
  onCloseLabel?: string;
  children?: React.ReactNode;
};
const ConfirmationModal: React.FC<Props> = ({
  open,
  title,
  slotsProps,
  onConfirmLabel = 'Riprova',
  onCloseLabel = 'Annulla',
  children,
}: Props) => (
  <PnDialog
    id="confirmation-dialog"
    open={open}
    onClose={slotsProps?.closeButton?.onClick}
    aria-labelledby="confirmation-dialog-title"
    aria-describedby="confirmation-dialog-description"
    maxWidth="sm"
    data-testid="confirmationDialog"
  >
    <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
    {children && <PnDialogContent>{children}</PnDialogContent>}
    <PnDialogActions>
      <Button
        id="dialog-close-button"
        color="primary"
        variant="outlined"
        data-testid="closeButton"
        {...slotsProps?.closeButton}
      >
        {onCloseLabel}
      </Button>
      <Button
        id="dialog-confirm-button"
        color="primary"
        variant="contained"
        data-testid="confirmButton"
        {...slotsProps?.confirmButton}
      >
        {onConfirmLabel}
      </Button>
    </PnDialogActions>
  </PnDialog>
);

export default ConfirmationModal;
