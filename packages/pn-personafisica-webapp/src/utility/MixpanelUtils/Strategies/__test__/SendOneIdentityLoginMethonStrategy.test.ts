import { EventPropertyType } from '@pagopa-pn/pn-commons';

import { SendOneIdentityLoginMethodStrategy } from '../SendOneIdentityLoginMethonStrategy';

describe('Mixpanel - Send OneIdentity Login Method Strategy', () => {
  it('should return login method event', () => {
    const strategy = new SendOneIdentityLoginMethodStrategy();
    const event = strategy.performComputations({
      entityID: 'https://idp.uat.oneid.pagopa.it',
    });

    expect(event).toEqual({
      [EventPropertyType.PROFILE]: {
        SEND_LOGIN_METHOD: 'https://idp.uat.oneid.pagopa.it',
      },
    });
  });
});
