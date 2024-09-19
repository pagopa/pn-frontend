import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { SendAddSercqSendStartActionStrategy } from '../SendAddSercqSendStartStrategy';

describe('Mixpanel - Add Sercq SEND start strategy', () => {
  it('should return add sercq send start ', () => {
    const strategy = new SendAddSercqSendStartActionStrategy();

    const isSpecialContactEvent = strategy.performComputations({
      senderId: 'not-default',
      source: 'recapiti',
    });
    expect(isSpecialContactEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        other_contact: 'yes',
        source: 'recapiti',
      },
    });

    const isDefaultContactEvent = strategy.performComputations({
      senderId: 'default',
      source: 'recapiti',
    });
    expect(isDefaultContactEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        other_contact: 'no',
        source: 'recapiti',
      },
    });
  });
});
