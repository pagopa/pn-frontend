import {
  EventCategory,
  EventPropertyType,
  EventStrategy,
  PaymentStatus,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';
import { EventNotificationType } from '@pagopa-pn/pn-commons/src/models/MixpanelEvents';

type SendPaymentOutcome = {
  outcome: PaymentStatus;
  notification_type: EventNotificationType;
};

export class SendPaymentOutcomeStrategy implements EventStrategy {
  performComputations({
    outcome,
    notification_type,
  }: SendPaymentOutcome): TrackedEvent<SendPaymentOutcome> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.TECH,
        outcome,
        notification_type,
      },
    };
  }
}
