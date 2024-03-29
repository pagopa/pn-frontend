import {
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

type SendLoginFailure = {
  reason: string;
  IDP: string | null;
};

export class SendLoginFailureStrategy implements EventStrategy {
  performComputations({ reason, IDP }: SendLoginFailure): TrackedEvent<SendLoginFailure> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.TECH,
        reason,
        IDP,
      },
    };
  }
}
