import { ReactNode, useEffect } from 'react';

import { Button, DialogContentText, DialogTitle } from '@mui/material';

import { useIsMobile } from '../hooks';
import { usePrompt } from '../hooks/usePrompt';
import { getLocalizedOrDefaultLabel } from '../utility/localization.utility';
import PnDialog from './PnDialog/PnDialog';
import PnDialogActions from './PnDialog/PnDialogActions';
import PnDialogContent from './PnDialog/PnDialogContent';

const Prompt = ({
  title,
  message,
  children,
  eventTrackingCallbackPromptOpened,
  eventTrackingCallbackCancel,
  eventTrackingCallbackConfirm,
}: {
  title: string;
  message: string;
  children: ReactNode;
  eventTrackingCallbackPromptOpened: () => void;
  eventTrackingCallbackCancel: () => void;
  eventTrackingCallbackConfirm: () => void;
}) => {
  const [showPrompt, confirmNavigation, cancelNavigation] = usePrompt(
    true,
    eventTrackingCallbackCancel,
    eventTrackingCallbackConfirm
  );

  const isMobile = useIsMobile();
  const textPosition = isMobile ? 'center' : 'left';

  useEffect(() => {
    if (showPrompt) {
      eventTrackingCallbackPromptOpened();
    }
  });

  return (
    <>
      <PnDialog
        onClose={cancelNavigation}
        open={showPrompt}
        maxWidth={'xs'}
        fullWidth
        data-testid="promptDialog"
      >
        <DialogTitle sx={{ p: isMobile ? 3 : 4, pb: 2, textAlign: textPosition }}>
          {title}
        </DialogTitle>
        <PnDialogContent sx={{ p: isMobile ? 3 : 4, textAlign: textPosition }}>
          <DialogContentText>{message}</DialogContentText>
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
          <Button variant="outlined" onClick={cancelNavigation} fullWidth={isMobile}>
            {getLocalizedOrDefaultLabel('common', 'button.annulla', 'Annulla')}
          </Button>
          <Button
            id="button-exit"
            variant="contained"
            onClick={confirmNavigation}
            autoFocus
            sx={{ mb: isMobile ? 2 : 0 }}
            fullWidth={isMobile}
            data-testid="confirmExitBtn"
          >
            {getLocalizedOrDefaultLabel('common', 'button.exit', 'Esci')}
          </Button>
        </PnDialogActions>
      </PnDialog>
      {children}
    </>
  );
};

export default Prompt;
