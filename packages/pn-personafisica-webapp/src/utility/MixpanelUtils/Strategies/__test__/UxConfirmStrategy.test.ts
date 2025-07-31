import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { UXConfirmStrategy } from '../UxConfirmStrategy';

describe('Mixpanel - UX Confirm Strategy', () => {
  it('should return UX Confirm event', () => {
    const strategy = new UXConfirmStrategy();

    const uxConfirmEvent = strategy.performComputations();
    expect(uxConfirmEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.CONFIRM,
      },
    });
  });
});
