import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

export class KoErrorStrategy implements EventStrategy {
  performComputations(details?: { [key: string]: string }): TrackedEvent {
    if (!details) {
      return {
        [EventPropertyType.TRACK]: {
          event_category: EventCategory.KO,
          event_type: EventAction.ERROR,
        },
      };
    }
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.KO,
        event_type: EventAction.ERROR,
        ...details,
      },
    };
  }
}
