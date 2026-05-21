import { SERCQ_SEND_VALUE } from '@pagopa-pn/pn-commons';

import { digitalAddresses } from '../../../../__mocks__/Contacts.mock';
import { AddressType, ChannelType } from '../../../../models/contacts';
import { mapContactDetailsToEventPayload } from '../contactPayloadMappers';

describe('contactPayloadMappers', () => {
  it('should map contact detail data to event payload', () => {
    // test all contacts
    let payload = mapContactDetailsToEventPayload(digitalAddresses);
    expect(payload).toStrictEqual({
      digital_domicile_exists: true,
      digital_domicile_type: ChannelType.PEC,
      email_exists: true,
      telephone_exists: true,
    });

    // no contacts
    payload = mapContactDetailsToEventPayload([]);
    expect(payload).toStrictEqual({
      digital_domicile_exists: false,
      digital_domicile_type: 'not_available',
      email_exists: false,
      telephone_exists: false,
    });

    // SERCQ and SMS
    payload = mapContactDetailsToEventPayload([
      {
        addressType: AddressType.LEGAL,
        channelType: ChannelType.SERCQ_SEND,
        senderId: 'default',
        value: SERCQ_SEND_VALUE,
      },
      {
        addressType: AddressType.COURTESY,
        channelType: ChannelType.SMS,
        senderId: 'default',
        value: '+39333123456',
      },
    ]);
    expect(payload).toStrictEqual({
      digital_domicile_exists: true,
      digital_domicile_type: ChannelType.SERCQ_SEND,
      email_exists: false,
      telephone_exists: true,
    });

    // custom contacts and PEC in validation state
    payload = mapContactDetailsToEventPayload([
      {
        addressType: AddressType.LEGAL,
        channelType: ChannelType.PEC,
        senderId: 'default',
        value: 'test@pec.pagopa.it',
        pecValid: false,
      },
      {
        addressType: AddressType.COURTESY,
        channelType: ChannelType.EMAIL,
        senderId: 'custom-sender',
        value: 'test@mail.pagopa.it',
      },
      {
        addressType: AddressType.COURTESY,
        channelType: ChannelType.SMS,
        senderId: 'another-custom-sender',
        value: '+39333123456',
      },
    ]);
    expect(payload).toStrictEqual({
      digital_domicile_exists: false,
      digital_domicile_type: 'not_available',
      email_exists: false,
      telephone_exists: false,
    });
  });
});
