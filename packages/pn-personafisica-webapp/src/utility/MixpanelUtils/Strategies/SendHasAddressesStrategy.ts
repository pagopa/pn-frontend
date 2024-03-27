import { EventPropertyType, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

import { CourtesyChannelType, DigitalAddresses, IOAllowedValues } from '../../../models/contacts';

type SendHasAddresses = {
  SEND_HAS_PEC: 'yes' | 'no';
  SEND_HAS_EMAIL: 'yes' | 'no';
  SEND_HAS_SMS: 'yes' | 'no';
  SEND_APPIO_STATUS: 'nd' | 'deactivated' | 'activated';
};

export class SendHasAddressesStrategy implements EventStrategy {
  performComputations(payload: DigitalAddresses): TrackedEvent<SendHasAddresses> {
    const hasLegalAddresses = payload?.legal?.length > 0;
    const hasCourtesyEmailAddresses =
      payload?.courtesy?.filter((address) => address.channelType === CourtesyChannelType.EMAIL)
        .length > 0;
    const hasCourtesySmsAddresses =
      payload?.courtesy?.filter((address) => address.channelType === CourtesyChannelType.SMS)
        .length > 0;
    const contactIO = payload?.courtesy?.find(
      (address) => address.channelType === CourtesyChannelType.IOMSG
    );

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
        SEND_HAS_PEC: hasLegalAddresses ? 'yes' : 'no',
        SEND_HAS_EMAIL: hasCourtesyEmailAddresses ? 'yes' : 'no',
        SEND_HAS_SMS: hasCourtesySmsAddresses ? 'yes' : 'no',
        SEND_APPIO_STATUS: ioStatus,
      },
    };
  }
}
