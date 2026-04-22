import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

import { OnboardingFlow, OnboardingSource } from '../../../models/Onboarding';
import { store } from '../../../redux/store';
import { getOnboardingAvailableFlows } from '../../mixpanel';

type Props = {
  source: OnboardingSource;
  onboarding_selected_flow: OnboardingFlow;
};

type SendOnboardingFlowReturn = Props & {
  flow: OnboardingFlow;
  onboarding_available_flow: string;
};

export class SendOnboardingFlowStrategy implements EventStrategy {
  performComputations({
    source,
    onboarding_selected_flow,
  }: Props): TrackedEvent<SendOnboardingFlowReturn> {
    const { digitalAddresses } = store.getState().contactsState;

    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        source,
        onboarding_available_flow: getOnboardingAvailableFlows(digitalAddresses),
        flow: 'onboarding',
        onboarding_selected_flow,
      },
    };
  }
}
