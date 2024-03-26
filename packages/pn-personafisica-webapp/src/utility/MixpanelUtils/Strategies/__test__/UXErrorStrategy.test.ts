import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { UXErrorStrategy } from '../UXErrorStrategy';

describe('Mixpanel - UX Error Strategy', () => {
  it('should return UX error event', () => {
    const strategy = new UXErrorStrategy();

    const uxErrorEvent = strategy.performComputations();
    expect(uxErrorEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ERROR,
      },
    });
  });
});
