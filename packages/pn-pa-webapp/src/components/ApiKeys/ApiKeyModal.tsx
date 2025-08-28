import { ReactNode } from 'react';

import { Button, DialogTitle, Typography } from '@mui/material';
import { PnDialog, PnDialogActions, PnDialogContent } from '@pagopa-pn/pn-commons';

export type ApiKeyModalProps = {
  title: string;
  subTitle?: ReactNode;
  subTitleAtBottom?: boolean;
  content?: ReactNode;
  closeButtonLabel: string;
  closeModalHandler: () => void;
  actionButtonLabel?: string;
  actionHandler?: () => void;
};

const ApiKeyModal = ({
  title,
  subTitle,
  subTitleAtBottom = false,
  content,
  closeButtonLabel,
  closeModalHandler,
  actionButtonLabel,
  actionHandler,
}: ApiKeyModalProps) => (
  <PnDialog open onClose={closeModalHandler}>
    {title && <DialogTitle>{title}</DialogTitle>}
    <PnDialogContent>
      {subTitle && !subTitleAtBottom && (
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
      {subTitle && subTitleAtBottom && (
        <Typography data-testid="subtitle-bottom" variant="body1" sx={{ mt: content ? 2 : 0 }}>
          {subTitle}
        </Typography>
      )}
    </PnDialogContent>
    <PnDialogActions>
      <Button
        id="close-modal-button"
        data-testid="close-modal-button"
        variant="outlined"
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
          autoFocus
        >
          {actionButtonLabel}
        </Button>
      )}
    </PnDialogActions>
  </PnDialog>
);

export default ApiKeyModal;
