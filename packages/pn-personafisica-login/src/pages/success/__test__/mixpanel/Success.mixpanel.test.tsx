import { vi } from 'vitest';

import { PFLoginTriggerEventSpy, render } from '../../../../__test__/test-utils';
import { PFLoginEventsType } from '../../../../models/PFLoginEventsType';
import PFLoginEventStrategyFactory from '../../../../utility/MixpanelUtils/PFLoginEventStrategyFactory';
import SuccessPage from '../../Success';

describe('Success page - Mixpanel events', () => {
  let triggerEventSpy: PFLoginTriggerEventSpy;

  beforeEach(() => {
    vi.stubGlobal('location', { replace: vi.fn(), hash: '#token=fake-token' });
    sessionStorage.setItem('IDP', 'test-idp');
    triggerEventSpy = vi.spyOn(PFLoginEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    sessionStorage.removeItem('IDP');
    triggerEventSpy.mockRestore();
  });

  it('fires SEND_LOGIN_METHOD on mount', () => {
    render(<SuccessPage />);
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFLoginEventsType.SEND_LOGIN_METHOD,
      {
        entityID: 'test-idp',
      },
      { transport: 'sendBeacon' }
    );
  });
});
