import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { UXPspActionStrategy } from '../UXPspActionStrategy';

describe('Mixpanel - UX PSP Action Strategy', () => {
  it('should return UX PSP action event', () => {
    const strategy = new UXPspActionStrategy();

    const uxPspActionEvent = strategy.performComputations({ psp: 'pagopa' });
    expect(uxPspActionEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        psp: 'pagopa',
      },
    });
  });
});
