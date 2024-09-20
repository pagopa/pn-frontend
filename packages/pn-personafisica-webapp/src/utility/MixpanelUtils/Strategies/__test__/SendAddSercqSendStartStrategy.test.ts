import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { ContactSource } from '../../../../models/contacts';
import { SendAddContactWithSourceActionStrategy } from '../SendAddContactWithSourceActionStrategy';

describe('Mixpanel - Add Sercq SEND start strategy', () => {
  it('should return add sercq send start ', () => {
    const strategy = new SendAddContactWithSourceActionStrategy();

    const isSpecialContactEvent = strategy.performComputations({
      senderId: 'not-default',
      source: ContactSource.RECAPITI,
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
      source: ContactSource.RECAPITI,
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
