import { EventPropertyType, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

import { Delegator } from '../../../redux/delegation/types';

type SendHasMandateLogin = {
  SEND_HAS_MANDATE: 'yes' | 'no';
};

type SendHasMandateLoginData = {
  payload: Array<Delegator>;
};

export class SendHasMandateLoginStrategy implements EventStrategy {
  performComputations({ payload }: SendHasMandateLoginData): TrackedEvent<SendHasMandateLogin> {
    return {
      [EventPropertyType.PROFILE]: {
        SEND_HAS_MANDATE: payload.length > 0 ? 'yes' : 'no',
      },
    };
  }
}
