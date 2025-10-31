import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

import { AddressType, DigitalAddress } from '../../../models/contacts';
import {
  MixpanelConcatCourtesyContacts,
  concatCourtestyContacts,
  isCustomizedContact,
} from '../../mixpanel';

type Props = {
  event_type: EventAction.ACTION | EventAction.SCREEN_VIEW;
  addresses: Array<DigitalAddress>;
  senderId: string;
};

type Return = {
  contact_details: MixpanelConcatCourtesyContacts;
  customized_contact: string;
};

export class UxWithContactDetailsAndCustomizedContactStrategy implements EventStrategy {
  performComputations({ addresses, senderId, event_type }: Props): TrackedEvent<Return> {
    const courtesyAddresses = addresses.filter(
      (address) => address.addressType === AddressType.COURTESY
    );

    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type,
        contact_details: concatCourtestyContacts(courtesyAddresses),
        customized_contact: isCustomizedContact(senderId),
      },
    };
  }
}
