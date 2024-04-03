import {
  EventCategory,
  EventPropertyType,
  EventStrategy,
  PaymentStatus,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

type SendPaymentOutcome = {
  outcome: PaymentStatus;
};

export class SendPaymentOutcomeStrategy implements EventStrategy {
  performComputations({ outcome }: SendPaymentOutcome): TrackedEvent<SendPaymentOutcome> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.TECH,
        outcome,
      },
    };
  }
}
