import {
  EventAction,
  EventCategory,
  EventNotificationType,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

type NotificationViewDetailData = {
  delegate: boolean;
  notification_type: EventNotificationType;
};

type EventNotificationViewDetailType = {
  event_category: EventCategory;
  event_type: EventAction;
  delegate: boolean;
  notification_type: EventNotificationType;
};

export class SendNotificationViewDetailStrategy implements EventStrategy {
  performComputations({
    delegate,
    notification_type,
  }: NotificationViewDetailData): TrackedEvent<EventNotificationViewDetailType> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        delegate,
        notification_type,
      },
    };
  }
}
