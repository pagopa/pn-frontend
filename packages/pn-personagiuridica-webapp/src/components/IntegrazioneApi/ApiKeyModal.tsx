import { ReactNode } from 'react';

import { Button, DialogTitle, Typography } from '@mui/material';
import { PnDialog, PnDialogActions, PnDialogContent } from '@pagopa-pn/pn-commons';

export type ApiKeyModalProps = {
  title: string;
  subTitle: ReactNode;
  content?: ReactNode;
  closeButtonLabel: string;
  closeModalHandler: () => void;
  actionButtonLabel?: string;
  actionHandler?: () => void;
  closeButtonVariant?: 'text' | 'outlined' | 'contained';
  buttonIcon?: ReactNode;
  hasDeleteButton?: boolean;
};

const ApiKeyModal = ({
  title,
  subTitle,
  content,
  closeButtonLabel,
  closeModalHandler,
  actionButtonLabel,
  actionHandler,
  closeButtonVariant = 'outlined',
  buttonIcon,
  hasDeleteButton,
}: ApiKeyModalProps) => (
  <PnDialog open onClose={closeModalHandler} fullWidth>
    <DialogTitle>{title}</DialogTitle>
    <PnDialogContent>
      <Typography
        id="subtitle-top"
        data-testid="subtitle-top"
        variant="body1"
        sx={{ mb: content ? 2 : 0 }}
      >
        {subTitle}
      </Typography>
      {content}
    </PnDialogContent>
    <PnDialogActions>
      <Button
        id="close-modal-button"
        data-testid="close-modal-button"
        variant={closeButtonVariant}
        onClick={closeModalHandler}
        autoFocus={!actionButtonLabel}
      >
        {closeButtonLabel}
      </Button>
      {actionButtonLabel && (
        <Button
          id="action-modal-button"
          data-testid="action-modal-button"
          variant="contained"
          onClick={actionHandler}
          color={hasDeleteButton ? 'error' : 'primary'}
          sx={hasDeleteButton ? { color: 'white' } : null}
          autoFocus
        >
          {buttonIcon}
          {actionButtonLabel}
        </Button>
      )}
    </PnDialogActions>
  </PnDialog>
);

export default ApiKeyModal;
