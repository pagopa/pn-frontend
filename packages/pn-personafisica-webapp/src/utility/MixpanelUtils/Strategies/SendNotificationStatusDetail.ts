import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

type SendNotificationStatusDetail = {
  accordion: 'collapse' | 'expand';
};

export class SendNotificationStatusDetailStrategy implements EventStrategy {
  performComputations({
    accordion,
  }: SendNotificationStatusDetail): TrackedEvent<SendNotificationStatusDetail> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        accordion,
      },
    };
  }
}
