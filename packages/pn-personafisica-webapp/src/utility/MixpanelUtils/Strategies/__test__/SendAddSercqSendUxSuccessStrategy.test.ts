import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { SendAddSercqSendUxSuccessStrategy } from '../SendAddSercqSendUxSuccessStrategy';

describe('Mixpanel - Add Sercq SEND UX confirm success strategy', () => {
  it('should return add contact action event', () => {
    const strategy = new SendAddSercqSendUxSuccessStrategy();

    const isSpecialContactEvent = strategy.performComputations('not-default');
    expect(isSpecialContactEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.CONFIRM,
        other_contact: 'yes',
      },
    });

    const isDefaultContactEvent = strategy.performComputations('default');
    expect(isDefaultContactEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.CONFIRM,
        other_contact: 'no',
      },
    });
  });
});
