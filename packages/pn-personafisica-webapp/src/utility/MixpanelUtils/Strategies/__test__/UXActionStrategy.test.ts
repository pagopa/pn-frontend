import { EventAction, EventCategory } from '@pagopa-pn/pn-commons';

import { UXActionStrategy } from '../UXActionStrategy';

describe('Mixpanel - UX Action Strategy', () => {
  it('should return UX action event', () => {
    const strategy = new UXActionStrategy();

    const uxActionEvent = strategy.performComputations();
    expect(uxActionEvent).toEqual({
      event_category: EventCategory.UX,
      event_type: EventAction.ACTION,
    });
  });
});
