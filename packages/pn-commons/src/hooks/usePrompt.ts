import { useCallback, useEffect } from 'react';
import { BlockerFunction, useBlocker } from 'react-router-dom';

export function usePrompt(when: boolean): [boolean, () => void, () => void] {
  // handle blocking when user click on another route prompt will be shown
  const handleBlockedNavigation: BlockerFunction = useCallback(
    (args) => {
      // in if condition we are checking next location and current location are equals or not
      if (args.nextLocation.pathname !== args.currentLocation.pathname && when) {
        return true;
      }
      return false;
    },
    [when]
  );

  const blocker = useBlocker(handleBlockedNavigation);

  const confirmNavigation = useCallback(() => {
    blocker.proceed?.();
  }, [blocker]);

  const cancelNavigation = useCallback(() => {
    blocker.reset?.();
  }, [blocker]);

  const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
    // Recommended
    event.preventDefault();

    // Included for legacy support, e.g. Chrome/Edge < 119
    // eslint-disable-next-line functional/immutable-data
    event.returnValue = true;
  };

  useEffect(() => {
    window.addEventListener('beforeunload', beforeUnloadHandler);

    return () => window.removeEventListener('beforeunload', beforeUnloadHandler);
  }, []);

  return [blocker.state === 'blocked', confirmNavigation, cancelNavigation];
}
