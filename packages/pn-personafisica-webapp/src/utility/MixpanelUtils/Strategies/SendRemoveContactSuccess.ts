import { EventAction, EventCategory, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

export class SendRemoveContactSuccessStrategy implements EventStrategy {
  performComputations(senderId: string): TrackedEvent<{ other_contact: string }> {
    return {
      event_category: EventCategory.UX,
      event_type: EventAction.ACTION,
      ...{
        other_contact: senderId !== 'default' ? 'yes' : 'no',
      },
    };
  }
}
