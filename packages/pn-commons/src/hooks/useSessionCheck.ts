import { useEffect } from 'react';

/* eslint-disable functional/no-let */
let interval: NodeJS.Timer;

export const useSessionCheck = (timer: number, sessionExpiredCbk: () => void) => {
  const initSessionCheck = (expt: number) => {
    if (interval) {
      clearInterval(interval);
    }
    if (expt) {
      interval = setInterval(() => {
        if (isJwtExpired(expt)) {
          sessionExpiredCbk();
          clearInterval(interval);
        }
      }, timer);
    }
  };

  useEffect(
    () =>
      // cleanup function
      () => {
        if (interval) {
          clearInterval(interval);
        }
      },
    []
  );

  return initSessionCheck;
};

// exp in seconds (from JWT standard)
export const isJwtExpired = (exp: number) => {
  const now = new Date();
  const expireAt = new Date(0);
  expireAt.setUTCSeconds(exp);
  return now.getTime() >= expireAt.getTime();
};
