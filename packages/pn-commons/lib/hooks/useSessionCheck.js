import { useEffect } from 'react';
/* eslint-disable functional/no-let */
let interval;
export const useSessionCheck = (timer, sessionExpiredCbk) => {
    const initSessionCheck = (expt) => {
        if (interval) {
            clearInterval(interval);
        }
        if (expt) {
            interval = setInterval(() => {
                const now = new Date();
                // expt is in epoch format
                const expireAt = new Date(0); // The 0 there is the key, which sets the date to the epoch
                expireAt.setUTCSeconds(expt);
                if (now.getTime() >= expireAt.getTime()) {
                    sessionExpiredCbk();
                    clearInterval(interval);
                }
            }, timer);
        }
    };
    useEffect(() => 
    // cleanup function
    () => {
        if (interval) {
            clearInterval(interval);
        }
    }, []);
    return initSessionCheck;
};
