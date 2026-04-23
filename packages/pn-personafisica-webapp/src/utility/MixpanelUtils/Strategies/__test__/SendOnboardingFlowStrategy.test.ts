import { vi } from 'vitest';

import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import {
  OnboardingAvailableFlows,
  OnboardingSource,
  TrackingFlow,
} from '../../../../models/Onboarding';
import * as mixpanelUtils from '../../../mixpanel';
import { SendOnboardingFlowStrategy } from '../SendOnboardingFlowStrategy';

describe('Mixpanel - Send Onboarding Flow Strategy', () => {
  const mockedBasePayload = {
    source: OnboardingSource.NOTIFICATION_DETAIL,
    onboarding_available_flow: 'digital_domicile,courtesy',
    flow: TrackingFlow.ONBOARDING,
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return onboarding flow event with provided event type', () => {
    vi.spyOn(mixpanelUtils, 'getOnboardingBasePayload').mockReturnValue(mockedBasePayload);

    const strategy = new SendOnboardingFlowStrategy();

    const event = strategy.performComputations({
      event_type: EventAction.SCREEN_VIEW,
      onboarding_selected_flow: OnboardingAvailableFlows.DIGITAL_DOMICILE,
    });

    expect(event).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
        onboarding_selected_flow: OnboardingAvailableFlows.DIGITAL_DOMICILE,
        ...mockedBasePayload,
      },
    });
  });

  it('should return onboarding flow event with default action event type', () => {
    vi.spyOn(mixpanelUtils, 'getOnboardingBasePayload').mockReturnValue(mockedBasePayload);

    const strategy = new SendOnboardingFlowStrategy();

    const event = strategy.performComputations({
      onboarding_selected_flow: OnboardingAvailableFlows.COURTESY,
    });

    expect(event).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        onboarding_selected_flow: OnboardingAvailableFlows.COURTESY,
        ...mockedBasePayload,
      },
    });
  });
});
