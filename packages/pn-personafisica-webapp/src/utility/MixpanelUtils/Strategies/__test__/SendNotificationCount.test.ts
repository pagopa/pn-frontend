import { EventPropertyType, TimelineCategory } from '@pagopa-pn/pn-commons';

import { timeline } from '../../../../__mocks__/NotificationDetail.mock';
import { SendNotificationCountStrategy } from '../SendNotificationCount';

describe('Mixpanel - Notification Count Strategy', () => {
  it('should return notification count event', () => {
    const strategy = new SendNotificationCountStrategy();

    const notificationCountEvent = strategy.performComputations({ timeline: timeline });
    if (timeline.findIndex((el) => el.category === TimelineCategory.NOTIFICATION_VIEWED) === -1) {
      expect(notificationCountEvent).toEqual({
        [EventPropertyType.INCREMENTAL]: false,
      });
    }
    expect(notificationCountEvent).toEqual({});
  });
});
