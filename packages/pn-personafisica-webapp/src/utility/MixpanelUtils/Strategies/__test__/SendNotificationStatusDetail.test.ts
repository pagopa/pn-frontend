import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { SendNotificationStatusDetailStrategy } from '../SendNotificationStatusDetail';

describe('Mixpanel - Notification Status Detail Strategy', () => {
  it('should return notification status detail event', () => {
    const strategy = new SendNotificationStatusDetailStrategy();

    const accordion = 'collapse';

    const notificationStatusDetailEvent = strategy.performComputations({
      accordion,
    });
    expect(notificationStatusDetailEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        accordion,
      },
    });
  });
});
