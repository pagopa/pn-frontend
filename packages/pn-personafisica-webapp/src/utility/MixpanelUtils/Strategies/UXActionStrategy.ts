import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';
import { EventNotificationType } from '@pagopa-pn/pn-commons/src/models/MixpanelEvents';

type UXActionData = {
  notification_type?: EventNotificationType;
};

type UXActionEventType = {
  event_category: EventCategory;
  event_type: EventAction;
  notification_type?: EventNotificationType;
};

export class UXActionStrategy implements EventStrategy {
  performComputations({ notification_type }: UXActionData = {}): TrackedEvent<UXActionEventType> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        ...(notification_type && { notification_type }),
      },
    };
  }
}
