import { EventAction, EventCategory, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

export class UXActionStrategy implements EventStrategy {
  performComputations(): TrackedEvent {
    return {
      event_category: EventCategory.UX,
      event_type: EventAction.ACTION,
    };
  }
}
