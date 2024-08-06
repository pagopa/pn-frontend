import { EventPropertyType, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

import { ChannelType } from '../../../models/contacts';
import { DeleteDigitalAddressParams } from '../../../redux/contact/types';

type SendRemoveAddressReturn =
  | {
      SEND_HAS_EMAIL: 'no';
    }
  | {
      SEND_HAS_SMS: 'no';
    }
  | {
      SEND_HAS_PEC: 'no';
    };

type SendRemoveAddressData = {
  params: DeleteDigitalAddressParams;
};

export class SendRemoveAddressStrategy implements EventStrategy {
  performComputations({ params }: SendRemoveAddressData): TrackedEvent<SendRemoveAddressReturn> {
    // If i'm removing a special contact (senderId !== 'default') I don't want to update the profile property
    if (params.senderId === 'default') {
      if (params.channelType === ChannelType.EMAIL) {
        return {
          [EventPropertyType.PROFILE]: {
            SEND_HAS_EMAIL: 'no',
          },
          [EventPropertyType.SUPER_PROPERTY]: {
            SEND_HAS_EMAIL: 'no',
          },
        };
      }

      if (params.channelType === ChannelType.SMS) {
        return {
          [EventPropertyType.PROFILE]: {
            SEND_HAS_SMS: 'no',
          },
          [EventPropertyType.SUPER_PROPERTY]: {
            SEND_HAS_SMS: 'no',
          },
        };
      }

      if (params.channelType === ChannelType.PEC) {
        return {
          [EventPropertyType.PROFILE]: {
            SEND_HAS_PEC: 'no',
          },
          [EventPropertyType.SUPER_PROPERTY]: {
            SEND_HAS_PEC: 'no',
          },
        };
      }
    }

    return {};
  }
}
