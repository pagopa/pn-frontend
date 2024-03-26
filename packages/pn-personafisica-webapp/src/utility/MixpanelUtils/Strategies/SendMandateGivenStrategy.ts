import { EventPropertyType, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

import { Delegation } from '../../../redux/delegation/types';
import { DelegationStatus } from '../../status.utility';

type SendMandateGiven = {
  delegators: Array<Delegation>;
};

export class SendMandateGivenStrategy implements EventStrategy {
  performComputations({ delegators }: SendMandateGiven): TrackedEvent {
    return {
      [EventPropertyType.PROFILE]:
        delegators.filter((d) => d.status === DelegationStatus.ACTIVE).length > 0 ? 'yes' : 'no',
    };
  }
}
