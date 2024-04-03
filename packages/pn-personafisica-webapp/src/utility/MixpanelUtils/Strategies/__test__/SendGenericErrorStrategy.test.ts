import { EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { SendGenericErrorStrategy } from '../SendGenericErrorStrategy';

describe('Mixpanel - Generic Error Strategy', () => {
  it('should return error', () => {
    const strategy = new SendGenericErrorStrategy();

    const reason = {
      error: {
        name: 'error',
        message: 'error',
      },
      errorInfo: {
        componentStack: 'componentStack',
      },
    };

    const genericErrorEvent = strategy.performComputations({
      reason,
    });
    expect(genericErrorEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.KO,
        reason,
      },
    });
  });
});
