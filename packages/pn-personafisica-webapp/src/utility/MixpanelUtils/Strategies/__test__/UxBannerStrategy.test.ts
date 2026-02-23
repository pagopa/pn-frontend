import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { UxBannerStrategy } from '../UxBannerStrategy';

describe('Mixpanel - UX Banner Strategy', () => {
  it('should return UX screen view event', () => {
    const strategy = new UxBannerStrategy();

    const uxBannerStrategy = strategy.performComputations({
      event_type: EventAction.SCREEN_VIEW,
      banner_id: 'test_banner',
      banner_page: 'test_page',
      banner_landing: 'test_landing',
    });
    expect(uxBannerStrategy).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
        banner_id: 'test_banner',
        banner_page: 'test_page',
        banner_landing: 'test_landing',
      },
    });
  });
});
