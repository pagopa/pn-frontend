import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { digitalAddresses, digitalAddressesSercq } from '../../../../__mocks__/Contacts.mock';
import { ChannelType } from '../../../../models/contacts';
import { UxWithDDStateContactDetailsCustomizedContactTypeStrategy } from '../UxWithDDStateContactDetailsCustomizedContactTypeStrategy';

describe('Mixpanel - UX Action with Digital Domicil State, ContactDetails and Customized contact type Strategy', () => {
  const strategy = new UxWithDDStateContactDetailsCustomizedContactTypeStrategy();
  it('should return digital_domicile_state, some contact details, customized contact type as PEC and organization name=missing', () => {
    const result = strategy.performComputations({
      event_type: EventAction.SCREEN_VIEW,
      addresses: digitalAddresses,
      customized_contact_type: ChannelType.PEC,
    });

    expect(result).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
        digital_domicile_state: 'pec',
        contact_details: 'email_sms',
        customized_contact_type: 'pec',
      },
    });
  });

  it('should return digital_domicile_state, some contact details and customized contact type missing', () => {
    const result = strategy.performComputations({
      event_type: EventAction.ACTION,
      addresses: digitalAddresses,
      customized_contact_type: 'missing',
    });

    expect(result).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        digital_domicile_state: 'pec',
        contact_details: 'email_sms',
        customized_contact_type: 'missing',
      },
    });
  });

  it('should return digital_domicile_state, some contact details and customized contact type missing', () => {
    const result = strategy.performComputations({
      event_type: EventAction.ACTION,
      addresses: digitalAddressesSercq,
      customized_contact_type: ChannelType.PEC,
    });

    expect(result).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        digital_domicile_state: 'send',
        contact_details: 'email_sms',
        customized_contact_type: 'pec',
      },
    });
  });
});
