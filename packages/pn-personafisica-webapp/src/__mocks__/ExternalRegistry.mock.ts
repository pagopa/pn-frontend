import {
  ExtRegistriesPaymentDetails,
  PaymentInfoDetail,
  PaymentStatus,
} from '@pagopa-pn/pn-commons';

export const paymentInfo: Array<ExtRegistriesPaymentDetails> = [
  {
    creditorTaxId: '77777777777',
    noticeCode: '302011686772695132',
    status: PaymentStatus.SUCCEEDED,
    url: 'https://api.uat.platform.pagopa.it/checkout/auth/payments/v2',
    causaleVersamento: 'Prima rata TARI',
    dueDate: '2025-07-31',
  },
  {
    creditorTaxId: '77777777777',
    noticeCode: '302011686772695133',
    status: PaymentStatus.REQUIRED,
    amount: 1000,
    url: 'https://api.uat.platform.pagopa.it/checkout/auth/payments/v2',
    causaleVersamento: 'Seconda rata TARI',
    dueDate: '2025-08-05',
  },
  {
    creditorTaxId: '77777777777',
    noticeCode: '302011686772695134',
    status: PaymentStatus.FAILED,
    detail: PaymentInfoDetail.PAYMENT_CANCELED,
    detail_v2: 'GENERIC_ERROR',
    errorCode: 'PAYMENT_CANCELED',
    amount: 99.99,
    url: 'https://api.uat.platform.pagopa.it/checkout/auth/payments/v2',
    causaleVersamento: 'Terza rata TARI',
    dueDate: '2025-11-28',
  },
  {
    creditorTaxId: '77777777777',
    noticeCode: '302011686772695135',
    status: PaymentStatus.FAILED,
    detail: PaymentInfoDetail.GENERIC_ERROR,
    detail_v2: 'GENERIC_ERROR',
    errorCode: 'GENERIC_ERROR',
    amount: 99.99,
    url: 'https://api.uat.platform.pagopa.it/checkout/auth/payments/v2',
    causaleVersamento: 'Terza rata TARI',
    dueDate: '2025-11-28',
  },
];
