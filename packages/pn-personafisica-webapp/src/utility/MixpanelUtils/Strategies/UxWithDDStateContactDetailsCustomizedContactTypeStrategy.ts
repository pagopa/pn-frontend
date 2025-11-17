import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

import { AddressType, ChannelType, DigitalAddress } from '../../../models/contacts';
import {
  MixpanelConcatCourtesyContacts,
  MixpanelCustomizedContactType,
  MixpanelDigitalDomicileState,
  concatCourtestyContacts,
  getCustomizedContactType,
  getDigitalDomicileState,
} from '../../mixpanel';

type Props = {
  event_type: EventAction.ACTION | EventAction.SCREEN_VIEW;
  addresses: Array<DigitalAddress>;
  customized_contact_type: ChannelType.PEC | ChannelType.SERCQ_SEND | 'missing';
};

type Return = {
  digital_domicile_state: MixpanelDigitalDomicileState;
  contact_details: MixpanelConcatCourtesyContacts;
  customized_contact_type: MixpanelCustomizedContactType;
};

export class UxWithDDStateContactDetailsCustomizedContactTypeStrategy implements EventStrategy {
  performComputations({
    addresses,
    customized_contact_type,
    event_type,
  }: Props): TrackedEvent<Return> {
    const courtesyAddresses = addresses.filter(
      (address) => address.addressType === AddressType.COURTESY
    );

    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type,
        digital_domicile_state: getDigitalDomicileState(addresses),
        contact_details: concatCourtestyContacts(courtesyAddresses),
        customized_contact_type: getCustomizedContactType(customized_contact_type),
      },
    };
  }
}
