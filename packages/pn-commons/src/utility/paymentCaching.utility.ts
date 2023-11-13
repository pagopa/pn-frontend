import { PaymentsData } from '../models';

export const PAYMENT_CACHE_KEY = 'payments';

export type PaymentCache = {
  iun: string;
  timestamp: string;
  currentPayment?: {
    noticeCode: string;
    creditorTaxId: string;
  };
  currentPaymentPage?: number;
  paymentsPage: Array<PaymentsPage>;
};

export type PaymentsPage = {
  page: number;
  payments: PaymentsData;
};

export const getPaymentCache = (): PaymentCache | null => {
  const paymentCache = sessionStorage.getItem(PAYMENT_CACHE_KEY);
  return paymentCache ? (JSON.parse(paymentCache) as PaymentCache) : null;
};

export const getPaymentsFromCache = (): Array<PaymentsPage> | null => {
  const paymentCache = getPaymentCache();

  if (paymentCache?.paymentsPage) {
    return paymentCache.paymentsPage;
  }

  return null;
};

export const setPaymentCache = (updatedObj: Partial<PaymentCache>): void => {
  const paymentCache = getPaymentCache();

  const newPaymentCache = {
    ...paymentCache,
    ...updatedObj,
  } as PaymentCache;

  sessionStorage.setItem(PAYMENT_CACHE_KEY, JSON.stringify(newPaymentCache));
};

export const setPaymentsInCache = (payments: PaymentsData, page: number): void => {
  const paymentCache = getPaymentCache();

  if (paymentCache) {
    if (!paymentCache.paymentsPage) {
      // eslint-disable-next-line functional/immutable-data
      paymentCache.paymentsPage = [
        {
          page,
          payments,
        },
      ];
    } else {
      const paymentsPage = paymentCache.paymentsPage.find((p) => p.page === page);

      if (paymentsPage) {
        // eslint-disable-next-line functional/immutable-data
        paymentsPage.payments = payments;
      } else {
        // eslint-disable-next-line functional/immutable-data
        paymentCache.paymentsPage.push({
          page,
          payments,
        });
      }
    }

    sessionStorage.setItem(PAYMENT_CACHE_KEY, JSON.stringify(paymentCache));
  }
};

export const deletePropertiesInPaymentCache = (properties: Array<keyof PaymentCache>): void => {
  const paymentCache = getPaymentCache();

  if (paymentCache) {
    properties.forEach((property) => {
      // eslint-disable-next-line functional/immutable-data
      delete paymentCache[property];
    });

    sessionStorage.setItem(PAYMENT_CACHE_KEY, JSON.stringify(paymentCache));
  }
};

export const clearPaymentCache = (): void => {
  sessionStorage.removeItem(PAYMENT_CACHE_KEY);
};

// Timestamp is in ISO format
const isTimestampWithin5Minutes = (timestamp1: string, timestamp2: string): boolean => {
  const date1 = new Date(timestamp1);
  const date2 = new Date(timestamp2);

  if (date1.getTime() > date2.getTime()) {
    return false;
  }

  const diff = Math.abs(date1.getTime() - date2.getTime());
  const minutes = Math.floor(diff / 1000 / 60);

  return minutes <= 2;
};

// Check if IUN exists in cache, if exists check if timestamp is timestamp is 5 minute newer than the one in cache
// If these 2 conditions are true, return void
// If IUN not exists in cache or timestamp is older than 5 minutes, set IUN and timestamp in cache and return void
export const checkIunAndTimestamp = (iun: string, timestamp: string) => {
  const paymentCache = getPaymentCache();
  if (
    paymentCache &&
    paymentCache.iun === iun &&
    isTimestampWithin5Minutes(paymentCache.timestamp, timestamp)
  ) {
    return true;
  }

  clearPaymentCache();
  setPaymentCache({ iun, timestamp });
  return false;
};

export const checkIfPaymentsIsAlreadyInCache = (
  paymentsInfoRequest: Array<{ noticeCode: string; creditorTaxId: string }>
): boolean => {
  const payments = getPaymentsFromCache();
  if (!payments) {
    return false;
  }
  return paymentsInfoRequest.every((paymentInfo) =>
    payments.some((cachedPayments) =>
      cachedPayments.payments.pagoPaF24.some(
        (cachedPayment) =>
          cachedPayment.pagoPa?.noticeCode === paymentInfo.noticeCode &&
          cachedPayment.pagoPa?.creditorTaxId === paymentInfo.creditorTaxId
      )
    )
  );
};
