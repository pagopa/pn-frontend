import { PaymentCache, PaymentStatus, PaymentsCachePage, PaymentsData } from '../models';

export const PAYMENT_CACHE_KEY = 'payments';

export const getPaymentCache = (): PaymentCache | null => {
  const paymentCache = sessionStorage.getItem(PAYMENT_CACHE_KEY);
  return paymentCache ? (JSON.parse(paymentCache) as PaymentCache) : null;
};

export const getPaymentsFromCache = (): Array<PaymentsCachePage> | null => {
  const paymentCache = getPaymentCache();

  if (paymentCache?.paymentsPage) {
    // eslint-disable-next-line functional/immutable-data
    return paymentCache.paymentsPage.sort((a, b) => a.page - b.page);
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
  const paymentCache = getPaymentsFromCache();

  if (paymentCache) {
    const newPaymentCache = [...paymentCache];

    const paymentsPage = newPaymentCache.find((p) => p.page === page);

    if (paymentsPage) {
      // eslint-disable-next-line functional/immutable-data
      paymentsPage.payments = {
        ...paymentsPage.payments,
        pagoPaF24: [...paymentsPage.payments.pagoPaF24, ...payments.pagoPaF24],
      };
    } else {
      // eslint-disable-next-line functional/immutable-data
      newPaymentCache.push({ page, payments });
    }

    setPaymentCache({ paymentsPage: newPaymentCache });
  } else {
    setPaymentCache({ paymentsPage: [{ page, payments }] });
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
export const isTimestampWithin2Minutes = (timestamp1: string, timestamp2: string): boolean => {
  const date1 = new Date(timestamp1);
  const date2 = new Date(timestamp2);

  if (date1.getTime() > date2.getTime()) {
    return false;
  }

  const diff = Math.abs(date1.getTime() - date2.getTime());
  const minutes = Math.floor(diff / 1000 / 60);

  return minutes <= 2;
};

export const checkIunAndTimestamp = (iun: string, timestamp: string) => {
  const paymentCache = getPaymentCache();
  if (
    paymentCache &&
    paymentCache.iun === iun &&
    isTimestampWithin2Minutes(paymentCache.timestamp, timestamp)
  ) {
    return true;
  }

  clearPaymentCache();
  setPaymentCache({ iun, timestamp });
  return false;
};

export const checkIfPaymentsIsAlreadyInCache = (
  paymentsInfoRequest: Array<{ noticeCode?: string; creditorTaxId?: string }>
): boolean => {
  const payments = getPaymentsFromCache();
  if (!payments) {
    return false;
  }

  // check if paymentsInfoRequest has length 1 and this payments status is === 'FAILED', if so return false
  if (
    paymentsInfoRequest.length === 1 &&
    paymentsInfoRequest[0].noticeCode &&
    paymentsInfoRequest[0].creditorTaxId &&
    payments.some((cachedPayments) =>
      cachedPayments.payments.pagoPaF24.some(
        (cachedPayment) =>
          cachedPayment.pagoPa?.noticeCode === paymentsInfoRequest[0].noticeCode &&
          cachedPayment.pagoPa?.creditorTaxId === paymentsInfoRequest[0].creditorTaxId &&
          cachedPayment.pagoPa?.status === PaymentStatus.FAILED
      )
    )
  ) {
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
