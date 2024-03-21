import { EventAction, EventCategory, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

export class UXScreenViewStrategy implements EventStrategy {
  performComputations(): TrackedEvent {
    return {
      event_category: EventCategory.UX,
      event_type: EventAction.SCREEN_VIEW,
    };
  }
}
