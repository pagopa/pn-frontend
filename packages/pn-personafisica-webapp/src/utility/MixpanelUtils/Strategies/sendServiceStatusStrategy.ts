import { EventAction, EventCategory, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

export class SendServiceStatusStrategy implements EventStrategy {
  performComputations(service_status_OK?: boolean): TrackedEvent<{ service_status_OK?: boolean }> {
    return {
      event_category: EventCategory.UX,
      event_type: EventAction.ACTION,
      ...{
        service_status_OK,
      },
    };
  }
}
