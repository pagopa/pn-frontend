import { EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { TechStrategy } from '../TechStrategy';

describe('Mixpanel - Tech Strategy', () => {
  it('should return tech event', () => {
    const strategy = new TechStrategy();

    const techEvent = strategy.performComputations();
    expect(techEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.TECH,
      },
    });
  });
});
