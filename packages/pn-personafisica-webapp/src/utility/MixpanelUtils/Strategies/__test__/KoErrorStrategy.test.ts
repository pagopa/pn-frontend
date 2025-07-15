import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { KoErrorStrategy } from '../KoErrorStrategy';

describe('Mixpanel - KO Error Strategy', () => {
  it('should return KO error event', () => {
    const strategy = new KoErrorStrategy();

    const koErrorEvent = strategy.performComputations();
    expect(koErrorEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.KO,
        event_type: EventAction.ERROR,
      },
    });
  });
});
