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
  MixpanelDigitalDomicileState,
  concatCourtestyContacts,
  getDigitalDomicileState,
} from '../../mixpanel';

type Props = {
  event_type: EventAction.ACTION | EventAction.SCREEN_VIEW;
  addresses: Array<DigitalAddress>;
  customized_contact_type: ChannelType.PEC | ChannelType.SERCQ_SEND;
  organization_name: string;
};

type Return = {
  digital_domicile_state: MixpanelDigitalDomicileState;
  contact_details: MixpanelConcatCourtesyContacts;
  customized_contact_type: 'pec' | 'send';
  organization_name: string;
};

export class UxWithDDStateContactDetailsCustomContactTypeAndOrgNameStrategy
  implements EventStrategy
{
  performComputations({
    addresses,
    customized_contact_type,
    event_type,
    organization_name,
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
        customized_contact_type: customized_contact_type === ChannelType.PEC ? 'pec' : 'send',
        organization_name,
      },
    };
  }
}
