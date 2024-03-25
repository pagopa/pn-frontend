import { EventAction, EventCategory } from '@pagopa-pn/pn-commons';

import { SendViewProfileStrategy } from '../SendViewProfileStrategy';

describe('Mixpanel - View Profile Strategy', () => {
  it('should return view profile event', () => {
    const strategy = new SendViewProfileStrategy();
    const source = 'user_menu';

    const viewProfileEvent = strategy.performComputations({ source });
    expect(viewProfileEvent).toEqual({
      event_category: EventCategory.UX,
      event_type: EventAction.ACTION,
      source,
    });
  });
});
