import {
  EventAction,
  EventCategory,
  EventMandateNotificationsListType,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

import { Delegate, Delegator } from '../../../redux/delegation/types';
import { DelegationStatus } from '../../status.utility';

type SendYourMandate = {
  delegates: Array<Delegate>;
  delegators: Array<Delegator>;
};

export class SendYourMandatesStrategy implements EventStrategy {
  performComputations({
    delegates,
    delegators,
  }: SendYourMandate): TrackedEvent<EventMandateNotificationsListType> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
        total_mandates_given_count: delegates.length,
        pending_mandates_given_count: delegates.filter((d) => d.status === DelegationStatus.PENDING)
          .length,
        active_mandates_given_count: delegates.filter((d) => d.status === DelegationStatus.ACTIVE)
          .length,
        total_mandates_received_count: delegators.length,
        pending_mandates_received_count: delegators.filter(
          (d) => d.status === DelegationStatus.PENDING
        ).length,
        active_mandates_received_count: delegators.filter(
          (d) => d.status === DelegationStatus.ACTIVE
        ).length,
      },
    };
  }
}
