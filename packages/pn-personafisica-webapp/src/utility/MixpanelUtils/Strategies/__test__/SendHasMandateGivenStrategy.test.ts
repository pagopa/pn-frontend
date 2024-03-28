import { EventPropertyType } from '@pagopa-pn/pn-commons';

import { arrayOfDelegators } from '../../../../__mocks__/Delegations.mock';
import { DelegationStatus } from '../../../status.utility';
import { SendHasMandateGivenStrategy } from '../SendHasMandateGivensStrategy';

describe('Mixpanel - Has Mandate Given Strategy', () => {
  it('should return has mandate given event', () => {
    const strategy = new SendHasMandateGivenStrategy();

    const mandateGiven = strategy.performComputations({ payload: arrayOfDelegators });
    expect(mandateGiven).toEqual({
      [EventPropertyType.PROFILE]: {
        SEND_MANDATE_GIVEN:
          arrayOfDelegators.filter((d) => d.status === DelegationStatus.ACTIVE).length > 0
            ? 'yes'
            : 'no',
      },
    });
  });
});
