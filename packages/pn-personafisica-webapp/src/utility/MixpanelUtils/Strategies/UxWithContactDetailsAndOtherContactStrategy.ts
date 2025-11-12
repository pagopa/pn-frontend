import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

import { AddressType, DigitalAddress } from '../../../models/contacts';
import { MixpanelConcatCourtesyContacts, concatCourtestyContacts } from '../../mixpanel';

type Props = {
  event_type: EventAction.ACTION | EventAction.SCREEN_VIEW;
  addresses: Array<DigitalAddress>;
  other_contact: boolean;
};

type Return = {
  contact_details: MixpanelConcatCourtesyContacts;
  other_contact: string;
};

export class UxWithContactDetailsAndOtherContactStrategy implements EventStrategy {
  performComputations({ addresses, other_contact, event_type }: Props): TrackedEvent<Return> {
    const courtesyAddresses = addresses.filter(
      (address) => address.addressType === AddressType.COURTESY
    );

    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type,
        contact_details: concatCourtestyContacts(courtesyAddresses),
        other_contact: other_contact ? 'yes' : 'no',
      },
    };
  }
}
