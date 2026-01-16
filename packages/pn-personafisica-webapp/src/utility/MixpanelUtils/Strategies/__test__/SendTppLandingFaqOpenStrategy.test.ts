import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { SendTppLandingFaqOpenStrategy } from '../SendTppLandingFaqOpenStrategy';

describe('Mixpanel - Tpp Landing page FAQ open Strategy', () => {
  it('should return TPP landing page FAQ open event', () => {
    const strategy = new SendTppLandingFaqOpenStrategy();

    const toastErrorEvent = strategy.performComputations({ faq_name: 'FAQ di esempio' });
    expect(toastErrorEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        faq_name: 'FAQ di esempio',
      },
    });
  });
});
