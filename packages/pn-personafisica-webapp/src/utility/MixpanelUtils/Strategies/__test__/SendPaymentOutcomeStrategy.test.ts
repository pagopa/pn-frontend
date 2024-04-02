import { EventCategory, EventPropertyType, PaymentStatus } from '@pagopa-pn/pn-commons';

import { SendPaymentOutcomeStrategy } from '../SendPaymentOutcomeStrategy';

describe('Mixpanel - Payment Outcome Strategy', () => {
  it('should return payment outcome event', () => {
    const strategy = new SendPaymentOutcomeStrategy();

    const outcome = PaymentStatus.REQUIRED;

    const paymentOutcomeEvent = strategy.performComputations({
      outcome,
    });
    expect(paymentOutcomeEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.TECH,
        outcome,
      },
    });
  });
});
