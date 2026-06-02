import { vi } from 'vitest';

import { userResponse } from '../../../__mocks__/Auth.mock';
import { PFTriggerEventSpy, render } from '../../../__test__/test-utils';
import { PFEventsType } from '../../../models/PFEventsType';
import PFEventStrategyFactory from '../../../utility/MixpanelUtils/PFEventStrategyFactory';
import Profile from '../../Profile.page';

describe('Profile.page - Mixpanel events', () => {
  let triggerEventSpy: PFTriggerEventSpy;

  beforeEach(() => {
    triggerEventSpy = vi.spyOn(PFEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    triggerEventSpy.mockRestore();
  });

  it('fires SEND_PROFILE on mount', () => {
    render(<Profile />, { preloadedState: { userState: { user: userResponse } } });

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_PROFILE);
  });
});
