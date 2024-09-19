import { EventPropertyType, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

import { ChannelType, DigitalAddress, IOAllowedValues } from '../../../models/contacts';

type SendHasAddresses = {
  SEND_HAS_PEC: 'yes' | 'no';
  SEND_HAS_SERCQ_SEND: 'yes' | 'no';
  SEND_HAS_EMAIL: 'yes' | 'no';
  SEND_HAS_SMS: 'yes' | 'no';
  SEND_APPIO_STATUS: 'nd' | 'deactivated' | 'activated';
};

type SendHasAddressesData = {
  payload: Array<DigitalAddress>;
};

export class SendHasAddressesStrategy implements EventStrategy {
  performComputations({ payload }: SendHasAddressesData): TrackedEvent<SendHasAddresses> {
    // TODO - Per PEC e SERCQ capire se vanno filtrati per senderId = default
    const hasPecAddresses =
      payload.filter((address) => address.channelType === ChannelType.PEC).length > 0;
    const hasSercqSendAddress =
      payload.filter((address) => address.channelType === ChannelType.SERCQ_SEND).length > 0;
    const hasCourtesyEmailAddresses =
      payload.filter((address) => address.channelType === ChannelType.EMAIL).length > 0;
    const hasCourtesySmsAddresses =
      payload?.filter((address) => address.channelType === ChannelType.SMS).length > 0;
    const contactIO = payload?.find((address) => address.channelType === ChannelType.IOMSG);

    // eslint-disable-next-line functional/no-let
    let ioStatus: 'nd' | 'deactivated' | 'activated';

    if (!contactIO) {
      ioStatus = 'nd';
    } else if (contactIO?.value === IOAllowedValues.DISABLED) {
      ioStatus = 'deactivated';
    } else {
      ioStatus = 'activated';
    }

    return {
      [EventPropertyType.PROFILE]: {
        SEND_HAS_PEC: hasPecAddresses ? 'yes' : 'no',
        SEND_HAS_SERCQ_SEND: hasSercqSendAddress ? 'yes' : 'no',
        SEND_HAS_EMAIL: hasCourtesyEmailAddresses ? 'yes' : 'no',
        SEND_HAS_SMS: hasCourtesySmsAddresses ? 'yes' : 'no',
        SEND_APPIO_STATUS: ioStatus,
      },
      [EventPropertyType.SUPER_PROPERTY]: {
        SEND_HAS_PEC: hasPecAddresses ? 'yes' : 'no',
        SEND_HAS_SERCQ_SEND: hasSercqSendAddress ? 'yes' : 'no',
        SEND_HAS_EMAIL: hasCourtesyEmailAddresses ? 'yes' : 'no',
        SEND_HAS_SMS: hasCourtesySmsAddresses ? 'yes' : 'no',
        SEND_APPIO_STATUS: ioStatus,
      },
    };
  }
}
