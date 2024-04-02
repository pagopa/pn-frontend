import {
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

export class TechStrategy implements EventStrategy {
  performComputations(): TrackedEvent {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.TECH,
      },
    };
  }
}
