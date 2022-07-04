import { Fragment, ReactNode, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { usePrompt } from '../hooks/usePrompt';

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

  const [showPrompt, confirmNavigation, cancelNavigation] = usePrompt(true, eventTrackingCallbackCancel, eventTrackingCallbackConfirm);

  useEffect(() => {
    if (showPrompt) {
      eventTrackingCallbackPromptOpened();
    };
  });

  return (
    <Fragment>
      <Dialog onClose={cancelNavigation} open={showPrompt} maxWidth={'xs'} fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={cancelNavigation}>Annulla</Button>
          <Button variant="contained" onClick={confirmNavigation} autoFocus>
            Esci
          </Button>
        </DialogActions>
      </Dialog>
      {children}
    </Fragment>
  );
};

export default Prompt;
