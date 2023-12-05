import _ from 'lodash';

import { PaymentCache, PaymentDetails, PaymentStatus } from '../models';
import { paymentCacheSchema } from '../models/PaymentCache';

export const PAYMENT_CACHE_KEY = 'payments';

export const getPaymentCache = (): PaymentCache | null => {
  const paymentCache = sessionStorage.getItem(PAYMENT_CACHE_KEY);
  if (!paymentCache) {
    return null;
  }

  paymentCacheSchema.validateSync(JSON.parse(paymentCache), {
    stripUnknown: false,
  });

  return paymentCache ? (JSON.parse(paymentCache) as PaymentCache) : null;
};

export const setPaymentCache = (updatedObj: Partial<PaymentCache>): void => {
  const paymentCache = getPaymentCache();

  const newPaymentCache = {
    ...paymentCache,
    ...updatedObj,
  } as PaymentCache;

  sessionStorage.setItem(PAYMENT_CACHE_KEY, JSON.stringify(newPaymentCache));
};

export const setPaymentsInCache = (payments: Array<PaymentDetails>): void => {
  const paymentCache = getPaymentCache()?.payments;

  if (paymentCache) {
    const newPaymentCache = _.uniqWith(
      [...payments, ...paymentCache],
      (a, b) =>
        a.pagoPa?.noticeCode === b.pagoPa?.noticeCode &&
        a.pagoPa?.creditorTaxId === b.pagoPa?.creditorTaxId
    );

    setPaymentCache({ payments: newPaymentCache });
  } else {
    setPaymentCache({ payments });
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
  setPaymentCache({ iun, timestamp, payments: [] });
  return false;
};

export const checkIfPaymentsIsAlreadyInCache = (
  paymentsInfoRequest: Array<{ noticeCode?: string; creditorTaxId?: string }>
): boolean => {
  const payments = getPaymentCache()?.payments;
  if (!payments) {
    return false;
  }

  // check if paymentsInfoRequest has length 1 and this payments status is === 'FAILED', if so return false
  if (
    paymentsInfoRequest.length === 1 &&
    paymentsInfoRequest[0].noticeCode &&
    paymentsInfoRequest[0].creditorTaxId &&
    payments.some(
      (cachedPayment) =>
        cachedPayment.pagoPa?.noticeCode === paymentsInfoRequest[0].noticeCode &&
        cachedPayment.pagoPa?.creditorTaxId === paymentsInfoRequest[0].creditorTaxId &&
        cachedPayment.pagoPa?.status === PaymentStatus.FAILED
    )
  ) {
    return false;
  }

  return paymentsInfoRequest.some((paymentInfo) =>
    payments.some(
      (cachedPayment) =>
        cachedPayment.pagoPa?.noticeCode === paymentInfo.noticeCode &&
        cachedPayment.pagoPa?.creditorTaxId === paymentInfo.creditorTaxId
    )
  );
};
