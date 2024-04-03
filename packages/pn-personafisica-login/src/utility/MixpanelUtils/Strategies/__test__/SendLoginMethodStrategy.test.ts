import { EventPropertyType } from '@pagopa-pn/pn-commons';

import { SendLoginMethodStrategy } from '../SendLoginMethodStrategy';

describe('Mixpanel - Send Login Method Strategy', () => {
  it('should return login method event', () => {
    const strategy = new SendLoginMethodStrategy();
    const event = strategy.performComputations({
      entityID: 'cie',
    });

    expect(event).toEqual({
      [EventPropertyType.PROFILE]: {
        SEND_LOGIN_METHOD: 'cie',
      },
    });
  });
});
