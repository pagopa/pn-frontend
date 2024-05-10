import { EventPropertyType } from '@pagopa-pn/pn-commons';

import { digitalAddresses } from '../../../../__mocks__/Contacts.mock';
import { CourtesyChannelType } from '../../../../models/contacts';
import { SendRemoveCourtesyAddressStrategy } from '../SendRemoveCourtesyAddress';

describe('Mixpanel - Remove Courtesy Address Strategy', () => {
  it('should return has email when removing an email', () => {
    const strategy = new SendRemoveCourtesyAddressStrategy();
    const address = digitalAddresses.courtesy.find(
      (a) => a.channelType === CourtesyChannelType.EMAIL
    );

    const event = strategy.performComputations({
      payload: 'default',
      params: {
        channelType: address!.channelType,
        recipientId: address!.recipientId,
        senderId: 'default',
      },
    });

    expect(event).toEqual({
      [EventPropertyType.PROFILE]: {
        SEND_HAS_EMAIL: 'no',
      },
      [EventPropertyType.SUPER_PROPERTY]: {
        SEND_HAS_EMAIL: 'no',
      },
    });
  });

  it('should return has sms when removing an sms', () => {
    const strategy = new SendRemoveCourtesyAddressStrategy();
    const address = digitalAddresses.courtesy.find(
      (a) => a.channelType === CourtesyChannelType.SMS
    );

    const event = strategy.performComputations({
      payload: 'default',
      params: {
        channelType: address!.channelType,
        recipientId: address!.recipientId,
        senderId: 'default',
      },
    });

    expect(event).toEqual({
      [EventPropertyType.PROFILE]: {
        SEND_HAS_SMS: 'no',
      },
      [EventPropertyType.SUPER_PROPERTY]: {
        SEND_HAS_SMS: 'no',
      },
    });
  });

  it('should return empty object if senderId is not default', () => {
    const strategy = new SendRemoveCourtesyAddressStrategy();
    const address = digitalAddresses.courtesy.find(
      (a) => a.channelType === CourtesyChannelType.SMS
    );

    const event = strategy.performComputations({
      payload: 'not-default',
      params: {
        channelType: address!.channelType,
        recipientId: address!.recipientId,
        senderId: 'not-default',
      },
    });

    expect(event).toEqual({});
  });
});
