import { EventAction, EventCategory } from '@pagopa-pn/pn-commons';

import { SendViewContactDetailsStrategy } from '../SendViewContactDetailsStrategy';

describe('Mixpanel - View Contact Details Strategy', () => {
  it('should return view contact details event', () => {
    const strategy = new SendViewContactDetailsStrategy();
    const source = 'home_notifiche';

    const viewContactDetailsEvent = strategy.performComputations({ source });
    expect(viewContactDetailsEvent).toEqual({
      event_category: EventCategory.UX,
      event_type: EventAction.ACTION,
      source,
    });
  });
});
