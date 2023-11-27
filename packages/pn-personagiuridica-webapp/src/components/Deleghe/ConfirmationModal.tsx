import * as React from 'react';

import { Button, DialogContentText, DialogTitle } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { PnDialog, PnDialogActions, PnDialogContent } from '@pagopa-pn/pn-commons';

type Props = {
  open: boolean;
  title: string;
  subtitle?: string | JSX.Element;
  onConfirm?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  onConfirmLabel?: string;
  onClose: React.MouseEventHandler<HTMLButtonElement> | undefined;
  onCloseLabel?: string;
  minHeight?: string;
  width?: string;
};
export default function ConfirmationModal({
  open,
  title,
  subtitle = '',
  onConfirm,
  onConfirmLabel = 'Riprova',
  onClose,
  onCloseLabel = 'Annulla',
}: Props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <PnDialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
      data-testid="confirmationDialog"
    >
      <DialogTitle id="dialog-title">{title}</DialogTitle>
      <PnDialogContent sx={{ pt: 2 }}>
        <DialogContentText id="dialog-description">{subtitle}</DialogContentText>
      </PnDialogContent>
      <PnDialogActions>
        <Button
          id="dialog-close-button"
          onClick={onClose}
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
