import { useEffect } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import { useIsMobile } from '../hooks';
import { usePrompt } from '../hooks/usePrompt';
import { getLocalizedOrDefaultLabel } from '../services/localization.service';

type Props = {
  title: string;
  message: string;
  eventTrackingCallbackPromptOpened: () => void;
  eventTrackingCallbackCancel: () => void;
  eventTrackingCallbackConfirm: () => void;
  children?: React.ReactNode;
};

const Prompt: React.FC<Props> = ({
  title,
  message,
  children,
  eventTrackingCallbackPromptOpened,
  eventTrackingCallbackCancel,
  eventTrackingCallbackConfirm,
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
      <Dialog
        onClose={cancelNavigation}
        open={showPrompt}
        maxWidth={'xs'}
        fullWidth
        data-testid="promptDialog"
      >
        <DialogTitle sx={{ p: isMobile ? 3 : 4, pb: 2, textAlign: textPosition }}>
          {title}
        </DialogTitle>
        <DialogContent sx={{ p: isMobile ? 3 : 4, textAlign: textPosition }}>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogActions
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
        </DialogActions>
      </Dialog>
      {children}
    </>
  );
};

export default Prompt;
