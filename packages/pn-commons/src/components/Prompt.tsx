import { useEffect } from 'react';

import { Button, DialogContentText, DialogTitle } from '@mui/material';

import { usePrompt } from '../hooks/usePrompt';
import { getLocalizedOrDefaultLabel } from '../utility/localization.utility';
import PnDialog from './PnDialog/PnDialog';
import PnDialogActions from './PnDialog/PnDialogActions';
import PnDialogContent from './PnDialog/PnDialogContent';

type Props = {
  disabled: boolean;
  title: string;
  message: string;
  eventTrackingCallbackPromptOpened?: () => void;
  eventTrackingCallbackCancel?: () => void;
  eventTrackingCallbackConfirm?: () => void;
  children?: React.ReactNode;
};

const Prompt: React.FC<Props> = ({
  disabled = false,
  title,
  message,
  children,
  eventTrackingCallbackPromptOpened,
  eventTrackingCallbackCancel,
  eventTrackingCallbackConfirm,
}) => {
  const [showPrompt, confirmNavigation, cancelNavigation] = usePrompt(
    !disabled,
    eventTrackingCallbackCancel,
    eventTrackingCallbackConfirm
  );

  useEffect(() => {
    if (showPrompt) {
      eventTrackingCallbackPromptOpened?.();
    }
  });

  return (
    <>
      <PnDialog onClose={cancelNavigation} open={showPrompt} data-testid="promptDialog">
        <DialogTitle>{title}</DialogTitle>
        <PnDialogContent>
          <DialogContentText>{message}</DialogContentText>
        </PnDialogContent>
        <PnDialogActions>
          <Button variant="outlined" onClick={cancelNavigation}>
            {getLocalizedOrDefaultLabel('common', 'button.annulla', 'Annulla')}
          </Button>
          <Button
            id="button-exit"
            variant="contained"
            onClick={confirmNavigation}
            autoFocus
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
