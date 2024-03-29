import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { SendAddContactScreenViewStrategy } from '../SendAddContactScreenViewStrategy';

describe('Mixpanel - Add contact screen view Strategy', () => {
  it('should return add contact screen view event', () => {
    const strategy = new SendAddContactScreenViewStrategy();

    const isOtherContactEvent = strategy.performComputations(true);
    expect(isOtherContactEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
        other_contact: 'yes',
      },
    });

    const isNotOtherContactEvent = strategy.performComputations(false);
    expect(isNotOtherContactEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
        other_contact: 'no',
      },
    });
  });
});
