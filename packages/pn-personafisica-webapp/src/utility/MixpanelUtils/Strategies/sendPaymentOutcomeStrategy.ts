import { EventCategory, EventStrategy, PaymentStatus, TrackedEvent } from '@pagopa-pn/pn-commons';

type SendPaymentOutcome = {
  outcome: PaymentStatus;
};

export class SendPaymentOutcomeStrategy implements EventStrategy {
  performComputations(data: SendPaymentOutcome): TrackedEvent<SendPaymentOutcome> {
    return {
      event_category: EventCategory.TECH,
      ...data,
    };
  }
}
