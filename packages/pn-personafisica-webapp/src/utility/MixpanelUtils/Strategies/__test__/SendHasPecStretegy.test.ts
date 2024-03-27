import { EventPropertyType } from '@pagopa-pn/pn-commons';

import { digitalAddresses } from '../../../../__mocks__/Contacts.mock';
import { arrayOfDelegators } from '../../../../__mocks__/Delegations.mock';
import { DelegationStatus } from '../../../status.utility';
import { SendHasPecStrategy } from '../SendHasAddressesStrategy';

describe('Mixpanel - Has Pec Strategy', () => {
  it('should return mandate given event', () => {
    const strategy = new SendHasPecStrategy();

    const hasPecEvent = strategy.performComputations({ legalAddresses: digitalAddresses.legal });
    expect(hasPecEvent).toEqual({
      [EventPropertyType.PROFILE]:
        arrayOfDelegators.filter((d) => d.status === DelegationStatus.ACTIVE).length > 0
          ? 'yes'
          : 'no',
    });
  });
});
