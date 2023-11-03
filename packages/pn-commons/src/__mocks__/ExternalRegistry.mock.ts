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
    amount: 1200,
    url: 'https://api.uat.platform.pagopa.it/checkout/auth/payments/v2',
    causaleVersamento: 'Prima rata TARI',
    dueDate: '2025-07-31',
  },
  {
    creditorTaxId: '77777777777',
    noticeCode: '302011686772695133',
    status: PaymentStatus.REQUIRED,
    detail: PaymentInfoDetail.PAYMENT_UNAVAILABLE,
    detail_v2: 'PPT_PSP_SCONOSCIUTO',
    errorCode: 'PPT_AUTORIZZAZIONE',
    amount: 1000,
    url: 'https://api.uat.platform.pagopa.it/checkout/auth/payments/v2',
    causaleVersamento: 'Seconda rata TARI',
    dueDate: '2025-08-05',
  },
  {
    creditorTaxId: '77777777777',
    noticeCode: '302011686772695134',
    status: PaymentStatus.REQUIRED,
    amount: 15000,
    url: 'https://api.uat.platform.pagopa.it/checkout/auth/payments/v2',
    causaleVersamento: 'Terza rata TARI',
    dueDate: '2025-09-30',
  },
  {
    creditorTaxId: '77777777777',
    noticeCode: '302011686772695135',
    status: PaymentStatus.REQUIRED,
    amount: 18000,
    url: 'https://api.uat.platform.pagopa.it/checkout/auth/payments/v2',
    causaleVersamento: 'Quarta rata TARI',
    dueDate: '2025-10-29',
  },
  {
    creditorTaxId: '77777777777',
    noticeCode: '302011686772695136',
    status: PaymentStatus.FAILED,
    detail: PaymentInfoDetail.PAYMENT_UNAVAILABLE,
    detail_v2: 'PPT_PSP_SCONOSCIUTO',
    errorCode: 'PPT_AUTORIZZAZIONE',
    amount: 19000,
    url: 'https://api.uat.platform.pagopa.it/checkout/auth/payments/v2',
    causaleVersamento: 'Quinta rata TARI',
    dueDate: '2025-11-30',
  },
  {
    creditorTaxId: '77777777777',
    noticeCode: '302011686772695137',
    status: PaymentStatus.REQUIRED,
    amount: 18000,
    url: 'https://api.uat.platform.pagopa.it/checkout/auth/payments/v2',
    causaleVersamento: 'Sesta rata TARI',
    dueDate: '2025-12-25',
  },
];
