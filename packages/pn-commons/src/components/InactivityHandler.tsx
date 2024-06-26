import { Fragment, useEffect, useState } from 'react';

type Props = {
  /** Inactivity timer (in milliseconds), if 0 the inactivity timer is disabled */
  inactivityTimer: number;
  /** Callback called when timer expires */
  onTimerExpired: () => void;
  children?: React.ReactNode;
};

const InactivityHandler: React.FC<Props> = ({ inactivityTimer, children, onTimerExpired }) => {
  const [initTimeout, setInitTimeout] = useState(true);

  const resetTimer = () => setInitTimeout(!initTimeout);

  const initListeners = () => {
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('scroll', resetTimer);
    window.addEventListener('keydown', resetTimer);
  };

  const cleanUpListeners = () => {
    window.removeEventListener('mousemove', resetTimer);
    window.removeEventListener('scroll', resetTimer);
    window.removeEventListener('keydown', resetTimer);
  };

  // init timer
  useEffect(() => {
    if (inactivityTimer) {
      // init listeners
      initListeners();
      // init timer
      const timer = setTimeout(() => {
        cleanUpListeners();
        onTimerExpired();
      }, inactivityTimer);
      // cleanup function
      return () => {
        clearTimeout(timer);
        cleanUpListeners();
      };
    }
    return () => {};
  }, [initTimeout]);

  return <Fragment>{children}</Fragment>;
};

export default InactivityHandler;
