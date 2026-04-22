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
  onboarding_selected_flow: OnboardingAvailableFlows;
  screen: string;
};

type SendOnboardingScreenActionReturn = Props & {
  source?: OnboardingSource;
  onboarding_available_flow: string;
  flow: TrackingFlow;
};

export class SendOnboardingScreenActionStrategy implements EventStrategy {
  performComputations({
    onboarding_selected_flow,
    screen,
  }: Props): TrackedEvent<SendOnboardingScreenActionReturn> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        onboarding_selected_flow,
        screen,
        ...getOnboardingBasePayload(),
      },
    };
  }
}
