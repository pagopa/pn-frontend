import { Fragment, ReactNode } from 'react';
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
}: {
  title: string;
  message: string;
  children: ReactNode;
}) => {
  const [showPrompt, confirmNavigation, cancelNavigation] = usePrompt(true);

  return (
    <Fragment>
      <Dialog onClose={cancelNavigation} open={showPrompt} maxWidth={'xs'} fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
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
