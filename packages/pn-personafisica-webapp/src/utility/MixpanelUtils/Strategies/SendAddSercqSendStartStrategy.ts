import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

type Source = 'recapiti' | 'profilo' | 'home_notifiche' | 'dettaglio_notifica';

type SendAddSercqSendData = {
  senderId: string;
  source: Source;
};

type SendAddSercqSendReturn = {
  other_contact: string;
  source: Source;
};

export class SendAddSercqSendStartActionStrategy implements EventStrategy {
  performComputations({
    senderId,
    source,
  }: SendAddSercqSendData): TrackedEvent<SendAddSercqSendReturn> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        other_contact: senderId !== 'default' ? 'yes' : 'no',
        source,
      },
    };
  }
}
