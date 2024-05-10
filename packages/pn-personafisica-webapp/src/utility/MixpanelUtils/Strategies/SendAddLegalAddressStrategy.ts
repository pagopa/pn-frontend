import { EventPropertyType, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

import { DigitalAddress } from '../../../models/contacts';

type SendAddLegalAddress = {
  SEND_HAS_PEC: 'yes';
};

type SendAddLegalAddressData = {
  payload: DigitalAddress | void;
};

export class SendAddLegalAddressStrategy implements EventStrategy {
  performComputations({ payload }: SendAddLegalAddressData): TrackedEvent<SendAddLegalAddress> {
    if (!(payload && payload.pecValid)) {
      return {};
    }

    return {
      [EventPropertyType.PROFILE]: { SEND_HAS_PEC: 'yes' },
      [EventPropertyType.SUPER_PROPERTY]: { SEND_HAS_PEC: 'yes' },
    };
  }
}
