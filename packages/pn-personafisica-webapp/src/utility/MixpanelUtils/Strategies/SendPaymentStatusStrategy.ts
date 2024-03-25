import { EventCategory, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

type SendPaymentStatus = {
  param?: object;
};

export class SendPaymentStatusStrategy implements EventStrategy {
  performComputations({ param }: SendPaymentStatus): TrackedEvent<SendPaymentStatus> {
    return {
      event_category: EventCategory.TECH,
      param,
    };
  }
}
