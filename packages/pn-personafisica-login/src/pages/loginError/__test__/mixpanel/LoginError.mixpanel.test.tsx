import { MockInstance, vi } from 'vitest';

import { render } from '../../../../__test__/test-utils';
import { PFLoginEventsType } from '../../../../models/PFLoginEventsType';
import PFLoginEventStrategyFactory from '../../../../utility/MixpanelUtils/PFLoginEventStrategyFactory';
import LoginError from '../../LoginError';

describe('LoginError page - Mixpanel events', () => {
  let triggerEventSpy: MockInstance<[PFLoginEventsType, unknown?], void>;

  beforeEach(() => {
    sessionStorage.setItem('IDP', 'test-idp');
    triggerEventSpy = vi.spyOn(PFLoginEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    sessionStorage.removeItem('IDP');
    triggerEventSpy.mockRestore();
  });

  it('fires SEND_LOGIN_FAILURE on mount with error code', () => {
    render(<LoginError />, { route: '/?errorCode=20' });
    expect(triggerEventSpy).toHaveBeenCalledWith(PFLoginEventsType.SEND_LOGIN_FAILURE, {
      reason: '20',
      IDP: 'test-idp',
    });
  });

  it('fires SEND_LOGIN_FAILURE on mount without error code', () => {
    render(<LoginError />, { route: '/' });
    expect(triggerEventSpy).toHaveBeenCalledWith(PFLoginEventsType.SEND_LOGIN_FAILURE, {
      reason: null,
      IDP: 'test-idp',
    });
  });
});
