import {
  EventCategory,
  EventPropertyType,
  EventStrategy,
  PaymentInfoDetail,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';
import { EventNotificationType } from '@pagopa-pn/pn-commons/src/models/MixpanelEvents';

type SendPaymentError = {
  detail?: PaymentInfoDetail;
  errorCode?: string;
  notification_type: EventNotificationType;
};

export class SendPaymentDetailErrorStrategy implements EventStrategy {
  performComputations({
    detail,
    errorCode,
    notification_type,
  }: SendPaymentError): TrackedEvent<SendPaymentError> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.KO,
        detail,
        errorCode,
        notification_type,
      },
    };
  }
}
