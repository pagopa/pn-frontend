import { useEffect } from 'react';

import { AppResponse, AppResponsePublisher } from '@pagopa-pn/pn-commons';

export const useDismissToastOnError = (
  actionId: string | undefined,
  handler: (e: AppResponse) => boolean
) => {
  useEffect(() => {
    if (!actionId) {
      return;
    }
    AppResponsePublisher.error.subscribe(actionId, handler);
    return () => AppResponsePublisher.error.unsubscribe(actionId, handler);
  }, [actionId, handler]);
};
