import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { digitalAddresses } from '../../../../__mocks__/Contacts.mock';
import { AddressType, ChannelType, IOAllowedValues } from '../../../../models/contacts';
import { UxWithDigitalDomicileStateAndContactDetailsStrategy } from '../UxWithDigitalDomicileStateAndContactDetailsStrategy';

describe('Mixpanel - UX Action with DigitalDomicileState and ContactDetails Strategy Strategy', () => {
  const strategy = new UxWithDigitalDomicileStateAndContactDetailsStrategy();

  const courtesyContacts = digitalAddresses
    .filter((addr) => addr.addressType === AddressType.COURTESY)
    .map((contact) =>
      contact.channelType === ChannelType.IOMSG
        ? { ...contact, value: IOAllowedValues.ENABLED }
        : contact
    );

  const legalContacts = digitalAddresses.filter((addr) => addr.addressType === AddressType.LEGAL);

  const getContactsByChannelType = (channelType: ChannelType) =>
    courtesyContacts.filter((addr) => addr.channelType === channelType);

  it('should return "no_contact" when no contacts are provided', () => {
    const result = strategy.performComputations({
      event_type: EventAction.SCREEN_VIEW,
      addresses: [],
    });

    expect(result).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
        contact_details: 'no_contact',
        digital_domicile_state: 'not_active',
      },
    });
  });

  it('should return "no_contact" when only legal contacts are provided', () => {
    const result = strategy.performComputations({
      event_type: EventAction.ACTION,
      addresses: legalContacts,
    });

    expect(result).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        contact_details: 'no_contact',
        digital_domicile_state: 'pec',
      },
    });
  });

  it('should return "app_io" when only IOMSG courtesy contact is provided', () => {
    const contacts = getContactsByChannelType(ChannelType.IOMSG);

    const result = strategy.performComputations({
      event_type: EventAction.ACTION,
      addresses: contacts,
    });

    expect(result).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        contact_details: 'app_io',
        digital_domicile_state: 'not_active',
      },
    });
  });

  it('should return "email" when only EMAIL courtesy contact is provided', () => {
    const contacts = getContactsByChannelType(ChannelType.EMAIL);

    const result = strategy.performComputations({
      event_type: EventAction.ACTION,
      addresses: contacts,
    });

    expect(result).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        contact_details: 'email',
        digital_domicile_state: 'not_active',
      },
    });
  });

  it('should return "sms" when only SMS courtesy contact is provided', () => {
    const contacts = getContactsByChannelType(ChannelType.SMS);

    const result = strategy.performComputations({
      event_type: EventAction.ACTION,
      addresses: contacts,
    });

    expect(result).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        contact_details: 'sms',
        digital_domicile_state: 'not_active',
      },
    });
  });

  it('should return "app_io_email" when IOMSG and EMAIL courtesy contacts are provided', () => {
    const contacts = [
      ...getContactsByChannelType(ChannelType.IOMSG),
      ...getContactsByChannelType(ChannelType.EMAIL),
    ];

    const result = strategy.performComputations({
      event_type: EventAction.ACTION,
      addresses: contacts,
    });

    expect(result).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        contact_details: 'app_io_email',
        digital_domicile_state: 'not_active',
      },
    });
  });

  it('should return "app_io_sms" when IOMSG and SMS courtesy contacts are provided', () => {
    const contacts = [
      ...getContactsByChannelType(ChannelType.IOMSG),
      ...getContactsByChannelType(ChannelType.SMS),
    ];

    const result = strategy.performComputations({
      event_type: EventAction.ACTION,
      addresses: contacts,
    });

    expect(result).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        contact_details: 'app_io_sms',
        digital_domicile_state: 'not_active',
      },
    });
  });

  it('should return "email_sms" when EMAIL and SMS courtesy contacts are provided', () => {
    const contacts = [
      ...getContactsByChannelType(ChannelType.EMAIL),
      ...getContactsByChannelType(ChannelType.SMS),
    ];

    const result = strategy.performComputations({
      event_type: EventAction.ACTION,
      addresses: contacts,
    });

    expect(result).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        contact_details: 'email_sms',
        digital_domicile_state: 'not_active',
      },
    });
  });

  it('should return "app_io_email_sms" when all courtesy contacts are provided', () => {
    const result = strategy.performComputations({
      event_type: EventAction.ACTION,
      addresses: courtesyContacts,
    });

    expect(result).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        contact_details: 'app_io_email_sms',
        digital_domicile_state: 'not_active',
      },
    });
  });

  it('should return "no_contact" if have IOMSG disabled', () => {
    const contacts = getContactsByChannelType(ChannelType.IOMSG).map((addr) => ({
      ...addr,
      value: IOAllowedValues.DISABLED,
    }));

    const result = strategy.performComputations({
      event_type: EventAction.ACTION,
      addresses: contacts,
    });

    expect(result).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        contact_details: 'no_contact',
        digital_domicile_state: 'not_active',
      },
    });
  });

  it('should handle duplicate channel types (for special contacts) and return unique result', () => {
    // for example we have 2 emails (one is default contact and the other is a special contact)
    const contacts = [
      ...getContactsByChannelType(ChannelType.EMAIL),
      ...getContactsByChannelType(ChannelType.SMS),
      {
        addressType: AddressType.COURTESY,
        senderId: 'comune-di-milano',
        channelType: ChannelType.EMAIL,
        value: 'milano@mail.it',
      },
    ];

    const result = strategy.performComputations({
      event_type: EventAction.ACTION,
      addresses: contacts,
    });

    expect(result).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        contact_details: 'email_sms',
        digital_domicile_state: 'not_active',
      },
    });
  });
});
