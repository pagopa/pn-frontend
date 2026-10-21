import React, { JSXElementConstructor, ReactNode } from 'react';

import { Box, DialogActionsProps, DialogTitle } from '@mui/material';
import { PnDialog, PnDialogActions, PnDialogContent } from '@pagopa-pn/pn-commons';
import { MIButton, MIButtonProps } from '@pagopa/mui-italia';

import PnDialogIllustration from './PnDialog/PnDialogIllustration';

type Props = {
  open: boolean;
  title: string;
  contentAlign?: 'left' | 'center';
  slots?: {
    illustration?: ReactNode;
    confirmButton?: JSXElementConstructor<MIButtonProps>;
    closeButton?: JSXElementConstructor<MIButtonProps>;
  };
  slotsProps?: {
    confirmButton?: MIButtonProps;
    closeButton?: MIButtonProps;
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
  const ConfirmButton = slots?.confirmButton || MIButton;
  const CloseButton = slots?.closeButton;

  const actionsProps: DialogActionsProps = {
    ...slotsProps?.actions,
    sx: {
      ...(contentAlign === 'center' && { justifyContent: 'center' }),
      ...slotsProps?.actions?.sx,
    },
  };

  return (
    <PnDialog
      open={open}
      onClose={slotsProps?.closeButton?.onClick}
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
            variant="outlined"
            data-testid="closeButton"
            {...slotsProps?.closeButton}
          />
        )}
        <ConfirmButton
          id="dialog-confirm-button"
          variant="contained"
          data-testid="confirmButton"
          {...slotsProps?.confirmButton}
        />
      </PnDialogActions>
    </PnDialog>
  );
};

export default ConfirmationModal;
