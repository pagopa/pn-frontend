import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { SendNotificationExpensesDetailStrategy } from '../SendNotificationExpensesDetailStrategy';
import { SendNotificationStatusDetailStrategy } from '../SendNotificationStatusDetail';
import { UxExternalLinkStrategy } from '../UxExternalLinkStrategy';

describe('Mixpanel - UX External Link Strategy', () => {
  it('should return UX external link event', () => {
    const strategy = new UxExternalLinkStrategy();

    const link = 'https://www.test.com';

    const uxExternalLinkEvent = strategy.performComputations({
      link,
    });

    expect(uxExternalLinkEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.EXIT,
        link,
      },
    });
  });
});
