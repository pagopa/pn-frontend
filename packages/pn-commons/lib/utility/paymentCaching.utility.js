import _ from 'lodash';
import { PaymentStatus } from '../models';
import { paymentCacheSchema } from '../models/PaymentCache';
export const PAYMENT_CACHE_KEY = 'payments';
export const getPaymentCache = (iun) => {
    const paymentCache = sessionStorage.getItem(PAYMENT_CACHE_KEY);
    if (!paymentCache) {
        return null;
    }
    const validCache = validateCache(paymentCache, iun);
    if (!validCache) {
        clearPaymentCache();
        return null;
    }
    return validCache;
};
const validateCache = (cache, iun) => {
    try {
        // parse object
        const paymentsCache = JSON.parse(cache);
        // validate object based on schema definition
        paymentCacheSchema.validateSync(JSON.parse(cache), {
            stripUnknown: false,
        });
        // check if iun requested is the same of the cached one
        checkIun(iun, paymentsCache.iun);
        // check if the cache is expired
        isTimestampWithin2Minutes(paymentsCache.timestamp, new Date().toISOString());
        // cache is valid, return
        return paymentsCache;
    }
    catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.warn(error);
        }
        return false;
    }
};
export const setPaymentCache = (updatedObj, iun) => {
    const paymentCache = getPaymentCache(iun);
    const newPaymentCache = {
        ...paymentCache,
        ...updatedObj,
    };
    sessionStorage.setItem(PAYMENT_CACHE_KEY, JSON.stringify(newPaymentCache));
};
export const setPaymentsInCache = (payments, iun) => {
    const paymentCache = getPaymentCache(iun);
    if (!paymentCache) {
        setPaymentCache({ iun, timestamp: new Date().toISOString(), payments }, iun);
    }
    if (paymentCache?.payments) {
        const newPaymentCache = _.uniqWith([...payments, ...paymentCache.payments], (a, b) => a.pagoPa?.noticeCode === b.pagoPa?.noticeCode &&
            a.pagoPa?.creditorTaxId === b.pagoPa?.creditorTaxId);
        if (paymentCache.currentPayment) {
            deletePropertiesInPaymentCache(['currentPayment'], paymentCache);
        }
        setPaymentCache({ payments: newPaymentCache }, iun);
    }
};
const deletePropertiesInPaymentCache = (properties, paymentCache) => {
    const cleanedPaymentCache = { ...paymentCache };
    properties.forEach((property) => {
        // eslint-disable-next-line functional/immutable-data
        delete cleanedPaymentCache[property];
    });
    sessionStorage.setItem(PAYMENT_CACHE_KEY, JSON.stringify(cleanedPaymentCache));
};
const clearPaymentCache = () => {
    sessionStorage.removeItem(PAYMENT_CACHE_KEY);
};
// Timestamp is in ISO format
const isTimestampWithin2Minutes = (timestamp1, timestamp2) => {
    const date1 = new Date(timestamp1);
    const date2 = new Date(timestamp2);
    if (date1.getTime() > date2.getTime()) {
        return false;
    }
    const diff = Math.abs(date1.getTime() - date2.getTime());
    const minutes = Math.floor(diff / 1000 / 60);
    if (minutes <= 2) {
        return true;
    }
    else {
        throw new Error('Timestamp is not valid');
    }
};
const checkIun = (iun, cachedIun) => {
    if (iun === cachedIun) {
        return true;
    }
    else {
        throw new Error('Iun is not valid');
    }
};
export const checkIfPaymentsIsAlreadyInCache = (paymentsInfoRequest, iun) => {
    const payments = getPaymentCache(iun)?.payments;
    if (!payments) {
        return false;
    }
    // check if paymentsInfoRequest has length 1 and this payments status is === 'FAILED', if so return false
    if (paymentsInfoRequest.length === 1 &&
        paymentsInfoRequest[0].noticeCode &&
        paymentsInfoRequest[0].creditorTaxId &&
        payments.some((cachedPayment) => cachedPayment.pagoPa?.noticeCode === paymentsInfoRequest[0].noticeCode &&
            cachedPayment.pagoPa?.creditorTaxId === paymentsInfoRequest[0].creditorTaxId &&
            cachedPayment.pagoPa?.status === PaymentStatus.FAILED)) {
        return false;
    }
    return paymentsInfoRequest.some((paymentInfo) => payments.some((cachedPayment) => cachedPayment.pagoPa?.noticeCode === paymentInfo.noticeCode &&
        cachedPayment.pagoPa?.creditorTaxId === paymentInfo.creditorTaxId));
};
