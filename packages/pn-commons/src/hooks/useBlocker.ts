import type { Blocker, History, Transition } from 'history';
import { useContext, useEffect } from 'react';
import { UNSAFE_NavigationContext } from 'react-router-dom';

/**
 * This hook allows you to control route blocking behavior in your React
 * application when certain conditions are met,
 * providing a way to customize how route transitions are handled.
 * @param {any} blocker:Blocker
 * @param {any} when=true
 * @returns {any}
 */
export function useBlocker(blocker: Blocker, when = true): void {
  const navigator = useContext(UNSAFE_NavigationContext).navigator as History;

  useEffect(() => {
    if (!when) {
      return;
    }

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
