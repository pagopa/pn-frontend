import { EventPropertyType } from '@pagopa-pn/pn-commons';

import { digitalAddresses } from '../../../../__mocks__/Contacts.mock';
import { SendHasAddressesStrategy } from '../SendHasAddressesStrategy';

describe('Mixpanel - Has Addresses Strategy', () => {
  it('should return mandate given event', () => {
    const strategy = new SendHasAddressesStrategy();

    const hasPecEvent = strategy.performComputations(digitalAddresses);
    expect(hasPecEvent).toEqual({
      [EventPropertyType.PROFILE]: {
        SEND_APPIO_STATUS: 'deactivated',
        SEND_HAS_EMAIL: 'yes',
        SEND_HAS_PEC: 'yes',
        SEND_HAS_SMS: 'yes',
      },
    });
  });
  // TODO: implementare altri casi
});
