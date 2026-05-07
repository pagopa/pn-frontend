import { vi } from 'vitest';

import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { OnboardingSource, TrackingFlow } from '../../../../models/Onboarding';
import * as mixpanelUtils from '../../../mixpanel';
import { SendOnboardingStartStrategy } from '../SendOnboardingStartStrategy';

describe('Mixpanel - Send Onboarding Start Strategy', () => {
  const mockedBasePayload = {
    source: OnboardingSource.LOGIN,
    onboarding_available_flow: 'digital_domicile,courtesy,io',
    flow: TrackingFlow.ONBOARDING,
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return onboarding start event', () => {
    vi.spyOn(mixpanelUtils, 'getOnboardingBasePayload').mockReturnValue(mockedBasePayload);

    const strategy = new SendOnboardingStartStrategy();

    const event = strategy.performComputations({
      event_type: EventAction.SCREEN_VIEW,
    });

    expect(event).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
        ...mockedBasePayload,
      },
    });
  });
});
