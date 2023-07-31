import {
  ExtRegistriesPaymentDetails,
  PaymentInfoDetail,
  PaymentStatus,
} from '@pagopa-pn/pn-commons';

export const EXTERNAL_REGISTRIES_MOCK: Array<ExtRegistriesPaymentDetails> = [
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
    creditorTaxId: 'string',
    noticeCode: 'string',
    status: PaymentStatus.REQUIRED,
    detail: PaymentInfoDetail.PAYMENT_UNAVAILABLE,
    detail_v2: 'PPT_PSP_SCONOSCIUTO',
    errorCode: 'PPT_AUTORIZZAZIONE',
    amount: 1200,
    url: 'https://api.uat.platform.pagopa.it/checkout/auth/payments/v2',
    causaleVersamento: 'Seconda rata TARI',
    dueDate: '2025-07-31',
  },
];
