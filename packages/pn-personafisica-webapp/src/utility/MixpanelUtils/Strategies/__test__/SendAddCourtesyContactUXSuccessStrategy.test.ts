import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { SendAddCourtesyContactUXSuccessStrategy } from '../SendAddCourtesyContactUXSuccessStrategy';

describe('Mixpanel - Add courtesy contact ux success action Strategy', () => {
  it('should return add contact action event', () => {
    const strategy = new SendAddCourtesyContactUXSuccessStrategy();

    const isOtherContactEvent = strategy.performComputations({
      senderId: 'not-default',
      fromSercqSend: false,
    });
    expect(isOtherContactEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        other_contact: 'yes',
        from_sercq_send: 'no',
      },
    });

    const isNotOtherContactEvent = strategy.performComputations({
      senderId: 'default',
      fromSercqSend: true,
    });
    expect(isNotOtherContactEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        other_contact: 'no',
        from_sercq_send: 'yes',
      },
    });
  });
});
