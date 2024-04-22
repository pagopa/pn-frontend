import { EventPropertyType, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

type SendRemoveLegalAddress = {
  SEND_HAS_PEC: 'no';
};

export class SendRemoveLegalAddressStrategy implements EventStrategy {
  performComputations(): TrackedEvent<SendRemoveLegalAddress> {
    return {
      [EventPropertyType.PROFILE]: {
        SEND_HAS_PEC: 'no',
      },
    };
  }
}
