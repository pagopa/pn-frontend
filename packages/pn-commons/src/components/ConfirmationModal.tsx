import React, { JSXElementConstructor, ReactNode } from 'react';

import {
  Box,
  Button,
  ButtonProps,
  DialogActionsProps,
  DialogTitle,
  SxProps,
  Theme,
} from '@mui/material';
import { PnDialog, PnDialogActions, PnDialogContent } from '@pagopa-pn/pn-commons';

import PnDialogIllustration from './PnDialog/PnDialogIllustration';

type Props = {
  open: boolean;
  title: string;
  contentAlign?: 'left' | 'center';
  slots?: {
    illustration?: ReactNode;
    confirmButton?: JSXElementConstructor<ButtonProps>;
    closeButton?: JSXElementConstructor<ButtonProps>;
  };
  slotsProps?: {
    confirmButton?: ButtonProps;
    closeButton?: ButtonProps;
    actions?: DialogActionsProps;
  };
  children?: React.ReactNode;
};

const ConfirmationModal: React.FC<Props> = ({
  open,
  title,
  contentAlign = 'left',
  slots,
  slotsProps,
  children,
}: Props) => {
  const illustration = slots?.illustration;
  const ConfirmButton = slots?.confirmButton || Button;
  const CloseButton = slots?.closeButton;

  const actionsProps: DialogActionsProps = {
    ...slotsProps?.actions,
    sx:
      contentAlign === 'center'
        ? ([{ justifyContent: 'center' }, slotsProps?.actions?.sx] as SxProps<Theme>)
        : slotsProps?.actions?.sx,
  };

  return (
    <PnDialog
      open={open}
      onClose={(_, reason) => {
        if (reason === 'backdropClick') {
          return;
        }

        slotsProps?.closeButton?.onClick?.({} as React.MouseEvent<HTMLButtonElement>);
      }}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      maxWidth="sm"
      data-testid="confirmationDialog"
    >
      {illustration && (
        <PnDialogIllustration
          sx={{
            display: 'flex',
            justifyContent: contentAlign === 'center' ? 'center' : 'flex-start',
          }}
        >
          {illustration}
        </PnDialogIllustration>
      )}
      <DialogTitle id="confirmation-dialog-title" sx={{ textAlign: contentAlign }}>
        {title}
      </DialogTitle>
      {children && (
        <PnDialogContent id="confirmation-dialog-description">
          <Box sx={{ textAlign: contentAlign }}>{children}</Box>
        </PnDialogContent>
      )}
      <PnDialogActions {...actionsProps}>
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
