import { ReactNode, useMemo } from 'react';

import { Button, DialogTitle, Typography } from '@mui/material';
import { PnDialogActions, PnDialogContent, useIsMobile } from '@pagopa-pn/pn-commons';

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
}: ApiKeyModalProps) => {
  const isMobile = useIsMobile();
  const textPosition = useMemo(() => (isMobile ? 'center' : 'left'), [isMobile]);
  return (
    <>
      {title && (
        <DialogTitle sx={{ p: isMobile ? 3 : 4, pb: 2, textAlign: textPosition }}>
          {title}
        </DialogTitle>
      )}
      <PnDialogContent>
        {subTitle && !subTitleAtBottom && (
          <Typography
            id="subtitle-top"
            data-testid="subtitle-top"
            variant="body1"
            sx={{ marginBottom: 3 }}
          >
            {subTitle}
          </Typography>
        )}
        {content}
        {subTitle && subTitleAtBottom && (
          <Typography data-testid="subtitle-bottom" variant="body1" sx={{ my: 3 }}>
            {subTitle}
          </Typography>
        )}
      </PnDialogContent>
      <PnDialogActions
        disableSpacing={isMobile}
        sx={{
          textAlign: textPosition,
          flexDirection: isMobile ? 'column-reverse' : 'row',
          p: isMobile ? 3 : 4,
          pt: 0,
        }}
      >
        <Button
          id="close-modal-button"
          data-testid="close-modal-button"
          variant="outlined"
          onClick={closeModalHandler}
          fullWidth={isMobile}
        >
          {closeButtonLabel}
        </Button>
        {actionButtonLabel && (
          <Button
            id="action-modal-button"
            sx={{ mb: isMobile ? 2 : 0 }}
            data-testid="action-modal-button"
            variant="contained"
            onClick={actionHandler}
            fullWidth={isMobile}
          >
            {actionButtonLabel}
          </Button>
        )}
      </PnDialogActions>
    </>
  );
};

export default ApiKeyModal;
