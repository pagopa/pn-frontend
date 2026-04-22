import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

import {
  OnboardingAvailableFlows,
  OnboardingContactStatus,
  OnboardingSource,
  TrackingFlow,
} from '../../../models/Onboarding';
import { getOnboardingBasePayload } from '../../mixpanel';

type Props = {
  event_type: EventAction;
  onboarding_selected_flow: OnboardingAvailableFlows;
  email_value?: string;
  sms_value?: string;
};

type SendOnboardingEmailActivationReturn = {
  source?: OnboardingSource;
  onboarding_available_flow: string;
  flow: TrackingFlow;
  onboarding_selected_flow: OnboardingAvailableFlows;
  email_status?: OnboardingContactStatus;
  sms_status?: OnboardingContactStatus;
};

export class SendOnboardingEmailActivationStrategy implements EventStrategy {
  performComputations({
    event_type,
    onboarding_selected_flow,
    email_value,
    sms_value,
  }: Props): TrackedEvent<SendOnboardingEmailActivationReturn> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type,
        onboarding_selected_flow,
        email_status: email_value
          ? OnboardingContactStatus.POPULATED
          : OnboardingContactStatus.EMPTY,
        sms_status: sms_value ? OnboardingContactStatus.POPULATED : OnboardingContactStatus.EMPTY,
        ...getOnboardingBasePayload(),
      },
    };
  }
}
