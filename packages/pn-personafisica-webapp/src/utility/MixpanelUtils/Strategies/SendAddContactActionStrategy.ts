import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

export class SendAddContactActionStrategy implements EventStrategy {
  performComputations(senderId: string): TrackedEvent<{ other_contact: string }> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        other_contact: senderId !== 'default' ? 'yes' : 'no',
      },
    };
  }
}
