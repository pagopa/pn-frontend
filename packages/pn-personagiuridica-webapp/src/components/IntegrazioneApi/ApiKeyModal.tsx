import { ReactNode } from 'react';

import { DialogTitle, Typography } from '@mui/material';
import { PnDialog, PnDialogActions, PnDialogContent } from '@pagopa-pn/pn-commons';
import { MIButton } from '@pagopa/mui-italia';

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
      <MIButton
        id="close-modal-button"
        data-testid="close-modal-button"
        variant={closeButtonVariant}
        onClick={closeModalHandler}
      >
        {closeButtonLabel}
      </MIButton>
      {actionButtonLabel && (
        <MIButton
          id="action-modal-button"
          data-testid="action-modal-button"
          variant="contained"
          onClick={actionHandler}
          color={hasDeleteButton ? 'error' : 'primary'}
          sx={hasDeleteButton ? { color: 'white' } : null}
        >
          {buttonIcon}
          {actionButtonLabel}
        </MIButton>
      )}
    </PnDialogActions>
  </PnDialog>
);

export default ApiKeyModal;
