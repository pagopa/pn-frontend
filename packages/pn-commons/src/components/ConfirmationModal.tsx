import React, { JSXElementConstructor } from 'react';

import { ButtonProps, DialogTitle } from '@mui/material';
import { PnDialog, PnDialogActions, PnDialogContent } from '@pagopa-pn/pn-commons';

type Props = {
  open: boolean;
  title: string;
  slots?: {
    confirmButton?: JSXElementConstructor<ButtonProps>;
    closeButton?: JSXElementConstructor<ButtonProps>;
  };
  slotsProps?: {
    confirmButton?: ButtonProps;
    closeButton?: ButtonProps;
  };
  children?: React.ReactNode;
};

const ConfirmationModal: React.FC<Props> = ({
  open,
  title,
  slots,
  slotsProps,
  children,
}: Props) => {
  const ConfirmButton = slots?.confirmButton;
  const CloseButton = slots?.closeButton;

  return (
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
      {children && (
        <PnDialogContent id="confirmation-dialog-description">{children}</PnDialogContent>
      )}
      <PnDialogActions>
        {CloseButton && (
          <CloseButton
            id="dialog-close-button"
            color="primary"
            variant="outlined"
            data-testid="closeButton"
            {...slotsProps?.closeButton}
          />
        )}
        {ConfirmButton && (
          <ConfirmButton
            id="dialog-confirm-button"
            color="primary"
            variant="contained"
            data-testid="confirmButton"
            {...slotsProps?.confirmButton}
          />
        )}
      </PnDialogActions>
    </PnDialog>
  );
};

export default ConfirmationModal;
