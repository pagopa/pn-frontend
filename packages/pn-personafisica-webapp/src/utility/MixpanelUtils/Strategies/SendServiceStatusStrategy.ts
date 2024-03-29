import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

export class SendServiceStatusStrategy implements EventStrategy {
  performComputations(service_status_OK?: boolean): TrackedEvent<{ service_status_OK?: boolean }> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        service_status_OK,
      },
    };
  }
}
