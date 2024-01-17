import { PaymentDetails } from '../models';
import { PaymentCache } from '../models/PaymentCache';
export declare const PAYMENT_CACHE_KEY = "payments";
export declare const getPaymentCache: (iun: string) => PaymentCache | null;
export declare const setPaymentCache: (updatedObj: Partial<PaymentCache>, iun: string) => void;
export declare const setPaymentsInCache: (payments: Array<PaymentDetails>, iun: string) => void;
export declare const checkIfPaymentsIsAlreadyInCache: (paymentsInfoRequest: Array<{
    noticeCode?: string;
    creditorTaxId?: string;
}>, iun: string) => boolean;
