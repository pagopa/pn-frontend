import { useCallback } from 'react';
import { BlockerFunction, useBlocker } from 'react-router-dom';

type Params = {
  when: boolean;
  route: string;
};

export function useNotificationExitPrompt({
  when,
  route,
}: Params): [boolean, () => void, () => void] {
  const handleBlockedNavigation: BlockerFunction = useCallback(
    ({ currentLocation, nextLocation }) => {
      if (!when) {
        return false;
      }

      const isPathChanging = nextLocation.pathname !== currentLocation.pathname;
      const isGoingToNotifications = nextLocation.pathname === route;

      return isPathChanging && isGoingToNotifications;
    },
    [when, route]
  );

  const blocker = useBlocker(handleBlockedNavigation);

  const confirmNavigation = useCallback(() => {
    blocker.proceed?.();
  }, [blocker]);

  const cancelNavigation = useCallback(() => {
    blocker.reset?.();
  }, [blocker]);

  return [blocker.state === 'blocked', confirmNavigation, cancelNavigation];
}
