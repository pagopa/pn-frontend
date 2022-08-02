import { useEffect } from 'react';

/* eslint-disable functional/no-let */
let interval: NodeJS.Timer;

export const useSessionCheck = (sessionExpiredCbk: () => void) => {
  const initSessionCheck = (expt: number) => {
    if (interval) {
      clearInterval(interval);
    }
    if (expt) {
      interval = setInterval(() => {
        const now = new Date();
        const expireAt = new Date(0); // The 0 there is the key, which sets the date to the epoch
        expireAt.setUTCSeconds(expt);
        if (now <= expireAt) {
          clearInterval(interval);
          sessionExpiredCbk();
        }
      }, 5000);
    }
  };

  useEffect(() => {
    // cleanup function
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    }
  }, []);

  return initSessionCheck;
};
