import { EventPropertyType, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

import { CourtesyChannelType } from '../../../models/contacts';
import { DeleteDigitalAddressParams } from '../../../redux/contact/types';

type SendRemoveCourtesyAddressReturn =
  | {
      SEND_HAS_EMAIL: 'no';
    }
  | {
      SEND_HAS_SMS: 'no';
    };

type SendRemoveCourtesyAddressData = {
  payload: string;
  params: DeleteDigitalAddressParams;
};

export class SendRemoveCourtesyAddressStrategy implements EventStrategy {
  performComputations({
    params,
  }: SendRemoveCourtesyAddressData): TrackedEvent<SendRemoveCourtesyAddressReturn> {
    // If i'm removing a special contact (senderId !== 'default') I don't want to update the profile property
    if (params.senderId === 'default') {
      if (params.channelType === CourtesyChannelType.EMAIL) {
        return {
          [EventPropertyType.PROFILE]: {
            SEND_HAS_EMAIL: 'no',
          },
          [EventPropertyType.SUPER_PROPERTY]: {
            SEND_HAS_EMAIL: 'no',
          },
        };
      }

      return {
        [EventPropertyType.PROFILE]: {
          SEND_HAS_SMS: 'no',
        },
        [EventPropertyType.SUPER_PROPERTY]: {
          SEND_HAS_SMS: 'no',
        },
      };
    } else {
      return {};
    }
  }
}
