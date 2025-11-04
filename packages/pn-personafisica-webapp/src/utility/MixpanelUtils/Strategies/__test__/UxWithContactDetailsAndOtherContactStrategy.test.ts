import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { digitalAddresses } from '../../../../__mocks__/Contacts.mock';
import { AddressType, ChannelType, IOAllowedValues } from '../../../../models/contacts';
import { UxWithContactDetailsAndOtherContactStrategy } from '../UxWithContactDetailsAndOtherContactStrategy';

describe('Mixpanel - UX Action with ContactDetails and Other Contacts Strategy Strategy', () => {
  const strategy = new UxWithContactDetailsAndOtherContactStrategy();

  const courtesyContacts = digitalAddresses
    .filter((addr) => addr.addressType === AddressType.COURTESY)
    .map((contact) =>
      contact.channelType === ChannelType.IOMSG
        ? { ...contact, value: IOAllowedValues.ENABLED }
        : contact
    );
    
  it('should return yes when other contact is true', () => {
    const result = strategy.performComputations({
      event_type: EventAction.SCREEN_VIEW,
      addresses: courtesyContacts,
      other_contact: true,
    });

    expect(result).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
        addresses: 'app_io_email_sms',
        other_contact: 'yes',
      },
    });
  });

  it('should return no when other contact is false', () => {
    const result = strategy.performComputations({
      event_type: EventAction.ACTION,
      addresses: courtesyContacts,
      other_contact: false,
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
