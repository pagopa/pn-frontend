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
    if (params.channelType === CourtesyChannelType.EMAIL) {
      return {
        [EventPropertyType.PROFILE]: {
          SEND_HAS_EMAIL: 'no',
        },
      };
    }

    return {
      [EventPropertyType.PROFILE]: {
        SEND_HAS_SMS: 'no',
      },
    };
  }
}
