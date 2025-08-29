/* eslint-disable functional/immutable-data */
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button, DialogContentText, DialogTitle } from '@mui/material';

import { getLocalizedOrDefaultLabel } from '../utility/localization.utility';
import PnDialog from './PnDialog/PnDialog';
import PnDialogActions from './PnDialog/PnDialogActions';
import PnDialogContent from './PnDialog/PnDialogContent';

export const warningTimer = 30 * 1000; // 30 seconds before inactivityTimer user will be warned

type Props = {
  /** Inactivity timer (in milliseconds), if 0 the inactivity timer is disabled */
  inactivityTimer: number;
  /** Callback called when timer expires */
  onTimerExpired: () => void;
  children?: React.ReactNode;
};

const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];

const InactivityHandler: React.FC<Props> = ({ inactivityTimer, onTimerExpired, children }) => {
  const [openModal, setOpenModal] = useState(false);
  const lastActivityRef = useRef(Date.now());

  const confirmModal = () => {
    lastActivityRef.current = Date.now();
    setOpenModal(false);
  };

  const handleActivity = useCallback(() => {
    if (openModal) {
      return;
    }
    lastActivityRef.current = Date.now();
  }, [openModal]);

  useEffect(() => {
    if (inactivityTimer === 0) {
      return;
    }

    const interval = window.setInterval(() => {
      const diffMs = Date.now() - lastActivityRef.current;
      if (inactivityTimer > warningTimer && diffMs >= inactivityTimer - warningTimer) {
        setOpenModal(true);
      }
      if (diffMs >= inactivityTimer) {
        onTimerExpired();
      }
    }, 1000);

    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      clearInterval(interval);
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [handleActivity]);

  if (inactivityTimer === 0) {
    return null;
  }

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
            onClick={confirmModal}
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
