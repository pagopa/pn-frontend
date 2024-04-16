import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { SendViewContactDetailsStrategy } from '../SendViewContactDetailsStrategy';

describe('Mixpanel - View Contact Details Strategy', () => {
  it('should return view contact details event', () => {
    const strategy = new SendViewContactDetailsStrategy();
    const source = 'home_notifiche';

    const viewContactDetailsEvent = strategy.performComputations({ source });
    expect(viewContactDetailsEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        source,
      },
    });
  });
});
