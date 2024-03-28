import { EventPropertyType } from '@pagopa-pn/pn-commons';

import { SendAcceptDelegationStrategy } from '../SendAcceptDelegationStrategy';

describe('Mixpanel - Accept Delegation Strategy', () => {
  it('should return accept delegation event', () => {
    const strategy = new SendAcceptDelegationStrategy();
    const event = strategy.performComputations();

    expect(event).toEqual({
      [EventPropertyType.PROFILE]: {
        SEND_HAS_MANDATE: 'yes',
      },
    });
  });
});
