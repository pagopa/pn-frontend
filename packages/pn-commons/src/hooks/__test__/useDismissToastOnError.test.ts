import { vi } from 'vitest';

import { AppResponse, AppResponsePublisher } from '@pagopa-pn/pn-commons';
import { renderHook } from '@testing-library/react';

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
    const handler = vi.fn<[AppResponse], boolean>().mockReturnValue(true);

    renderHook(() => useDismissToastOnError(actionId, handler));

    expect(subscribeSpy).toHaveBeenCalledTimes(1);
    expect(subscribeSpy).toHaveBeenCalledWith(actionId, handler);
  });

  it('should unsubscribe from AppResponsePublisher.error on unmount', () => {
    const actionId = 'test-action';
    const handler = vi.fn<[AppResponse], boolean>().mockReturnValue(true);

    const { unmount } = renderHook(() => useDismissToastOnError(actionId, handler));

    unmount();

    expect(unsubscribeSpy).toHaveBeenCalledTimes(1);
    expect(unsubscribeSpy).toHaveBeenCalledWith(actionId, handler);
  });
});
