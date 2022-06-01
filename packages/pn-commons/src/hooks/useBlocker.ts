import { useContext, useEffect } from 'react';
import { UNSAFE_NavigationContext } from 'react-router-dom';
import type { History, Blocker, Transition } from 'history';

export function useBlocker(blocker: Blocker, when = true): void {
  const navigator = useContext(UNSAFE_NavigationContext).navigator as History;

  useEffect(() => {
    if (!when) return;

    // prevents the current location from changing and sets up a listener
    const unblock = navigator.block((tx: Transition) => {
      const autoUnblockingTx = {
        ...tx,
        retry() {
          // stop blocking
          unblock();
          // retries location update
          tx.retry();
        },
      };

      blocker(autoUnblockingTx);
    });

    // clean up function
    return () => unblock();
  }, [navigator, blocker, when]);
}