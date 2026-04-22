import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

import { type OnboardingSource, TrackingFlow } from '../../../models/Onboarding';
import { store } from '../../../redux/store';
import { getOnboardingAvailableFlows } from '../../mixpanel';

type Props = {
  event_type: EventAction;
  source: OnboardingSource;
};

type SendOnboardingStartReturn = {
  source: OnboardingSource;
  onboarding_available_flow: string;
  flow: TrackingFlow;
};

export class SendOnboardingStartStrategy implements EventStrategy {
  performComputations({ event_type, source }: Props): TrackedEvent<SendOnboardingStartReturn> {
    const { digitalAddresses } = store.getState().contactsState;

    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type,
        source,
        onboarding_available_flow: getOnboardingAvailableFlows(digitalAddresses),
        flow: 'onboarding',
      },
    };
  }
}
