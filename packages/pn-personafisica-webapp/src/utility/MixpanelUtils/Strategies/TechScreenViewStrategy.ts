import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

export class TechScreenViewStrategy implements EventStrategy {
  performComputations(): TrackedEvent {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.TECH,
        event_type: EventAction.SCREEN_VIEW,
      },
    };
  }
}
