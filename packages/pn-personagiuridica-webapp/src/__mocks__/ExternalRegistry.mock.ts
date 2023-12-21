import {
  ExtRegistriesPaymentDetails,
  PaymentInfoDetail,
  PaymentStatus,
} from '@pagopa-pn/pn-commons';

import { Party } from '../models/party';

export const parties: Array<Party> = [
  { name: 'Comune di Milano', id: 'comune-milano' },
  { name: 'Tribunale di Milano', id: 'tribunale-milano' },
  { name: 'Comune di Palermo', id: 'comune-palermo' },
];

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
    amount: 1000,
    url: 'https://api.uat.platform.pagopa.it/checkout/auth/payments/v2',
    causaleVersamento: 'Seconda rata TARI',
    dueDate: '2025-08-05',
  },
  {
    creditorTaxId: '77777777777',
    noticeCode: '302011686772695134',
    status: PaymentStatus.REQUIRED,
    detail: PaymentInfoDetail.PAYMENT_UNAVAILABLE,
    detail_v2: 'PPT_PSP_SCONOSCIUTO',
    errorCode: 'PPT_AUTORIZZAZIONE',
    amount: 99.99,
    url: 'https://api.uat.platform.pagopa.it/checkout/auth/payments/v2',
    causaleVersamento: 'Terza rata TARI',
    dueDate: '2025-11-28',
  },
  {
    creditorTaxId: '77777777777',
    noticeCode: '302011686772695135',
    status: PaymentStatus.FAILED,
    detail: PaymentInfoDetail.PAYMENT_DUPLICATED,
    detail_v2: 'GENERIC_ERROR',
    errorCode: 'GENERIC_ERROR',
    url: 'https://api.uat.platform.pagopa.it/checkout/auth/payments/v2',
    causaleVersamento: 'Quarta rata TARI',
  },
  {
    creditorTaxId: '77777777777',
    noticeCode: '302011686772695136',
    status: PaymentStatus.FAILED,
    detail: PaymentInfoDetail.PAYMENT_EXPIRED,
    detail_v2: 'PAYMENT_EXPIRED',
    errorCode: 'PAYMENT_EXPIRED',
    url: 'https://api.uat.platform.pagopa.it/checkout/auth/payments/v2',
    causaleVersamento: 'Quinta rata TARI',
  },
  {
    creditorTaxId: '77777777777',
    noticeCode: '302011686772695137',
    status: PaymentStatus.REQUIRED,
    amount: 15000,
    url: 'https://api.uat.platform.pagopa.it/checkout/auth/payments/v2',
    causaleVersamento: 'Sesta rata TARI',
    dueDate: '2025-12-25',
  },
];
