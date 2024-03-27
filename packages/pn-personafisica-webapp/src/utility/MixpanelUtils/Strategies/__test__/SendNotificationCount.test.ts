import { EventPropertyType, TimelineCategory } from '@pagopa-pn/pn-commons';

import { timeline } from '../../../../__mocks__/NotificationDetail.mock';
import { SendNotificationCountStrategy } from '../SendNotificationCount';

describe('Mixpanel - Notification Count Strategy', () => {
  it('should return notification count event - viewed event', () => {
    const strategy = new SendNotificationCountStrategy();

    const notificationCountEvent = strategy.performComputations({ timeline: timeline });
    expect(notificationCountEvent).toEqual({});
  });

  it('should return notification count event - no viewed event', () => {
    const strategy = new SendNotificationCountStrategy();
    const noViewedTimeline = timeline.filter(
      (el) => el.category !== TimelineCategory.NOTIFICATION_VIEWED
    );
    const notificationCountEvent = strategy.performComputations({ timeline: noViewedTimeline });
    expect(notificationCountEvent).toEqual({
      [EventPropertyType.INCREMENTAL]: {},
    });
  });
});
