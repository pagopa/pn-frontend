import { EventCategory, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

export class TechStrategy implements EventStrategy {
  performComputations(): TrackedEvent {
    return {
      event_category: EventCategory.TECH,
    };
  }
}
