import { EventPropertyType, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

import { DeleteDigitalAddressParams } from '../../../redux/contact/types';

type SendRemoveLegalAddress = {
  SEND_HAS_PEC: 'no';
};

type SendRemoveLegalAddressData = {
  payload: string;
  params: DeleteDigitalAddressParams;
};

export class SendRemoveLegalAddressStrategy implements EventStrategy {
  performComputations({
    params,
  }: SendRemoveLegalAddressData): TrackedEvent<SendRemoveLegalAddress> {
    // If i'm removing a special contact (senderId !== 'default') I don't want to update the profile property
    if (params.senderId === 'default') {
      return {
        [EventPropertyType.PROFILE]: {
          SEND_HAS_PEC: 'no',
        },
        [EventPropertyType.SUPER_PROPERTY]: {
          SEND_HAS_PEC: 'no',
        },
      };
    } else {
      return {};
    }
  }
}
