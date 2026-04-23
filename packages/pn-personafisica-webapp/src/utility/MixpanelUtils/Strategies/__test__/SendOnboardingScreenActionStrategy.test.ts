import { vi } from 'vitest';

import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import {
  OnboardingAvailableFlows,
  OnboardingSource,
  TrackingFlow,
} from '../../../../models/Onboarding';
import * as mixpanelUtils from '../../../mixpanel';
import { SendOnboardingScreenActionStrategy } from '../SendOnboardingScreenActionStrategy';

describe('Mixpanel - Send Onboarding Screen Action Strategy', () => {
  const mockedBasePayload = {
    source: OnboardingSource.LOGIN,
    onboarding_available_flow: 'digital_domicile,courtesy,io',
    flow: TrackingFlow.ONBOARDING,
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return onboarding screen action event', () => {
    vi.spyOn(mixpanelUtils, 'getOnboardingBasePayload').mockReturnValue(mockedBasePayload);

    const strategy = new SendOnboardingScreenActionStrategy();

    const event = strategy.performComputations({
      onboarding_selected_flow: OnboardingAvailableFlows.DIGITAL_DOMICILE,
      screen: 'summary',
    });

    expect(event).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        onboarding_selected_flow: OnboardingAvailableFlows.DIGITAL_DOMICILE,
        screen: 'summary',
        ...mockedBasePayload,
      },
    });
  });
});
