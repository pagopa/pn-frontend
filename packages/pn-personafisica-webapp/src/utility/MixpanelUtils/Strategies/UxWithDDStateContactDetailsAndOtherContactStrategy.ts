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
  event_type: EventAction.ACTION | EventAction.SCREEN_VIEW;
  addresses: Array<DigitalAddress>;
};

type Return = {
  digital_domicile_state: MixpanelDigitalDomicileState;
  contact_details: MixpanelConcatCourtesyContacts;
  other_contact: 'yes' | 'no';
};

export class UxWithDDStateContactDetailsAndOtherContactStrategy implements EventStrategy {
  performComputations({ addresses, event_type }: Props): TrackedEvent<Return> {
    const legalAddresses = addresses.filter((address) => address.addressType === AddressType.LEGAL);
    const courtesyAddresses = addresses.filter(
      (address) => address.addressType === AddressType.COURTESY
    );
    const otherAddresses = addresses.some(
      (address) => address.addressType === AddressType.LEGAL && address.senderId !== 'default'
    );

    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type,
        digital_domicile_state: getDigitalDomicileState(legalAddresses),
        contact_details: concatCourtestyContacts(courtesyAddresses),
        other_contact: otherAddresses ? 'yes' : 'no',
      },
    };
  }
}
