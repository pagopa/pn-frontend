import {
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

type SendPaymentStatus = {
  param?: object;
};

export class SendPaymentStatusStrategy implements EventStrategy {
  performComputations({ param }: SendPaymentStatus): TrackedEvent<SendPaymentStatus> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.TECH,
        ...param,
      },
    };
  }
}
