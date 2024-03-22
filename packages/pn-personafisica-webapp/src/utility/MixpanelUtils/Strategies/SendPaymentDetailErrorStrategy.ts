import {
  EventCategory,
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
      event_category: EventCategory.KO,
      detail,
      errorCode,
    };
  }
}
