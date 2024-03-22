import {
  EventAction,
  EventCategory,
  EventCreatedDelegationType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

export class SendAddMandateUXSuccessStrategy implements EventStrategy {
  performComputations(data: EventCreatedDelegationType): TrackedEvent<EventCreatedDelegationType> {
    return {
      event_category: EventCategory.UX,
      event_type: EventAction.SCREEN_VIEW,
      ...data,
    };
  }
}
