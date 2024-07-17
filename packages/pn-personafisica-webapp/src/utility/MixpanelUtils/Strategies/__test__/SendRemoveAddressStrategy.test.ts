import { EventPropertyType } from '@pagopa-pn/pn-commons';

import { digitalAddresses } from '../../../../__mocks__/Contacts.mock';
import { AddressType, CourtesyChannelType, LegalChannelType } from '../../../../models/contacts';
import { DeleteDigitalAddressParams } from '../../../../redux/contact/types';
import { SendRemoveAddressStrategy } from '../SendRemoveAddressStrategy';

describe('Mixpanel - Remove Address Strategy', () => {
  describe('Send Remove Courtesy Address', () => {
    it('should return has email when removing an email', () => {
      const strategy = new SendRemoveAddressStrategy();
      const address = digitalAddresses.find((a) => a.channelType === CourtesyChannelType.EMAIL);

      const event = strategy.performComputations({
        params: {
          addressType: address!.addressType,
          channelType: address!.channelType,
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
      const strategy = new SendRemoveAddressStrategy();
      const address = digitalAddresses.find((a) => a.channelType === CourtesyChannelType.SMS);

      const event = strategy.performComputations({
        params: {
          addressType: address!.addressType,
          channelType: address!.channelType,
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
      const strategy = new SendRemoveAddressStrategy();
      const address = digitalAddresses.find((a) => a.channelType === CourtesyChannelType.SMS);

      const event = strategy.performComputations({
        params: {
          addressType: address!.addressType,
          channelType: address!.channelType,
          senderId: 'not-default',
        },
      });

      expect(event).toEqual({});
    });
  });

  describe('Send Remove Legal Address', () => {
    it('should return remove legal address event if senderId is default', () => {
      const strategy = new SendRemoveAddressStrategy();

      const params: { payload: string; params: DeleteDigitalAddressParams } = {
        payload: 'OK',
        params: {
          addressType: AddressType.LEGAL,
          senderId: 'default',
          channelType: LegalChannelType.PEC,
        },
      };

      const event = strategy.performComputations(params);

      expect(event).toEqual({
        [EventPropertyType.PROFILE]: {
          SEND_HAS_PEC: 'no',
        },
        [EventPropertyType.SUPER_PROPERTY]: {
          SEND_HAS_PEC: 'no',
        },
      });
    });

    it('should return empty object if senderId is not default', () => {
      const strategy = new SendRemoveAddressStrategy();

      const params: { payload: string; params: DeleteDigitalAddressParams } = {
        payload: 'OK',
        params: {
          addressType: AddressType.LEGAL,
          senderId: 'not-default',
          channelType: LegalChannelType.PEC,
        },
      };

      const event = strategy.performComputations(params);

      expect(event).toEqual({});
    });
  });
});
