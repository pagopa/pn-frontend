import { EventAction, EventCategory } from '@pagopa-pn/pn-commons';

import {
  CourtesyChannelType,
  DigitalAddress,
  DigitalAddresses,
  IOAllowedValues,
  LegalChannelType,
} from '../../../../models/contacts';
import { SendYourContactDetailsStrategy } from '../SendYourContactDetailsStrategy';

describe('Mixpanel - Your Contact Details Strategy', () => {
  it('empty addresses', () => {
    const strategy = new SendYourContactDetailsStrategy();

    const digitalAddresses: DigitalAddresses = {
      legal: [],
      courtesy: [],
    };

    const contactIO: DigitalAddress | null = null;

    const yourContactDetailsEvent = strategy.performComputations({ digitalAddresses, contactIO });
    expect(yourContactDetailsEvent).toEqual({
      event_category: EventCategory.UX,
      event_type: EventAction.SCREEN_VIEW,
      PEC_exists: false,
      email_exists: false,
      telephone_exists: false,
      appIO_status: 'nd',
    });
  });

  it('filled addresses', () => {
    const strategy = new SendYourContactDetailsStrategy();

    const digitalAddresses: DigitalAddresses = {
      legal: [
        {
          addressType: 'addressType',
          recipientId: 'recipientId',
          senderId: 'senderId',
          channelType: LegalChannelType.PEC,
          value: 'pec@pec.it',
        },
      ],
      courtesy: [
        {
          addressType: 'addressType',
          recipientId: 'recipientId',
          senderId: 'senderId',
          channelType: CourtesyChannelType.EMAIL,
          value: 'email@email.it',
        },
        {
          addressType: 'addressType',
          recipientId: 'recipientId',
          senderId: 'senderId',
          channelType: CourtesyChannelType.SMS,
          value: '1234567890',
        },
      ],
    };

    const contactIO: DigitalAddress | null = {
      addressType: 'addressType',
      recipientId: 'recipientId',
      senderId: 'senderId',
      channelType: CourtesyChannelType.IOMSG,
      value: IOAllowedValues.ENABLED,
    };

    const yourContactDetailsEvent = strategy.performComputations({ digitalAddresses, contactIO });
    expect(yourContactDetailsEvent).toEqual({
      event_category: EventCategory.UX,
      event_type: EventAction.SCREEN_VIEW,
      PEC_exists: true,
      email_exists: true,
      telephone_exists: true,
      appIO_status: 'activated',
    });
  });
});
