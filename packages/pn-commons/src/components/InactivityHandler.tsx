import { useEffect, useState } from 'react';

import { Button, DialogContentText, DialogTitle } from '@mui/material';

import { getLocalizedOrDefaultLabel } from '../utility/localization.utility';
import PnDialog from './PnDialog/PnDialog';
import PnDialogActions from './PnDialog/PnDialogActions';
import PnDialogContent from './PnDialog/PnDialogContent';

type Props = {
  /** Inactivity timer (in milliseconds), if 0 the inactivity timer is disabled */
  inactivityTimer: number;
  /** Callback called when timer expires */
  onTimerExpired: () => void;
  children?: React.ReactNode;
};

const InactivityHandler: React.FC<Props> = ({ inactivityTimer, onTimerExpired, children }) => {
  const [initTimeout, setInitTimeout] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const resetTimer = () => setInitTimeout(!initTimeout);

  // init timer
  useEffect(() => {
    if (inactivityTimer) {
      // this is the timer after wich the inactivity modal is shown
      const inactivityWarningTimer = inactivityTimer - 30 * 1000;
      // init timer
      const timer = setTimeout(() => {
        onTimerExpired();
      }, inactivityTimer);

      const warningTimer = setTimeout(() => {
        setOpenModal(true);
      }, inactivityWarningTimer);

      // cleanup function
      return () => {
        setOpenModal(false);
        clearTimeout(timer);
        clearTimeout(warningTimer);
      };
    }
    return () => {};
  }, [initTimeout]);

  return (
    <>
      <PnDialog
        open={openModal}
        aria-labelledby="inactivity-dialog-title"
        aria-describedby="inactivity-dialog-description"
        data-testid="inactivity-modal"
      >
        <DialogTitle id="inactivity-dialog-title">
          {getLocalizedOrDefaultLabel('common', 'inactivity.title')}
        </DialogTitle>
        <PnDialogContent>
          <DialogContentText id="inactivity-dialog-description">
            {getLocalizedOrDefaultLabel('common', 'inactivity.body')}
          </DialogContentText>
        </PnDialogContent>
        <PnDialogActions>
          <Button
            fullWidth
            color="primary"
            variant="outlined"
            data-testid="inactivity-button"
            onClick={resetTimer}
            autoFocus
          >
            {getLocalizedOrDefaultLabel('common', 'inactivity.action')}
          </Button>
        </PnDialogActions>
      </PnDialog>
      {children}
    </>
  );
};

export default InactivityHandler;
