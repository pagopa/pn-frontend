import { PaymentsData } from './NotificationDetail';

export type PaymentCache = {
  iun: string;
  timestamp: string;
  currentPayment?: {
    noticeCode: string;
    creditorTaxId: string;
  };
  currentPaymentPage?: number;
  paymentsPage: Array<PaymentsCachePage>;
};

export type PaymentsCachePage = {
  page: number;
  payments: PaymentsData;
};
