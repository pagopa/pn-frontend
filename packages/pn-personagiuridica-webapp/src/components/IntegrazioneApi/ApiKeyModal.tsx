import { ReactNode } from 'react';

import { Button, DialogTitle, Typography } from '@mui/material';
import { PnDialog, PnDialogActions, PnDialogContent } from '@pagopa-pn/pn-commons';

export type ApiKeyModalProps = {
  title: string;
  subTitle?: ReactNode;
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
  <PnDialog open onClose={closeModalHandler}>
    {title && <DialogTitle>{title}</DialogTitle>}
    <PnDialogContent>
      {subTitle && (
        <Typography
          id="subtitle-top"
          data-testid="subtitle-top"
          variant="body1"
          sx={{ mb: content ? 2 : 0 }}
        >
          {subTitle}
        </Typography>
      )}
      {content}
    </PnDialogContent>
    <PnDialogActions>
      <Button
        id="close-modal-button"
        data-testid="close-modal-button"
        variant={closeButtonVariant}
        onClick={closeModalHandler}
      >
        {closeButtonLabel}
      </Button>
      {actionButtonLabel && (
        <Button
          id="action-modal-button"
          data-testid="action-modal-button"
          variant="contained"
          onClick={actionHandler}
          sx={
            hasDeleteButton
              ? {
                  color: 'white',
                  backgroundColor: 'error.dark',
                  ':hover': { backgroundColor: 'error.main' },
                }
              : null
          }
        >
          {buttonIcon}
          {actionButtonLabel}
        </Button>
      )}
    </PnDialogActions>
  </PnDialog>
);

export default ApiKeyModal;
