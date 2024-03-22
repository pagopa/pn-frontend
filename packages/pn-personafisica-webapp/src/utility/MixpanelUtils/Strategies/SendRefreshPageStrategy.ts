import {
  EventAction,
  EventCategory,
  EventPageType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

export class SendRefreshPageStrategy implements EventStrategy {
  performComputations(page: EventPageType): TrackedEvent<{ page: EventPageType }> {
    return {
      event_category: EventCategory.UX,
      event_type: EventAction.ACTION,
      ...{
        page,
      },
    };
  }
}
