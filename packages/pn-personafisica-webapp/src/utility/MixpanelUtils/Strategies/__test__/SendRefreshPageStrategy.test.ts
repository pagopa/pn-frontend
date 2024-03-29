import {
  EventAction,
  EventCategory,
  EventPageType,
  EventPropertyType,
} from '@pagopa-pn/pn-commons';

import { SendRefreshPageStrategy } from '../SendRefreshPageStrategy';

describe('Mixpanel - Refresh Page Strategy', () => {
  it('should return refresh page event', () => {
    const strategy = new SendRefreshPageStrategy();

    const page = EventPageType.STATUS_PAGE;

    const refreshPageEvent = strategy.performComputations(page);
    expect(refreshPageEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        page,
      },
    });
  });
});
