import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

import { ContactStatus, OnboardingFlow, OnboardingSource } from '../../../models/Onboarding';
import { store } from '../../../redux/store';
import { getOnboardingAvailableFlows } from '../../mixpanel';

type Props = {
  source: OnboardingSource;
  onboarding_selected_flow: OnboardingFlow;
  email_status: ContactStatus;
  sms_status?: ContactStatus;
};

type SendOnboardingEmailActivationReturn = Props & {
  onboarding_available_flow: string;
  flow: OnboardingFlow;
};

export class SendOnboardingEmailActivationStrategy implements EventStrategy {
  performComputations({
    source,
    onboarding_selected_flow,
    email_status,
    sms_status,
  }: Props): TrackedEvent<SendOnboardingEmailActivationReturn> {
    const { digitalAddresses } = store.getState().contactsState;

    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        source,
        onboarding_available_flow: getOnboardingAvailableFlows(digitalAddresses),
        flow: 'onboarding',
        onboarding_selected_flow,
        email_status,
        ...(sms_status !== undefined && { sms_status }),
      },
    };
  }
}
