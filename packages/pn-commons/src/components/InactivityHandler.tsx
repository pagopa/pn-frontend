import { useEffect, useState } from 'react';
import SessionModal from './SessionModal';

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
        setOpenModal(true)

      }, inactivityTimer - (5 * 1000))

      // cleanup function
      return () => {
        setOpenModal(false)
        clearTimeout(timer);
        clearTimeout(differenceTimerModal);
      };
    }
    return () => { };
  }, [initTimeout]);

  return (
    <>
      {openModal && <SessionModal
        open
        title={'ciao'}
        message={'ciao'}
        onConfirm={resetTimer}
        onConfirmLabel='resta attivo'
        initTimeout={false}
      />}
      {children}
    </>)
};

export default InactivityHandler;
