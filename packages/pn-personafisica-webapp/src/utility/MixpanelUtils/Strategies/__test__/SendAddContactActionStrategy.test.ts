import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { SendAddContactActionStrategy } from '../SendAddContactActionStrategy';

describe('Mixpanel - Add contact action Strategy', () => {
  it('should return add contact action event', () => {
    const strategy = new SendAddContactActionStrategy();

    const isOtherContactEvent = strategy.performComputations('1233456');
    expect(isOtherContactEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        other_contact: 'yes',
      },
    });

    const isNotOtherContactEvent = strategy.performComputations('default');
    expect(isNotOtherContactEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        other_contact: 'no',
      },
    });
  });
});
