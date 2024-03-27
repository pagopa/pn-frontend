import { EventPropertyType } from '@pagopa-pn/pn-commons';

import { SendPaymentsCountStrategy } from '../SendPaymentsCountStrategy';

describe('Mixpanel - Payments Count Strategy', () => {
  it('should return payment status event', () => {
    const strategy = new SendPaymentsCountStrategy();

    const paymentCountEvent = strategy.performComputations();
    expect(paymentCountEvent).toEqual({
      [EventPropertyType.INCREMENTAL]: {},
    });
  });
});
