import { useTranslation } from 'react-i18next';

import { DialogContentText, DialogTitle } from '@mui/material';
import { MIButton } from '@pagopa/mui-italia';

import { usePrompt } from '../hooks/usePrompt';
import PnDialog from './PnDialog/PnDialog';
import PnDialogActions from './PnDialog/PnDialogActions';
import PnDialogContent from './PnDialog/PnDialogContent';

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
          <MIButton variant="outlined" onClick={cancelNavigation}>
            {t('button.annulla')}
          </MIButton>
          <MIButton
            id="button-exit"
            variant="contained"
            onClick={confirmNavigation}
            autoFocus
            data-testid="confirmExitBtn"
          >
            {t('button.exit')}
          </MIButton>
        </PnDialogActions>
      </PnDialog>
      {children}
    </>
  );
};

export default Prompt;
