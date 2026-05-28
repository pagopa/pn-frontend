import { vi } from 'vitest';

import { PFLoginTriggerEventSpy, act, render } from '../../../../__test__/test-utils';
import { PFLoginEventsType } from '../../../../models/PFLoginEventsType';
import PFLoginEventStrategyFactory from '../../../../utility/MixpanelUtils/PFLoginEventStrategyFactory';
import OneIdentityLoginError from '../../OneIdentityLoginError';

describe('One Identity Login Error page - Mixpanel events', () => {
  let triggerEventSpy: PFLoginTriggerEventSpy;

  beforeEach(() => {
    triggerEventSpy = vi.spyOn(PFLoginEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    triggerEventSpy.mockRestore();
  });

  it('fires SEND_LOGIN_FAILURE on mount with error reason from search param', async () => {
    await act(async () => render(<OneIdentityLoginError />, { route: '/?error=access_denied' }));
    expect(triggerEventSpy).toHaveBeenCalledWith(PFLoginEventsType.SEND_LOGIN_FAILURE, {
      reason: 'access_denied',
    });
  });
});
