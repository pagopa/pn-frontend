import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { digitalAddresses, digitalAddressesSercq } from '../../../../__mocks__/Contacts.mock';
import { AddressType, ChannelType } from '../../../../models/contacts';
import { UxWithDigitalDomicileStateStrategy } from '../UxWithDigitalDomicileStateStrategy';

describe('Mixpanel - UX Action with Courtesy Contacts List Strategy', () => {
  const strategy = new UxWithDigitalDomicileStateStrategy();

  const legalContacts = digitalAddresses.filter((addr) => addr.addressType === AddressType.LEGAL);

  it('should return "not_active" when digital domicile is not set', () => {
    const result = strategy.performComputations({
      event_type: EventAction.SCREEN_VIEW,
      legal_addresses: [],
    });

    expect(result).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
        digital_domicile_state: 'not_active',
      },
    });
  });

  it('should return "pec" when pec is set and is valid', () => {
    const result = strategy.performComputations({
      event_type: EventAction.SCREEN_VIEW,
      legal_addresses: legalContacts.filter((addr) => addr.channelType === ChannelType.PEC),
    });

    expect(result).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
        digital_domicile_state: 'pec',
      },
    });
  });

  it('should return "send" when sercq send is set', () => {
    const result = strategy.performComputations({
      event_type: EventAction.SCREEN_VIEW,
      legal_addresses: digitalAddressesSercq,
    });

    expect(result).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
        digital_domicile_state: 'send',
      },
    });
  });
});
