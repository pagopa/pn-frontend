import { EventAction, EventCategory, EventPageType } from '@pagopa-pn/pn-commons';

import { SendRefreshPageStrategy } from '../SendRefreshPageStrategy';

describe('Mixpanel - Refresh Page Strategy', () => {
  it('should return refresh page event', () => {
    const strategy = new SendRefreshPageStrategy();

    const page = EventPageType.STATUS_PAGE;

    const refreshPageEvent = strategy.performComputations(page);
    expect(refreshPageEvent).toEqual({
      event_category: EventCategory.UX,
      event_type: EventAction.ACTION,
      page,
    });
  });
});
