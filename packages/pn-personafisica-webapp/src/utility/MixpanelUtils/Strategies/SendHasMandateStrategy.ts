import { EventPropertyType, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

import { Delegate } from '../../../redux/delegation/types';
import { DelegationStatus } from '../../status.utility';

type SendHasMandate = {
  delegates: Array<Delegate>;
};

export class SendHasMandateStrategy implements EventStrategy {
  performComputations({ delegates }: SendHasMandate): TrackedEvent {
    return {
      [EventPropertyType.PROFILE]:
        delegates.filter((d) => d.status === DelegationStatus.ACTIVE).length > 0 ? 'yes' : 'no',
    };
  }
}
