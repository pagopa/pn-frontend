import { EventAction, EventCategory, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

export class SendAddContactScreenViewStrategy implements EventStrategy {
  performComputations(isSpecialContact: boolean): TrackedEvent<{ other_contact: string }> {
    return {
      event_category: EventCategory.UX,
      event_type: EventAction.SCREEN_VIEW,
      other_contact: isSpecialContact ? 'yes' : 'no',
    };
  }
}
