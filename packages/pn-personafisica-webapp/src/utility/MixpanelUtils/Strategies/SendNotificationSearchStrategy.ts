import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

type NotificationSearchData = {
  delegate: boolean;
  filter: string;
};

type EventNotificationSearchType = {
  event_category: EventCategory;
  event_type: EventAction;
  delegate: boolean;
  filter: string;
};

export class SendNotificationSearchStrategy implements EventStrategy {
  performComputations({
    delegate,
    filter,
  }: NotificationSearchData): TrackedEvent<EventNotificationSearchType> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        delegate,
        filter,
      },
    };
  }
}
