import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { SendAddSercqSendUxSuccessStrategy } from '../SendAddSercqSendUxSuccessStrategy';

describe('Mixpanel - Add Sercq SEND UX confirm success strategy', () => {
  it('should return add contact action event', () => {
    const strategy = new SendAddSercqSendUxSuccessStrategy();

    const isSpecialContactEvent = strategy.performComputations(true);
    expect(isSpecialContactEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.CONFIRM,
        other_contact: 'no',
      },
      [EventPropertyType.PROFILE]: {
        SEND_HAS_PEC: 'no'
      },
      [EventPropertyType.SUPER_PROPERTY]: {
        SEND_HAS_PEC: 'no',
      }
    });

    const isDefaultContactEvent = strategy.performComputations(false);
    expect(isDefaultContactEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.CONFIRM,
        other_contact: 'no',
      },
    });
  });
});
