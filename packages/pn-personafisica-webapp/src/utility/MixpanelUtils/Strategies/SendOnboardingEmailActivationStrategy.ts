import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

import {
  OnboardingContactStatus,
  OnboardingFlow,
  OnboardingSource,
} from '../../../models/Onboarding';
import { store } from '../../../redux/store';
import { getOnboardingAvailableFlows } from '../../mixpanel';

type Props = {
  event_type: EventAction;
  source: OnboardingSource;
  onboarding_selected_flow: OnboardingFlow;
  email_value?: string;
  sms_value?: string;
};

type SendOnboardingEmailActivationReturn = {
  source: OnboardingSource;
  onboarding_available_flow: string;
  flow: OnboardingFlow;
  onboarding_selected_flow: OnboardingFlow;
  email_status?: OnboardingContactStatus;
  sms_status?: OnboardingContactStatus;
};

export class SendOnboardingEmailActivationStrategy implements EventStrategy {
  performComputations({
    event_type,
    source,
    onboarding_selected_flow,
    email_value,
    sms_value,
  }: Props): TrackedEvent<SendOnboardingEmailActivationReturn> {
    const { digitalAddresses } = store.getState().contactsState;

    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type,
        source,
        onboarding_available_flow: getOnboardingAvailableFlows(digitalAddresses),
        flow: 'onboarding',
        onboarding_selected_flow,
        email_status: email_value
          ? OnboardingContactStatus.POPULATED
          : OnboardingContactStatus.EMPTY,
        sms_status: sms_value ? OnboardingContactStatus.POPULATED : OnboardingContactStatus.EMPTY,
      },
    };
  }
}
