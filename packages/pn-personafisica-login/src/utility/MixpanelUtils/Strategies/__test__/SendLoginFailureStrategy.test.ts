import { EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { SendLoginFailureStrategy } from '../SendLoginFailureStrategy';

describe('Mixpanel - Send Login Failure Strategy', () => {
  it('should return login failure event', () => {
    const strategy = new SendLoginFailureStrategy();
    const event = strategy.performComputations({
      reason: 'error',
      IDP: 'test',
    });

    expect(event).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.TECH,
        reason: 'error',
        IDP: 'test',
      },
    });
  });
});
