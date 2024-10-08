import { EventPropertyType, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

import { ChannelType, DigitalAddress, SaveDigitalAddressParams } from '../../../models/contacts';

type SendAddAddressReturn =
  | {
      SEND_HAS_EMAIL: 'yes';
    }
  | {
      SEND_HAS_SMS: 'yes';
    }
  | {
      SEND_HAS_PEC: 'yes';
    }
  | {
      SEND_HAS_SERCQ_SEND: 'yes';
    };

type SendAddAddressData = {
  payload: DigitalAddress | void;
  params: SaveDigitalAddressParams;
};

export class SendAddAddressStrategy implements EventStrategy {
  performComputations({ payload, params }: SendAddAddressData): TrackedEvent<SendAddAddressReturn> {
    const { channelType } = params;
    // Check payload to distinguish between the action called before PIN validation and after
    // We have to track only the action after the PIN validation
    if (!payload || params.senderId !== 'default') {
      return {};
    }

    if (channelType === ChannelType.PEC && !(payload && payload.pecValid)) {
      return {};
    }

    if (channelType === ChannelType.EMAIL) {
      return {
        [EventPropertyType.PROFILE]: {
          SEND_HAS_EMAIL: 'yes',
        },
        [EventPropertyType.SUPER_PROPERTY]: {
          SEND_HAS_EMAIL: 'yes',
        },
      };
    }

    if (channelType === ChannelType.SMS) {
      return {
        [EventPropertyType.PROFILE]: {
          SEND_HAS_SMS: 'yes',
        },
        [EventPropertyType.SUPER_PROPERTY]: {
          SEND_HAS_SMS: 'yes',
        },
      };
    }

    if (channelType === ChannelType.PEC) {
      return {
        [EventPropertyType.PROFILE]: {
          SEND_HAS_PEC: 'yes',
        },
        [EventPropertyType.SUPER_PROPERTY]: {
          SEND_HAS_PEC: 'yes',
        },
      };
    }

    if (channelType === ChannelType.SERCQ_SEND) {
      return {
        [EventPropertyType.PROFILE]: {
          SEND_HAS_SERCQ_SEND: 'yes',
        },
        [EventPropertyType.SUPER_PROPERTY]: {
          SEND_HAS_SERCQ_SEND: 'yes',
        },
      };
    }

    // AppIO case
    return {};
  }
}
