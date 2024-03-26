import {
  EventAction,
  EventCategory,
  EventCreatedDelegationType,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

export class SendAddMandateUXSuccessStrategy implements EventStrategy {
  performComputations({
    person_type,
    mandate_type,
  }: EventCreatedDelegationType): TrackedEvent<EventCreatedDelegationType> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
        person_type,
        mandate_type,
      },
    };
  }
}
