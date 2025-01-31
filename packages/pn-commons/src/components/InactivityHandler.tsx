import { useEffect, useState } from 'react';
import { Button, DialogContentText, DialogTitle } from '@mui/material';
import { getLocalizedOrDefaultLabel } from '../utility/localization.utility';
import PnDialog from './PnDialog/PnDialog';
import PnDialogContent from './PnDialog/PnDialogContent';
import PnDialogActions from './PnDialog/PnDialogActions';

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
      // init timer
      const timer = setTimeout(() => {
        onTimerExpired();
      }, inactivityTimer);

      const differenceTimerModal = setTimeout(() => {
        setOpenModal(true);

      }, inactivityTimer - (20 * 1000));

      // cleanup function
      return () => {
        setOpenModal(false);
        clearTimeout(timer);
        clearTimeout(differenceTimerModal);
      };
    }
    return () => { };
  }, [initTimeout]);

  return (
    <>

      <PnDialog
        open={openModal}
        aria-labelledby="session-dialog-title"
        aria-describedby="session-dialog-description"
        data-testid="session-modal"
      >
        <DialogTitle id="session-dialog-title" sx={{ textAlign: 'center' }}>
          {getLocalizedOrDefaultLabel('common', 'inactivity-title')}
        </DialogTitle>
        <PnDialogContent>
          <DialogContentText id="session-dialog-description">{getLocalizedOrDefaultLabel('common', 'inactivity-body')}</DialogContentText>
        </PnDialogContent>
        <PnDialogActions>
          <Button sx={{ width: '100%' }} color="primary" variant="outlined" data-testid='buttonOfSessionModal' onClick={resetTimer}>
            {getLocalizedOrDefaultLabel('common', 'inactivity-action')}
          </Button>
        </PnDialogActions>
      </PnDialog>
      {children}
    </>);
};

export default InactivityHandler;
