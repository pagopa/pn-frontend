import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

import { ChannelType, DigitalAddress } from '../../../models/contacts';
import { MixpanelConcatCourtesyContacts, concatCourtestyContacts } from '../../mixpanel';

type SendHasAddresses = {
  SEND_HAS_SERCQ_SEND?: 'yes' | 'no';
  SEND_HAS_PEC?: 'yes' | 'no';
};

type Props = {
  sercq_type: ChannelType;
  contacts: Array<DigitalAddress>;
};

type Return =
  | {
      other_contact: 'yes' | 'no';
      contact_details: MixpanelConcatCourtesyContacts;
    }
  | SendHasAddresses;

export class SendAddSercqUxSuccessStrategy implements EventStrategy {
  performComputations({ sercq_type, contacts }: Props): TrackedEvent<Return> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.CONFIRM,
        other_contact: 'no',
        contact_details: concatCourtestyContacts(contacts),
      },
      [EventPropertyType.PROFILE]: {
        SEND_HAS_SERCQ_SEND: sercq_type === ChannelType.SERCQ_SEND ? 'yes' : 'no',
        SEND_HAS_PEC: sercq_type === ChannelType.PEC ? 'yes' : 'no',
      },
      [EventPropertyType.SUPER_PROPERTY]: {
        SEND_HAS_SERCQ_SEND: sercq_type === ChannelType.SERCQ_SEND ? 'yes' : 'no',
        SEND_HAS_PEC: sercq_type === ChannelType.PEC ? 'yes' : 'no',
      },
    };
  }
}
