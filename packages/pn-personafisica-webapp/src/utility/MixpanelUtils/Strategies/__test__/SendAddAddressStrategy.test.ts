import { EventPropertyType } from '@pagopa-pn/pn-commons';

import {
  digitalAddressesSercq,
  digitalCourtesyAddresses,
  digitalLegalAddresses,
} from '../../../../__mocks__/Contacts.mock';
import { AddressType, ChannelType } from '../../../../models/contacts';
import { SendAddAddressStrategy } from '../SendAddAddressStrategy';

describe('Mixpanel - Add Address Strategy', () => {
  describe('Send Add Courtesy Address', () => {
    it('should return empty object if payload is empty', () => {
      const strategy = new SendAddAddressStrategy();
      const event = strategy.performComputations({
        payload: undefined,
        params: {
          addressType: AddressType.COURTESY,
          channelType: ChannelType.EMAIL,
          senderId: 'default',
          value: '',
        },
      });

      expect(event).toEqual({});
    });

    it('should return empty object if senderId is not default', () => {
      const strategy = new SendAddAddressStrategy();
      const address = digitalCourtesyAddresses.find((a) => a.channelType === ChannelType.EMAIL);

      const event = strategy.performComputations({
        payload: address,
        params: {
          addressType: address!.addressType,
          channelType: address!.channelType,
          senderId: 'not-default',
          value: address!.value,
        },
      });

      expect(event).toEqual({});
    });

    it('should return has email when adding an email', () => {
      const strategy = new SendAddAddressStrategy();
      const address = digitalCourtesyAddresses.find((a) => a.channelType === ChannelType.EMAIL);

      const event = strategy.performComputations({
        payload: address,
        params: {
          addressType: address!.addressType,
          channelType: address!.channelType,
          senderId: 'default',
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
      const strategy = new SendAddAddressStrategy();
      const address = digitalCourtesyAddresses.find((a) => a.channelType === ChannelType.SMS);

      const event = strategy.performComputations({
        payload: address,
        params: {
          addressType: address!.addressType,
          channelType: address!.channelType,
          senderId: 'default',
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

  describe('Send Add Legal Address', () => {
    it('should return empty object if payload is empty', () => {
      const strategy = new SendAddAddressStrategy();
      const event = strategy.performComputations({
        payload: undefined,
        params: {
          addressType: AddressType.LEGAL,
          channelType: ChannelType.PEC,
          senderId: 'default',
          value: '',
        },
      });

      expect(event).toEqual({});
    });

    it('should return empty object if senderId is not default', () => {
      const strategy = new SendAddAddressStrategy();
      const address = digitalLegalAddresses[0];

      const event = strategy.performComputations({
        payload: address,
        params: {
          addressType: address.addressType,
          channelType: address.channelType,
          senderId: 'not-default',
          value: address.value,
        },
      });

      expect(event).toEqual({});
    });

    it('should return empty object if PEC is not valid', () => {
      const strategy = new SendAddAddressStrategy();
      const address = digitalLegalAddresses[0];

      const event = strategy.performComputations({
        payload: {
          ...address,
          pecValid: false,
        },
        params: {
          addressType: address.addressType,
          channelType: address.channelType,
          senderId: 'default',
          value: address.value,
        },
      });

      expect(event).toEqual({});
    });

    it('should return has pec when adding a PEC address', () => {
      const strategy = new SendAddAddressStrategy();
      const address = digitalLegalAddresses[0];

      const event = strategy.performComputations({
        payload: address,
        params: {
          addressType: address.addressType,
          channelType: address.channelType,
          senderId: 'default',
          value: address.value,
        },
      });

      expect(event).toEqual({
        [EventPropertyType.PROFILE]: {
          SEND_HAS_PEC: 'yes',
        },
        [EventPropertyType.SUPER_PROPERTY]: {
          SEND_HAS_PEC: 'yes',
        },
      });
    });

    it('should return has sercq send when adding a SERCQ address', () => {
      const strategy = new SendAddAddressStrategy();
      const address = digitalAddressesSercq.find((a) => a.channelType === ChannelType.SERCQ_SEND);

      const event = strategy.performComputations({
        payload: address,
        params: {
          addressType: address!.addressType,
          channelType: address!.channelType,
          senderId: 'default',
          value: address!.value,
        },
      });

      expect(event).toEqual({
        [EventPropertyType.PROFILE]: {
          SEND_HAS_SERCQ_SEND: 'yes',
        },
        [EventPropertyType.SUPER_PROPERTY]: {
          SEND_HAS_SERCQ_SEND: 'yes',
        },
      });
    });
  });
});
