import React, { JSXElementConstructor } from 'react';

import { Button, ButtonProps, DialogProps, DialogTitle } from '@mui/material';
import { PnDialog, PnDialogActions, PnDialogContent } from '@pagopa-pn/pn-commons';

type Props = {
  open: boolean;
  title: string;
  id: string;
  slots?: {
    confirmButton: JSXElementConstructor<ButtonProps>;
    closeButton?: JSXElementConstructor<ButtonProps>;
  };
  slotsProps?: {
    confirmButton?: ButtonProps;
    closeButton?: ButtonProps;
    container?: Omit<DialogProps, 'id' | 'aria-labelledby' | 'aria-describedby'>;
  };
  children?: React.ReactNode;
};

const ConfirmationModal: React.FC<Props> = ({
  open,
  title,
  id,
  slots,
  slotsProps,
  children,
}: Props) => {
  const ConfirmButton = slots?.confirmButton || Button;
  const CloseButton = slots?.closeButton;

  return (
    <PnDialog
      id={id}
      open={open}
      onClose={slotsProps?.closeButton?.onClick}
      {...slotsProps?.container}
      aria-labelledby={`confirmation-dialog-title`}
      aria-describedby={`confirmation-dialog-${id}-description`}
      maxWidth="sm"
      data-testid={`confirmation-dialog-${id}`}
    >
      <DialogTitle id={`confirmation-dialog-title`}>{title}</DialogTitle>
      {children && (
        <PnDialogContent id={`confirmation-dialog-${id}-description`}>{children}</PnDialogContent>
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
        <ConfirmButton
          id="dialog-confirm-button"
          color="primary"
          variant="contained"
          data-testid="confirmButton"
          {...slotsProps?.confirmButton}
        />
      </PnDialogActions>
    </PnDialog>
  );
};

export default ConfirmationModal;
