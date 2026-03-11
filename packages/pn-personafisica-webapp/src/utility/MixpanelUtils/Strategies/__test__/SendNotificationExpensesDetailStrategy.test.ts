import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { SendNotificationExpensesDetailStrategy } from '../SendNotificationExpensesDetailStrategy';
import { SendNotificationStatusDetailStrategy } from '../SendNotificationStatusDetail';

describe('Mixpanel - Send Notification Expenses Detail Strategy', () => {
  it('should return notification expenses detail event - Status display', () => {
    const strategy = new SendNotificationExpensesDetailStrategy();

    const status = 'display';

    const notificationExpensesDetailEventOk = strategy.performComputations({
      status,
    });
    expect(notificationExpensesDetailEventOk).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
        status,
      },
    });
  });

  it('should return notification expenses detail event - Status error', () => {
    const strategy = new SendNotificationExpensesDetailStrategy();

    const status = 'error';

    const notificationExpensesDetailEventOk = strategy.performComputations({
      status,
    });
    expect(notificationExpensesDetailEventOk).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
        status,
      },
    });
  });
});
