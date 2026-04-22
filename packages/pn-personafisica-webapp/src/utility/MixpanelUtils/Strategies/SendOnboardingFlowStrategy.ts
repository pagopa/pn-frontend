import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

import {
  OnboardingAvailableFlows,
  OnboardingSource,
  TrackingFlow,
} from '../../../models/Onboarding';
import { getOnboardingBasePayload } from '../../mixpanel';

type Props = {
  event_type?: EventAction;
  onboarding_selected_flow: OnboardingAvailableFlows;
};

type SendOnboardingFlowReturn = {
  source?: OnboardingSource;
  onboarding_selected_flow: OnboardingAvailableFlows;
  flow: TrackingFlow;
  onboarding_available_flow: string;
};

export class SendOnboardingFlowStrategy implements EventStrategy {
  performComputations({
    event_type,
    onboarding_selected_flow,
  }: Props): TrackedEvent<SendOnboardingFlowReturn> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: event_type || EventAction.ACTION,
        onboarding_selected_flow,
        ...getOnboardingBasePayload(),
      },
    };
  }
}
