import { EventPropertyType, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

import { Delegator } from '../../../redux/delegation/types';
import { DelegationStatus } from '../../status.utility';

type SendHasMandateGiven = {
  SEND_MANDATE_GIVEN: 'yes' | 'no';
};

type SendHasMandateGivenData = {
  payload: Array<Delegator>;
};

export class SendHasMandateGivenStrategy implements EventStrategy {
  performComputations({ payload }: SendHasMandateGivenData): TrackedEvent<SendHasMandateGiven> {
    const hasDelegates = payload?.filter(
      (delegation) => delegation.status === DelegationStatus.ACTIVE
    );

    return {
      [EventPropertyType.PROFILE]: {
        SEND_MANDATE_GIVEN: hasDelegates?.length > 0 ? 'yes' : 'no',
      },
    };
  }
}
