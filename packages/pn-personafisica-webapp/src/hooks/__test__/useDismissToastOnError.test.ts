import { vi } from 'vitest';

import { AppResponsePublisher } from '@pagopa-pn/pn-commons';
import { renderHook } from '@testing-library/react';

import { ServerResponseErrorCode } from '../../utility/AppError/types';
import { useDismissToastOnError } from '../useDismissToastOnError';

describe('useDismissToastOnError', () => {
  const subscribeSpy = vi.spyOn(AppResponsePublisher.error, 'subscribe');
  const unsubscribeSpy = vi.spyOn(AppResponsePublisher.error, 'unsubscribe');

  beforeEach(() => {
    subscribeSpy.mockClear();
    unsubscribeSpy.mockClear();
  });

  it('should subscribe to AppResponsePublisher.error on mount', () => {
    const actionId = 'test-action';
    const errorCode = ServerResponseErrorCode.PN_MANDATE_NOTFOUND;

    renderHook(() => useDismissToastOnError(actionId, errorCode));

    expect(subscribeSpy).toHaveBeenCalledTimes(1);
    expect(subscribeSpy).toHaveBeenCalledWith(actionId, expect.any(Function));
  });

  it('should unsubscribe from AppResponsePublisher.error on unmount', () => {
    const actionId = 'test-action';
    const errorCode = ServerResponseErrorCode.PN_MANDATE_NOTFOUND;

    const { unmount } = renderHook(() => useDismissToastOnError(actionId, errorCode));

    unmount();

    expect(unsubscribeSpy).toHaveBeenCalledTimes(1);
    expect(unsubscribeSpy).toHaveBeenCalledWith(actionId, expect.any(Function));
  });
});
