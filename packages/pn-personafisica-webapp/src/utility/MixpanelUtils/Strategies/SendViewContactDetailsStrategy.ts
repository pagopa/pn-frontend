import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

type SendViewContactDetails = {
  source: 'home_notifiche' | 'profilo';
};

export class SendViewContactDetailsStrategy implements EventStrategy {
  performComputations({ source }: SendViewContactDetails): TrackedEvent<SendViewContactDetails> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        source,
      },
    };
  }
}
