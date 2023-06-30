import { Fragment, ReactNode, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import { usePrompt } from '../hooks/usePrompt';
import { getLocalizedOrDefaultLabel } from '../services/localization.service';

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

  useEffect(() => {
    if (showPrompt) {
      eventTrackingCallbackPromptOpened();
    }
  });

  return (
    <Fragment>
      <Dialog onClose={cancelNavigation} open={showPrompt} maxWidth={'xs'} fullWidth>
        <DialogTitle sx={{ pt: 4, pl: 4, pb: 2, pr: 4 }}>{title}</DialogTitle>
        <DialogContent sx={{ px: 4, py: 0 }}>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 4 }}>
          <Button variant="outlined" onClick={cancelNavigation}>
            {getLocalizedOrDefaultLabel('common', 'button.annulla', 'Annulla')}
          </Button>
          <Button variant="contained" onClick={confirmNavigation} autoFocus>
            {getLocalizedOrDefaultLabel('common', 'button.exit', 'Esci')}
          </Button>
        </DialogActions>
      </Dialog>
      {children}
    </Fragment>
  );
};

export default Prompt;
