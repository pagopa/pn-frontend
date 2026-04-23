import { vi } from 'vitest';

import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import {
  OnboardingAvailableFlows,
  OnboardingContactStatus,
  OnboardingSource,
  TrackingFlow,
} from '../../../../models/Onboarding';
import * as mixpanelUtils from '../../../mixpanel';
import { SendOnboardingEmailActivationStrategy } from '../SendOnboardingEmailActivationStrategy';

describe('Mixpanel - Send Onboarding Email Activation Strategy', () => {
  const mockedBasePayload = {
    source: OnboardingSource.LOGIN,
    onboarding_available_flow: 'digital_domicile,courtesy,io',
    flow: TrackingFlow.ONBOARDING,
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return onboarding email activation event with email and sms status', () => {
    vi.spyOn(mixpanelUtils, 'getOnboardingBasePayload').mockReturnValue(mockedBasePayload);

    const strategy = new SendOnboardingEmailActivationStrategy();

    const event = strategy.performComputations({
      event_type: EventAction.SCREEN_VIEW,
      onboarding_selected_flow: OnboardingAvailableFlows.COURTESY,
      email_value: 'test@mail.com',
      sms_value: '3331234567',
    });

    expect(event).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
        onboarding_selected_flow: OnboardingAvailableFlows.COURTESY,
        email_status: OnboardingContactStatus.POPULATED,
        sms_status: OnboardingContactStatus.POPULATED,
        ...mockedBasePayload,
      },
    });
  });

  it('should return onboarding email activation event without sms status when sms is undefined', () => {
    vi.spyOn(mixpanelUtils, 'getOnboardingBasePayload').mockReturnValue(mockedBasePayload);

    const strategy = new SendOnboardingEmailActivationStrategy();

    const event = strategy.performComputations({
      event_type: EventAction.SCREEN_VIEW,
      onboarding_selected_flow: OnboardingAvailableFlows.DIGITAL_DOMICILE,
      email_value: undefined,
    });

    expect(event).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
        onboarding_selected_flow: OnboardingAvailableFlows.DIGITAL_DOMICILE,
        email_status: OnboardingContactStatus.EMPTY,
        ...mockedBasePayload,
      },
    });
  });
});
