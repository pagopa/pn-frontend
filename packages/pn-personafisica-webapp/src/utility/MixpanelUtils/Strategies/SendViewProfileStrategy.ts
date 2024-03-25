import { EventAction, EventCategory, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

type SendViewProfile = {
  source: 'user_menu' | 'tuoi_recapiti';
};

export class SendViewProfileStrategy implements EventStrategy {
  performComputations({ source }: SendViewProfile): TrackedEvent<SendViewProfile> {
    return {
      event_category: EventCategory.UX,
      event_type: EventAction.ACTION,
      source,
    };
  }
}
