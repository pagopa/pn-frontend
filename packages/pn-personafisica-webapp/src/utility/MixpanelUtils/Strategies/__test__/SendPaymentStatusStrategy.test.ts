import {
  EventCategory,
  EventPropertyType,
  PaginationData,
  PaymentInfoDetail,
  PaymentStatus,
} from '@pagopa-pn/pn-commons';

import { paymentsData } from '../../../../__mocks__/NotificationDetail.mock';
import { SendPaymentStatusStrategy } from '../SendPaymentStatusStrategy';

describe('Mixpanel - Payment Status Strategy', () => {
  it('should return payment status event', () => {
    const paginationData: PaginationData = {
      page: 0,
      size: 5,
      totalElements: 1,
    };
    const paginatedPayments = paymentsData.pagoPaF24;

    const strategy = new SendPaymentStatusStrategy();

    const paymentStatusEvent = strategy.performComputations({
      paginationData,
      paginatedPayments,
    });
    expect(paymentStatusEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.TECH,
        page_number: paginationData.page,
        count_payment: paginatedPayments.length,
        count_canceled: paginatedPayments.filter(
          (f) =>
            f.pagoPa?.status === PaymentStatus.FAILED &&
            f.pagoPa.detail === PaymentInfoDetail.PAYMENT_CANCELED
        ).length,
        count_error: paginatedPayments.filter(
          (f) =>
            f.pagoPa?.status === PaymentStatus.FAILED &&
            f.pagoPa.detail !== PaymentInfoDetail.PAYMENT_CANCELED &&
            f.pagoPa.detail !== PaymentInfoDetail.PAYMENT_EXPIRED
        ).length,
        count_expired: paginatedPayments.filter(
          (f) =>
            f.pagoPa?.status === PaymentStatus.FAILED &&
            f.pagoPa.detail === PaymentInfoDetail.PAYMENT_EXPIRED
        ).length,
        count_paid: paginatedPayments.filter((f) => f.pagoPa?.status === PaymentStatus.SUCCEEDED)
          .length,
        count_unpaid: paginatedPayments.filter((f) => f.pagoPa?.status === PaymentStatus.REQUIRED)
          .length,
      },
    });
  });
});
