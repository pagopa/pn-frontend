import { EventAction, EventCategory, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

export class TechScreenViewStrategy implements EventStrategy {
  performComputations(): TrackedEvent {
    return {
      event_category: EventCategory.TECH,
      event_type: EventAction.SCREEN_VIEW,
    };
  }
}
