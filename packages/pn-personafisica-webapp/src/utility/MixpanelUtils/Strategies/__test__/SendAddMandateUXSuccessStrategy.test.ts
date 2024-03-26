import {
  EventAction,
  EventCategory,
  EventPropertyType,
  RecipientType,
} from '@pagopa-pn/pn-commons';

import { SendAddMandateUXSuccessStrategy } from '../SendAddMandateUXSuccessStrategy';

describe('Mixpanel - Add mandate UX success Strategy', () => {
  it('should return add mandate UX success event', () => {
    const person_type = RecipientType.PF;
    const mandate_type = 'all';
    const strategy = new SendAddMandateUXSuccessStrategy();

    const addMandateSuccessEvent = strategy.performComputations({
      person_type,
      mandate_type,
    });
    expect(addMandateSuccessEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
        person_type,
        mandate_type,
      },
    });
  });
});
