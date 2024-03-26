import {
  EventCategory,
  EventPropertyType,
  EventStrategy,
  PaymentInfoDetail,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

type SendPaymentError = {
  detail?: PaymentInfoDetail;
  errorCode?: string;
};

export class SendPaymentDetailErrorStrategy implements EventStrategy {
  performComputations({ detail, errorCode }: SendPaymentError): TrackedEvent<SendPaymentError> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.KO,
        detail,
        errorCode,
      },
    };
  }
}
