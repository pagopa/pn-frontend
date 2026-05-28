import { useCallback, useEffect } from 'react';

import { AppResponse, AppResponsePublisher } from '@pagopa-pn/pn-commons';

import { ServerResponseErrorCode } from '../utility/AppError/types';

export const useDismissToastOnError = (actionId: string, errorCode: ServerResponseErrorCode) => {
  const handler = useCallback((e: AppResponse) => e.errors?.[0]?.code !== errorCode, [errorCode]);

  useEffect(() => {
    AppResponsePublisher.error.subscribe(actionId, handler);
    return () => AppResponsePublisher.error.unsubscribe(actionId, handler);
  }, [actionId, handler]);
};
