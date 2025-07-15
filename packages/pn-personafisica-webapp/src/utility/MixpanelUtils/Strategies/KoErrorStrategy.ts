import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

export class KoErrorStrategy implements EventStrategy {
  performComputations(): TrackedEvent {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.KO,
        event_type: EventAction.ERROR,
      },
    };
  }
}
