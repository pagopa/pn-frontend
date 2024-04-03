import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { digitalAddresses } from '../../../../__mocks__/Contacts.mock';
import {
  CourtesyChannelType,
  DigitalAddress,
  DigitalAddresses,
  IOAllowedValues,
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
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
        PEC_exists: false,
        email_exists: false,
        telephone_exists: false,
        appIO_status: 'nd',
      },
    });
  });

  it('filled addresses', () => {
    const strategy = new SendYourContactDetailsStrategy();

    const contactIO: DigitalAddress | null = {
      addressType: 'addressType',
      recipientId: 'recipientId',
      senderId: 'senderId',
      channelType: CourtesyChannelType.IOMSG,
      value: IOAllowedValues.ENABLED,
    };

    const yourContactDetailsEvent = strategy.performComputations({ digitalAddresses, contactIO });
    expect(yourContactDetailsEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
        PEC_exists: digitalAddresses.legal.length > 0,
        email_exists:
          digitalAddresses.courtesy.filter((c) => c.channelType === CourtesyChannelType.EMAIL)
            .length > 0,
        telephone_exists:
          digitalAddresses.courtesy.filter((c) => c.channelType === CourtesyChannelType.SMS)
            .length > 0,
        appIO_status: contactIO
          ? contactIO.value === IOAllowedValues.ENABLED
            ? 'activated'
            : 'deactivated'
          : 'nd',
      },
    });
  });
});
