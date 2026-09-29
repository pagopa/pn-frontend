import { ReactNode } from 'react';

import { DialogTitle, Typography } from '@mui/material';
import { PnDialog, PnDialogActions, PnDialogContent } from '@pagopa-pn/pn-commons';
import { MIButton } from '@pagopa/mui-italia';

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
    {title && <DialogTitle sx={{ wordBreak: 'break-word' }}>{title}</DialogTitle>}
    <PnDialogContent>
      {subTitle && !subTitleAtBottom && (
        <Typography
          id="subtitle-top"
          data-testid="subtitle-top"
          variant="body1"
          sx={{ mb: content ? 2 : 0, wordBreak: 'break-word' }}
        >
          {subTitle}
        </Typography>
      )}
      {content}
      {subTitle && subTitleAtBottom && (
        <Typography
          data-testid="subtitle-bottom"
          variant="body1"
          sx={{ mt: content ? 2 : 0, wordBreak: 'break-word' }}
        >
          {subTitle}
        </Typography>
      )}
    </PnDialogContent>
    <PnDialogActions>
      <MIButton
        id="close-modal-button"
        data-testid="close-modal-button"
        variant="outlined"
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
        >
          {actionButtonLabel}
        </MIButton>
      )}
    </PnDialogActions>
  </PnDialog>
);

export default ApiKeyModal;
