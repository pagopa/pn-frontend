import { EventPropertyType, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

import { CourtesyChannelType, DigitalAddress } from '../../../models/contacts';
import { SaveDigitalAddressParams } from '../../../redux/contact/types';

type SendAddCourtesyAddressReturn =
  | {
      SEND_HAS_EMAIL: 'yes';
    }
  | {
      SEND_HAS_SMS: 'yes';
    };

type SendAddCourtesyAddressData = {
  payload: DigitalAddress | void;
  params: SaveDigitalAddressParams;
};

export class SendAddCourtesyAddressStrategy implements EventStrategy {
  performComputations({
    payload,
    params,
  }: SendAddCourtesyAddressData): TrackedEvent<SendAddCourtesyAddressReturn> {
    // Check payload to distinguish between the action called before PIN validation and after
    // We have to track only the action after the PIN validation
    if (!payload) {
      return {};
    }

    if (params.channelType === CourtesyChannelType.EMAIL) {
      return {
        [EventPropertyType.PROFILE]: {
          SEND_HAS_EMAIL: 'yes',
        },
        [EventPropertyType.SUPER_PROPERTY]: {
          SEND_HAS_EMAIL: 'yes',
        },
      };
    }

    return {
      [EventPropertyType.PROFILE]: {
        SEND_HAS_SMS: 'yes',
      },
      [EventPropertyType.SUPER_PROPERTY]: {
        SEND_HAS_SMS: 'yes',
      },
    };
  }
}
