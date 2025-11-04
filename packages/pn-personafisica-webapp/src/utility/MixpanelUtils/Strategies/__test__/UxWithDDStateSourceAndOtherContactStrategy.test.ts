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

  it('should return recapiti when Source is RECAPITI', () => {
    const result = strategy.performComputations({
      event_type: EventAction.SCREEN_VIEW,
      addresses: courtesyContacts,
      source: ContactSource.RECAPITI,
      // other_contact: false,

    });

    expect(result).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
        addresses: 'app_io_email_sms',
        source: 'recapiti',
      },
    });
  });

  it('should return no when other contact is false', () => {
    const result = strategy.performComputations({
      event_type: EventAction.ACTION,
      addresses: courtesyContacts,
      source: ContactSource.RECAPITI,
      // other_contact: false,
    });

    expect(result).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        addresses: 'app_io_email_sms',
        other_contact: 'no',
      },
    });
  });
});
