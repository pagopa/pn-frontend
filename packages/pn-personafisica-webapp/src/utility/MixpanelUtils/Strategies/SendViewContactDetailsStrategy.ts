import { EventAction, EventCategory, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

type SendViewContactDetails = {
  source: 'home_notifiche' | 'profilo';
};

export class SendViewContactDetailsStrategy implements EventStrategy {
  performComputations(data: SendViewContactDetails): TrackedEvent<SendViewContactDetails> {
    return {
      event_category: EventCategory.UX,
      event_type: EventAction.ACTION,
      ...data,
    };
  }
}
