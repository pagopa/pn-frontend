import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

export class SendAddContactActionStrategy implements EventStrategy {
  performComputations(isSpecialContact: boolean): TrackedEvent<{ other_contact: string }> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        other_contact: isSpecialContact ? 'yes' : 'no',
      },
    };
  }
}
