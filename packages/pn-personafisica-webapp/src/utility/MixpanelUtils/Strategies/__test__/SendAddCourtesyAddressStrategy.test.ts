import { EventPropertyType } from '@pagopa-pn/pn-commons';

import { digitalAddresses } from '../../../../__mocks__/Contacts.mock';
import { CourtesyChannelType } from '../../../../models/contacts';
import { SendAddCourtesyAddressStrategy } from '../SendAddCourtesyAddressStrategy';

describe('Mixpanel - Add Courtesy Address Strategy', () => {
  it('should return empty object if payload is empty', () => {
    const strategy = new SendAddCourtesyAddressStrategy();
    const event = strategy.performComputations({
      payload: undefined,
      params: {
        channelType: CourtesyChannelType.EMAIL,
        recipientId: '123',
        senderId: 'default',
        value: '',
      },
    });

    expect(event).toEqual({});
  });

  it('should return has email when adding an email', () => {
    const strategy = new SendAddCourtesyAddressStrategy();
    const address = digitalAddresses.courtesy.find(
      (a) => a.channelType === CourtesyChannelType.EMAIL
    );

    const event = strategy.performComputations({
      payload: address,
      params: {
        channelType: address!.channelType,
        recipientId: address!.recipientId,
        senderId: address!.senderId,
        value: address!.value,
      },
    });

    expect(event).toEqual({
      [EventPropertyType.PROFILE]: {
        SEND_HAS_EMAIL: 'yes',
      },
      [EventPropertyType.SUPER_PROPERTY]: {
        SEND_HAS_EMAIL: 'yes',
      },
    });
  });

  it('should return has sms when adding an sms', () => {
    const strategy = new SendAddCourtesyAddressStrategy();
    const address = digitalAddresses.courtesy.find(
      (a) => a.channelType === CourtesyChannelType.SMS
    );

    const event = strategy.performComputations({
      payload: address,
      params: {
        channelType: address!.channelType,
        recipientId: address!.recipientId,
        senderId: address!.senderId,
        value: address!.value,
      },
    });

    expect(event).toEqual({
      [EventPropertyType.PROFILE]: {
        SEND_HAS_SMS: 'yes',
      },
      [EventPropertyType.SUPER_PROPERTY]: {
        SEND_HAS_SMS: 'yes',
      },
    });
  });
});
