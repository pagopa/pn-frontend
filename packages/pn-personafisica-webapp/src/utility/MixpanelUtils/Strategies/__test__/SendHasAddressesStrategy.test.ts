import { EventPropertyType } from '@pagopa-pn/pn-commons';

import { digitalAddresses, digitalCourtesyAddresses } from '../../../../__mocks__/Contacts.mock';
import { ChannelType, IOAllowedValues } from '../../../../models/contacts';
import { SendHasAddressesStrategy } from '../SendHasAddressesStrategy';

describe('Mixpanel - Has Addresses Strategy', () => {
  it('should return has email, pec and sms filled addresses event', () => {
    const strategy = new SendHasAddressesStrategy();
    const hasPecEvent = strategy.performComputations({
      payload: digitalAddresses,
    });
    expect(hasPecEvent).toEqual({
      [EventPropertyType.PROFILE]: {
        SEND_APPIO_STATUS: 'deactivated',
        SEND_HAS_EMAIL: 'yes',
        SEND_HAS_PEC: 'yes',
        SEND_HAS_SMS: 'yes',
      },
      [EventPropertyType.SUPER_PROPERTY]: {
        SEND_APPIO_STATUS: 'deactivated',
        SEND_HAS_EMAIL: 'yes',
        SEND_HAS_PEC: 'yes',
        SEND_HAS_SMS: 'yes',
      },
    });
  });

  it('should return has no pec address event', () => {
    const strategy = new SendHasAddressesStrategy();

    const addresses = digitalCourtesyAddresses;

    const hasPecEvent = strategy.performComputations({
      payload: addresses,
    });

    expect(hasPecEvent).toEqual({
      [EventPropertyType.PROFILE]: {
        SEND_APPIO_STATUS: 'deactivated',
        SEND_HAS_EMAIL: 'yes',
        SEND_HAS_PEC: 'no',
        SEND_HAS_SMS: 'yes',
      },
      [EventPropertyType.SUPER_PROPERTY]: {
        SEND_APPIO_STATUS: 'deactivated',
        SEND_HAS_EMAIL: 'yes',
        SEND_HAS_PEC: 'no',
        SEND_HAS_SMS: 'yes',
      },
    });
  });

  it('should return has no email address event', () => {
    const strategy = new SendHasAddressesStrategy();

    const addressesWithoutEmail = digitalAddresses.filter(
      (address) => address.channelType !== ChannelType.EMAIL
    );

    const hasPecEvent = strategy.performComputations({
      payload: addressesWithoutEmail,
    });

    expect(hasPecEvent).toEqual({
      [EventPropertyType.PROFILE]: {
        SEND_APPIO_STATUS: 'deactivated',
        SEND_HAS_EMAIL: 'no',
        SEND_HAS_PEC: 'yes',
        SEND_HAS_SMS: 'yes',
      },
      [EventPropertyType.SUPER_PROPERTY]: {
        SEND_APPIO_STATUS: 'deactivated',
        SEND_HAS_EMAIL: 'no',
        SEND_HAS_PEC: 'yes',
        SEND_HAS_SMS: 'yes',
      },
    });
  });

  it('should return has no sms address event', () => {
    const strategy = new SendHasAddressesStrategy();

    const addressesWithoutSMS = digitalAddresses.filter(
      (address) => address.channelType !== ChannelType.SMS
    );

    const hasPecEvent = strategy.performComputations({
      payload: addressesWithoutSMS,
    });

    expect(hasPecEvent).toEqual({
      [EventPropertyType.PROFILE]: {
        SEND_APPIO_STATUS: 'deactivated',
        SEND_HAS_EMAIL: 'yes',
        SEND_HAS_PEC: 'yes',
        SEND_HAS_SMS: 'no',
      },
      [EventPropertyType.SUPER_PROPERTY]: {
        SEND_APPIO_STATUS: 'deactivated',
        SEND_HAS_EMAIL: 'yes',
        SEND_HAS_PEC: 'yes',
        SEND_HAS_SMS: 'no',
      },
    });
  });

  it('should return has nd IO address event', () => {
    const strategy = new SendHasAddressesStrategy();

    const addressesWithoutSMS = digitalAddresses.filter(
      (address) => address.channelType !== ChannelType.IOMSG
    );

    const hasPecEvent = strategy.performComputations({
      payload: addressesWithoutSMS,
    });

    expect(hasPecEvent).toEqual({
      [EventPropertyType.PROFILE]: {
        SEND_APPIO_STATUS: 'nd',
        SEND_HAS_EMAIL: 'yes',
        SEND_HAS_PEC: 'yes',
        SEND_HAS_SMS: 'yes',
      },
      [EventPropertyType.SUPER_PROPERTY]: {
        SEND_APPIO_STATUS: 'nd',
        SEND_HAS_EMAIL: 'yes',
        SEND_HAS_PEC: 'yes',
        SEND_HAS_SMS: 'yes',
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

    const hasPecEvent = strategy.performComputations({
      payload: addressesWithActivatedIO,
    });

    expect(hasPecEvent).toEqual({
      [EventPropertyType.PROFILE]: {
        SEND_APPIO_STATUS: 'activated',
        SEND_HAS_EMAIL: 'yes',
        SEND_HAS_PEC: 'yes',
        SEND_HAS_SMS: 'yes',
      },
      [EventPropertyType.SUPER_PROPERTY]: {
        SEND_APPIO_STATUS: 'activated',
        SEND_HAS_EMAIL: 'yes',
        SEND_HAS_PEC: 'yes',
        SEND_HAS_SMS: 'yes',
      },
    });
  });
});
