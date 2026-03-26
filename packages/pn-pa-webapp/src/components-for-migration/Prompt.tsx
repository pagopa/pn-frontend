import { useTranslation } from 'react-i18next';

import { Button, DialogContentText, DialogTitle } from '@mui/material';
import { PnDialog, PnDialogActions, PnDialogContent } from '@pagopa-pn/pn-commons';

import { usePrompt } from './usePrompt';

type Props = {
  disabled?: boolean;
  title: string;
  message: string;
  children?: React.ReactNode;
};

const Prompt: React.FC<Props> = ({ disabled = false, title, message, children }) => {
  const [showPrompt, confirmNavigation, cancelNavigation] = usePrompt(!disabled);
  const { t } = useTranslation('common');

  return (
    <>
      <PnDialog onClose={cancelNavigation} open={showPrompt} data-testid="promptDialog">
        <DialogTitle>{title}</DialogTitle>
        <PnDialogContent>
          <DialogContentText>{message}</DialogContentText>
        </PnDialogContent>
        <PnDialogActions>
          <Button variant="outlined" onClick={cancelNavigation}>
            {t('button.annulla')}
          </Button>
          <Button
            id="button-exit"
            variant="contained"
            onClick={confirmNavigation}
            autoFocus
            data-testid="confirmExitBtn"
          >
            {t('button.exit')}
          </Button>
        </PnDialogActions>
      </PnDialog>
      {children}
    </>
  );
};

export default Prompt;
