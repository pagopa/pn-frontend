import {
  EventCategory,
  EventPropertyType,
  EventStrategy,
  PaginationData,
  PaymentDetails,
  PaymentInfoDetail,
  PaymentStatus,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

type SendPaymentStatus = {
  paginationData: PaginationData;
  paginatedPayments: Array<PaymentDetails>;
};

type SendPaymentStatusReturn = {
  page_number: number;
  count_payment: number;
  count_canceled: number;
  count_error: number;
  count_expired: number;
  count_paid: number;
  count_unpaid: number;
};

export class SendPaymentStatusStrategy implements EventStrategy {
  performComputations({
    paginationData,
    paginatedPayments,
  }: SendPaymentStatus): TrackedEvent<SendPaymentStatusReturn> {
    return {
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
    };
  }
}
