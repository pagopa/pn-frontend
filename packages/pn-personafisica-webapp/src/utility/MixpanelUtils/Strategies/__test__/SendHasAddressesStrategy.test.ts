import { EventPropertyType } from '@pagopa-pn/pn-commons';

import {
  digitalAddresses,
  digitalAddressesSercq,
  digitalCourtesyAddresses,
} from '../../../../__mocks__/Contacts.mock';
import { ChannelType, IOAllowedValues } from '../../../../models/contacts';
import { SendHasAddressesStrategy } from '../SendHasAddressesStrategy';

describe('Mixpanel - Has Addresses Strategy', () => {
  it('should return has email, pec and sms filled addresses event', () => {
    const strategy = new SendHasAddressesStrategy();
    const hasAddressesEvent = strategy.performComputations({
      payload: digitalAddresses,
    });
    expect(hasAddressesEvent).toEqual({
      [EventPropertyType.PROFILE]: {
        SEND_APPIO_STATUS: 'deactivated',
        SEND_HAS_EMAIL: 'yes',
        SEND_HAS_PEC: 'yes',
        SEND_HAS_SMS: 'yes',
        SEND_HAS_SERCQ_SEND: 'no',
      },
      [EventPropertyType.SUPER_PROPERTY]: {
        SEND_APPIO_STATUS: 'deactivated',
        SEND_HAS_EMAIL: 'yes',
        SEND_HAS_PEC: 'yes',
        SEND_HAS_SMS: 'yes',
        SEND_HAS_SERCQ_SEND: 'no',
      },
    });
  });

  it('should return has no pec address event', () => {
    const strategy = new SendHasAddressesStrategy();

    const addresses = digitalCourtesyAddresses;

    const hasAddressesEvent = strategy.performComputations({
      payload: addresses,
    });

    expect(hasAddressesEvent).toEqual({
      [EventPropertyType.PROFILE]: {
        SEND_APPIO_STATUS: 'deactivated',
        SEND_HAS_EMAIL: 'yes',
        SEND_HAS_PEC: 'no',
        SEND_HAS_SMS: 'yes',
        SEND_HAS_SERCQ_SEND: 'no',
      },
      [EventPropertyType.SUPER_PROPERTY]: {
        SEND_APPIO_STATUS: 'deactivated',
        SEND_HAS_EMAIL: 'yes',
        SEND_HAS_PEC: 'no',
        SEND_HAS_SMS: 'yes',
        SEND_HAS_SERCQ_SEND: 'no',
      },
    });
  });

  it('should return has no email address event', () => {
    const strategy = new SendHasAddressesStrategy();

    const addressesWithoutEmail = digitalAddresses.filter(
      (address) => address.channelType !== ChannelType.EMAIL
    );

    const hasAddressesEvent = strategy.performComputations({
      payload: addressesWithoutEmail,
    });

    expect(hasAddressesEvent).toEqual({
      [EventPropertyType.PROFILE]: {
        SEND_APPIO_STATUS: 'deactivated',
        SEND_HAS_EMAIL: 'no',
        SEND_HAS_PEC: 'yes',
        SEND_HAS_SMS: 'yes',
        SEND_HAS_SERCQ_SEND: 'no',
      },
      [EventPropertyType.SUPER_PROPERTY]: {
        SEND_APPIO_STATUS: 'deactivated',
        SEND_HAS_EMAIL: 'no',
        SEND_HAS_PEC: 'yes',
        SEND_HAS_SMS: 'yes',
        SEND_HAS_SERCQ_SEND: 'no',
      },
    });
  });

  it('should return has no sms address event', () => {
    const strategy = new SendHasAddressesStrategy();

    const addressesWithoutSMS = digitalAddresses.filter(
      (address) => address.channelType !== ChannelType.SMS
    );

    const hasAddressesEvent = strategy.performComputations({
      payload: addressesWithoutSMS,
    });

    expect(hasAddressesEvent).toEqual({
      [EventPropertyType.PROFILE]: {
        SEND_APPIO_STATUS: 'deactivated',
        SEND_HAS_EMAIL: 'yes',
        SEND_HAS_PEC: 'yes',
        SEND_HAS_SMS: 'no',
        SEND_HAS_SERCQ_SEND: 'no',
      },
      [EventPropertyType.SUPER_PROPERTY]: {
        SEND_APPIO_STATUS: 'deactivated',
        SEND_HAS_EMAIL: 'yes',
        SEND_HAS_PEC: 'yes',
        SEND_HAS_SMS: 'no',
        SEND_HAS_SERCQ_SEND: 'no',
      },
    });
  });

  it('should return has nd IO address event', () => {
    const strategy = new SendHasAddressesStrategy();

    const addressesWithoutSMS = digitalAddresses.filter(
      (address) => address.channelType !== ChannelType.IOMSG
    );

    const hasAddressesEvent = strategy.performComputations({
      payload: addressesWithoutSMS,
    });

    expect(hasAddressesEvent).toEqual({
      [EventPropertyType.PROFILE]: {
        SEND_APPIO_STATUS: 'nd',
        SEND_HAS_EMAIL: 'yes',
        SEND_HAS_PEC: 'yes',
        SEND_HAS_SMS: 'yes',
        SEND_HAS_SERCQ_SEND: 'no',
      },
      [EventPropertyType.SUPER_PROPERTY]: {
        SEND_APPIO_STATUS: 'nd',
        SEND_HAS_EMAIL: 'yes',
        SEND_HAS_PEC: 'yes',
        SEND_HAS_SMS: 'yes',
        SEND_HAS_SERCQ_SEND: 'no',
      },
    });
  });

  it('should return has activated IO address event', () => {
    const strategy = new SendHasAddressesStrategy();

    const addressesWithActivatedIO = digitalAddresses.map((address) => {
      if (address.channelType === ChannelType.IOMSG) {
        return {
          ...address,
          value: IOAllowedValues.ENABLED,
        };
      }
      return address;
    });

    const hasAddressesEvent = strategy.performComputations({
      payload: addressesWithActivatedIO,
    });

    expect(hasAddressesEvent).toEqual({
      [EventPropertyType.PROFILE]: {
        SEND_APPIO_STATUS: 'activated',
        SEND_HAS_EMAIL: 'yes',
        SEND_HAS_PEC: 'yes',
        SEND_HAS_SMS: 'yes',
        SEND_HAS_SERCQ_SEND: 'no',
      },
      [EventPropertyType.SUPER_PROPERTY]: {
        SEND_APPIO_STATUS: 'activated',
        SEND_HAS_EMAIL: 'yes',
        SEND_HAS_PEC: 'yes',
        SEND_HAS_SMS: 'yes',
        SEND_HAS_SERCQ_SEND: 'no',
      },
    });
  });

  it('should return has sercq send address event', () => {
    const strategy = new SendHasAddressesStrategy();

    const hasAddressesEvent = strategy.performComputations({
      payload: digitalAddressesSercq,
    });

    expect(hasAddressesEvent).toEqual({
      [EventPropertyType.PROFILE]: {
        SEND_APPIO_STATUS: 'deactivated',
        SEND_HAS_EMAIL: 'yes',
        SEND_HAS_PEC: 'no',
        SEND_HAS_SMS: 'yes',
        SEND_HAS_SERCQ_SEND: 'yes',
      },
      [EventPropertyType.SUPER_PROPERTY]: {
        SEND_APPIO_STATUS: 'deactivated',
        SEND_HAS_EMAIL: 'yes',
        SEND_HAS_PEC: 'no',
        SEND_HAS_SMS: 'yes',
        SEND_HAS_SERCQ_SEND: 'yes',
      },
    });
  });

  it('should return HAS_SERCQ_SEND as no when is secondary contacts and PEC is default contact', () => {
    const strategy = new SendHasAddressesStrategy();
    const addresses = [
      ...digitalAddresses,
      {
        ...digitalAddressesSercq[0],
        senderId: 'not-default',
      },
    ];

    const hasAddressesEvent = strategy.performComputations({
      payload: addresses,
    });

    expect(hasAddressesEvent).toEqual({
      [EventPropertyType.PROFILE]: {
        SEND_APPIO_STATUS: 'deactivated',
        SEND_HAS_EMAIL: 'yes',
        SEND_HAS_PEC: 'yes',
        SEND_HAS_SMS: 'yes',
        SEND_HAS_SERCQ_SEND: 'no',
      },
      [EventPropertyType.SUPER_PROPERTY]: {
        SEND_APPIO_STATUS: 'deactivated',
        SEND_HAS_EMAIL: 'yes',
        SEND_HAS_PEC: 'yes',
        SEND_HAS_SMS: 'yes',
        SEND_HAS_SERCQ_SEND: 'no',
      },
    });
  });
});
