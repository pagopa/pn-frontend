import { useCallback } from 'react';
import { BlockerFunction, useBlocker } from 'react-router-dom';

type Params = {
  when: boolean;
  notificationsRoute: string;
};

export function useNotificationExitPrompt({
  when,
  notificationsRoute,
}: Params): [boolean, () => void, () => void] {
  const handleBlockedNavigation: BlockerFunction = useCallback(
    ({ currentLocation, nextLocation }) => {
      if (!when) {
        return false;
      }

      const isPathChanging = nextLocation.pathname !== currentLocation.pathname;
      const isGoingToNotifications = nextLocation.pathname === notificationsRoute;

      return isPathChanging && isGoingToNotifications;
    },
    [when, notificationsRoute]
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
