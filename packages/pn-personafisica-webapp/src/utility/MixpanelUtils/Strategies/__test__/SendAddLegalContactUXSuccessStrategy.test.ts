import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { SendAddLegalContactUXSuccessStrategy } from '../SendAddLegalContactUXSuccessStrategy';

describe('Mixpanel - Add legal contact ux success action Strategy', () => {
  it('should return add legal action event', () => {
    const strategy = new SendAddLegalContactUXSuccessStrategy();

    const isOtherContactEvent = strategy.performComputations('not-default');
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
