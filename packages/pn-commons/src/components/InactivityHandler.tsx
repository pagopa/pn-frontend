import { Fragment, ReactNode, useEffect, useState } from 'react';

type Props = {
  /** Inactivity timer (in milliseconds) */
  inactivityTimer: number;
  /** Callback called when timer expires */
  onTimerExpired: () => void;
  children: ReactNode;
};

const InactivityHandler = ({ inactivityTimer, children, onTimerExpired }: Props) => {
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
  }, [initTimeout]);

  return <Fragment>{children}</Fragment>;
};

export default InactivityHandler;
