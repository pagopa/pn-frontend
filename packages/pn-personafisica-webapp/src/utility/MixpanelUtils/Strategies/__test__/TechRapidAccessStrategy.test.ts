import { AppRouteParams, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { TechRapidAccessStrategy } from '../TechRapidAccessStrategy';

describe('Mixpanel - Tech Rapid Access Strategy', () => {
  it('should return tech event with AAR source', () => {
    const strategy = new TechRapidAccessStrategy();

    const techEvent = strategy.performComputations({ source: AppRouteParams.AAR });
    expect(techEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.TECH,
        source: 'QRcode',
      },
    });
  });

  it('should return tech event with RetrievalId source', () => {
    const strategy = new TechRapidAccessStrategy();

    const techEvent = strategy.performComputations({ source: AppRouteParams.RETRIEVAL_ID });
    expect(techEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.TECH,
        source: '3Papp',
      },
    });
  });

  it('should return tech event with undefined source', () => {
    const strategy = new TechRapidAccessStrategy();

    const techEvent = strategy.performComputations({ source: undefined });
    expect(techEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.TECH,
        source: undefined,
      },
    });
  });
});
