import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { SendNotificationSearchStrategy } from '../SendNotificationSearchStrategy';

describe('Mixpanel - Notification Search Strategy', () => {
  it('should return notification search event', () => {
    const strategy = new SendNotificationSearchStrategy();
    const notificationSearchData = {
      delegate: false,
      filter: 'iun-date',
    };
    const notificationSearchEvent = strategy.performComputations(notificationSearchData);

    expect(notificationSearchEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        delegate: notificationSearchData.delegate,
        filter: notificationSearchData.filter,
      },
    });
  });
});
