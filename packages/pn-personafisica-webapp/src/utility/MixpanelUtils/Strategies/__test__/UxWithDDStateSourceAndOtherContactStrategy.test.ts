import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { digitalAddresses } from '../../../../__mocks__/Contacts.mock';
import {
  AddressType,
  ChannelType,
  ContactSource,
  IOAllowedValues,
} from '../../../../models/contacts';
import { UxWithDDStateSourceAndOtherContactStrategy } from '../UxWithDDStateSourceAndOtherContactStrategy';

describe('Mixpanel - UX Action with Digital Domicile State, Source and Other Contact Strategy', () => {
  const strategy = new UxWithDDStateSourceAndOtherContactStrategy();

  const courtesyContacts = digitalAddresses
    .filter((addr) => addr.addressType === AddressType.COURTESY)
    .map((contact) =>
      contact.channelType === ChannelType.IOMSG
        ? { ...contact, value: IOAllowedValues.ENABLED }
        : contact
    );

  it('should return profilo when Source is PROFILE', () => {
    const result = strategy.performComputations({
      event_type: EventAction.SCREEN_VIEW,
      addresses: courtesyContacts,
      source: ContactSource.PROFILO,
    });

    expect(result).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
        digital_domicile_state: 'not_active',
        source: 'profilo',
        other_contact: 'no',
      },
    });
  });

  it('should return other_contact = no', () => {
    const result = strategy.performComputations({
      event_type: EventAction.ACTION,
      addresses: courtesyContacts,
      source: ContactSource.RECAPITI,
    });

    expect(result).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        digital_domicile_state: 'not_active',
        source: 'recapiti',
        other_contact: 'no',
      },
    });
  });
});
