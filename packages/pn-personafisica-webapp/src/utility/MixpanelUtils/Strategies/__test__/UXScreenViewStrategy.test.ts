import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { UXScreenViewStrategy } from '../UXScreenViewStrategy';

describe('Mixpanel - UX Screen View Strategy', () => {
  it('should return UX screen view event', () => {
    const strategy = new UXScreenViewStrategy();

    const uxScreenViewEvent = strategy.performComputations();
    expect(uxScreenViewEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
      },
    });
  });
});
