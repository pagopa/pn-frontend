import { AppRouteParams, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

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

  it('should return tech event with additional properties', () => {
    const strategy = new TechStrategy();

    const techEvent = strategy.performComputations({ source: AppRouteParams.AAR });
    expect(techEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.TECH,
        source: 'QRcode',
      },
    });
  });
});
