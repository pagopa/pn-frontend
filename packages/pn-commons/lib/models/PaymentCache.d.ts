import * as yup from 'yup';
import { PaymentDetails } from './NotificationDetail';
export declare const paymentCacheSchema: yup.SchemaOf<PaymentCache>;
export type PaymentCache = {
    iun: string;
    timestamp: string;
    currentPayment?: {
        noticeCode: string;
        creditorTaxId: string;
    };
    currentPaymentPage?: number;
    payments: Array<PaymentDetails>;
};
