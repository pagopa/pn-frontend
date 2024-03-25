import { EventCategory } from '@pagopa-pn/pn-commons';

import { SendPaymentStatusStrategy } from '../SendPaymentStatusStrategy';

describe('Mixpanel - Payment Status Strategy', () => {
  it('should return payment status event', () => {
    const strategy = new SendPaymentStatusStrategy();

    const paymentStatusEvent = strategy.performComputations({
      param: {
        payment_count: 1,
      },
    });
    expect(paymentStatusEvent).toEqual({
      event_category: EventCategory.TECH,
      param: {
        payment_count: 1,
      },
    });
  });
});
