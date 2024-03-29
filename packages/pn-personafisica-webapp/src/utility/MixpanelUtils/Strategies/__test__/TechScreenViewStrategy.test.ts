import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { TechScreenViewStrategy } from '../TechScreenViewStrategy';

describe('Mixpanel - Tech Screen View Strategy', () => {
  it('should return tech screen view event', () => {
    const strategy = new TechScreenViewStrategy();

    const techScreenViewEvent = strategy.performComputations();
    expect(techScreenViewEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.TECH,
        event_type: EventAction.SCREEN_VIEW,
      },
    });
  });
});
