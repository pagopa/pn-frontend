import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

export class SendAddSercqSendUxSuccessStrategy implements EventStrategy {
  performComputations(senderId: string): TrackedEvent<{ other_contact: 'yes' | 'no' }> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.CONFIRM,
        other_contact: senderId !== 'default' ? 'yes' : 'no',
      },
    };
  }
}
