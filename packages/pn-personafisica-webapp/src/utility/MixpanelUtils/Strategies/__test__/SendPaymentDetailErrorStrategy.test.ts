import { EventCategory, PaymentInfoDetail } from '@pagopa-pn/pn-commons';

import { SendPaymentDetailErrorStrategy } from '../SendPaymentDetailErrorStrategy';

describe('Mixpanel - Payment Detail Error Strategy', () => {
  it('should return payment detail error event', () => {
    const strategy = new SendPaymentDetailErrorStrategy();

    const paymentDetailErrorEvent = strategy.performComputations({
      detail: PaymentInfoDetail.PAYMENT_EXPIRED,
      errorCode: '500',
    });
    expect(paymentDetailErrorEvent).toEqual({
      event_category: EventCategory.KO,
      detail: PaymentInfoDetail.PAYMENT_EXPIRED,
      errorCode: '500',
    });
  });
});
