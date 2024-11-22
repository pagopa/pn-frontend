import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

import { ContactSource } from '../../../models/contacts';

type SendAddSercqSendData = {
  senderId: string;
  source: ContactSource;
};

type SendAddSercqSendReturn = {
  other_contact: string;
  source: ContactSource;
};

export class SendAddContactWithSourceActionStrategy implements EventStrategy {
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
