import { EventPropertyType, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

import {
  AddressType,
  ChannelType,
  DigitalAddress,
  IOAllowedValues,
} from '../../../models/contacts';
import { MixpanelConcatCourtesyContacts, concatCourtestyContacts } from '../../mixpanel';

type SendHasAddresses = {
  SEND_HAS_PEC: 'yes' | 'no';
  SEND_HAS_SERCQ_SEND: 'yes' | 'no';
  SEND_HAS_EMAIL: 'yes' | 'no';
  SEND_HAS_SMS: 'yes' | 'no';
  SEND_APPIO_STATUS: 'nd' | 'deactivated' | 'activated';
  contact_details: MixpanelConcatCourtesyContacts;
};

type SendHasAddressesData = {
  payload: Array<DigitalAddress>;
};

export class SendHasAddressesStrategy implements EventStrategy {
  performComputations({ payload }: SendHasAddressesData): TrackedEvent<SendHasAddresses> {
    const hasPecAddresses =
      payload.filter(
        (address) => address.channelType === ChannelType.PEC && address.senderId === 'default'
      ).length > 0;
    const hasSercqSendAddress =
      payload.filter(
        (address) =>
          address.channelType === ChannelType.SERCQ_SEND && address.senderId === 'default'
      ).length > 0;
    const hasCourtesyEmailAddresses =
      payload.filter((address) => address.channelType === ChannelType.EMAIL).length > 0;
    const hasCourtesySmsAddresses =
      payload?.filter((address) => address.channelType === ChannelType.SMS).length > 0;
    const contactIO = payload?.find((address) => address.channelType === ChannelType.IOMSG);

    const courtesyAddresses = payload.filter(
      (address) => address.addressType === AddressType.COURTESY
    );
    const contactDetails = concatCourtestyContacts(courtesyAddresses);

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
        contact_details: contactDetails,
      },
      [EventPropertyType.SUPER_PROPERTY]: {
        SEND_HAS_PEC: hasPecAddresses ? 'yes' : 'no',
        SEND_HAS_SERCQ_SEND: hasSercqSendAddress ? 'yes' : 'no',
        SEND_HAS_EMAIL: hasCourtesyEmailAddresses ? 'yes' : 'no',
        SEND_HAS_SMS: hasCourtesySmsAddresses ? 'yes' : 'no',
        SEND_APPIO_STATUS: ioStatus,
        contact_details: contactDetails,
      },
    };
  }
}
