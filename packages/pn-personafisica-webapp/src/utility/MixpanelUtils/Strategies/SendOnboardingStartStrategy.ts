import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

import { type OnboardingSource, TrackingFlow } from '../../../models/Onboarding';
import { getOnboardingBasePayload } from '../../mixpanel';

type Props = {
  event_type: EventAction;
};

type SendOnboardingStartReturn = {
  source?: OnboardingSource;
  onboarding_available_flow: string;
  flow: TrackingFlow;
};

export class SendOnboardingStartStrategy implements EventStrategy {
  performComputations({ event_type }: Props): TrackedEvent<SendOnboardingStartReturn> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type,
        ...getOnboardingBasePayload(),
      },
    };
  }
}
