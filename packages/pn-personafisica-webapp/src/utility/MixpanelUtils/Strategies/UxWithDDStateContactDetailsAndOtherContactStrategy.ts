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
  MixpanelDigitalDomicileState,
  concatCourtestyContacts,
  getDigitalDomicileState,
} from '../../mixpanel';

type Props = {
  event_type: EventAction;
  addresses: Array<DigitalAddress>;
  other_contact: boolean;
};

type Return = {
  digital_domicile_state: MixpanelDigitalDomicileState;
  contact_details: MixpanelConcatCourtesyContacts;
  other_contact: 'yes' | 'no';
};

export class UxWithDDStateContactDetailsAndOtherContactStrategy implements EventStrategy {
  performComputations({ addresses, event_type, other_contact }: Props): TrackedEvent<Return> {
    const legalAddresses = addresses.filter((address) => address.addressType === AddressType.LEGAL);
    const courtesyAddresses = addresses.filter(
      (address) => address.addressType === AddressType.COURTESY
    );

    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type,
        digital_domicile_state: getDigitalDomicileState(legalAddresses),
        contact_details: concatCourtestyContacts(courtesyAddresses),
        other_contact: other_contact ? 'yes' : 'no',
      },
    };
  }
}
