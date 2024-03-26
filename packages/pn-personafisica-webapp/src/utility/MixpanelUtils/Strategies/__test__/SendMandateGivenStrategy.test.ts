import { EventPropertyType } from '@pagopa-pn/pn-commons';

import { arrayOfDelegators } from '../../../../__mocks__/Delegations.mock';
import { DelegationStatus } from '../../../status.utility';
import { SendMandateGivenStrategy } from '../SendMandateGivenStrategy';

describe('Mixpanel - Mandate Given Strategy', () => {
  it('should return mandate given event', () => {
    const strategy = new SendMandateGivenStrategy();

    const mandateGiven = strategy.performComputations({ delegators: arrayOfDelegators });
    expect(mandateGiven).toEqual({
      [EventPropertyType.PROFILE]:
        arrayOfDelegators.filter((d) => d.status === DelegationStatus.ACTIVE).length > 0
          ? 'yes'
          : 'no',
    });
  });
});
