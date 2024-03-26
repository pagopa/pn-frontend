import { EventPropertyType, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

import { DigitalAddress } from '../../../models/contacts';

type SendHasPec = {
  legalAddresses: Array<DigitalAddress>;
};

export class SendHasPecStrategy implements EventStrategy {
  performComputations({ legalAddresses }: SendHasPec): TrackedEvent {
    return {
      [EventPropertyType.PROFILE]: legalAddresses.length > 0 ? 'yes' : 'no',
    };
  }
}
