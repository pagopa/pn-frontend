import { EventPropertyType, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

type SendAcceptDelegation = {
  SEND_HAS_MANDATE: 'yes';
};

export class SendAcceptDelegationStrategy implements EventStrategy {
  performComputations(): TrackedEvent<SendAcceptDelegation> {
    return {
      [EventPropertyType.PROFILE]: {
        SEND_HAS_MANDATE: 'yes',
      },
    };
  }
}
