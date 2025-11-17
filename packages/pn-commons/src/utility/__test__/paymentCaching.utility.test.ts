import { cachedPayments, paymentsData } from '../../__mocks__/NotificationDetail.mock';
import { PaymentDetails, PaymentStatus } from '../../models/NotificationDetail';
import {
  PAYMENT_CACHE_KEY,
  checkIfPaymentsIsAlreadyInCache,
  getPaymentCache,
  setPaymentCache,
  setPaymentsInCache,
} from '../paymentCaching.utility';

describe('Payment caching utility', () => {
  beforeEach(() => {
    sessionStorage.setItem('payments', JSON.stringify(cachedPayments));
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  const iun = cachedPayments.iun;

  it('should return the correct payment item', () => {
    const paymentCache = getPaymentCache(iun);
    expect(paymentCache).toEqual(cachedPayments);
  });

  it('setPaymentCache should update the item in sessionStorage', () => {
    const newPaymentCache = {
      ...cachedPayments,
      currentPaymentPage: 1,
      currentPayment: {
        noticeCode: '123456789',
        creditorTaxId: '123456789',
      },
    };
    setPaymentCache(newPaymentCache, iun);
    const paymentCache = getPaymentCache(iun);
    expect(paymentCache).toEqual(newPaymentCache);
  });

  it('setPaymentsInCache should set payments cache if no data is already stored', () => {
    sessionStorage.clear();
    setPaymentsInCache(cachedPayments.payments, iun);
    const paymentCache = getPaymentCache(iun);
    expect(paymentCache?.payments).toEqual(cachedPayments.payments);
    expect(paymentCache?.iun).toEqual(cachedPayments.iun);
    expect(paymentCache?.currentPayment).toBeUndefined();
    expect(paymentCache?.currentPaymentPage).toBeUndefined();
  });

  it('setPaymentsInCache should update payments cache if data is already stored', () => {
    let paymentCache = getPaymentCache(iun);
    expect(paymentCache?.payments).toEqual(cachedPayments.payments);
    // set new payments
    // we take the old payments and we add a new payment
    // the new payment will be the first payment with noticeCode e creditorTaxId reversed
    const newPayments = [
      ...cachedPayments.payments,
      {
        pagoPa: {
          ...cachedPayments.payments[0].pagoPa,
          creditorTaxId: cachedPayments.payments[0].pagoPa?.creditorTaxId
            .split('')
            .reverse()
            .join(''),
          noticeCode: cachedPayments.payments[0].pagoPa?.noticeCode.split('').reverse().join(''),
        },
        f24: cachedPayments.payments[0].f24,
      },
    ] as Array<PaymentDetails>;
    setPaymentsInCache(newPayments, iun);
    // get payments from cache
    paymentCache = getPaymentCache(iun);
    // we expect that the payments stored in the cache have only one payment added and no duplication
    expect(paymentCache?.payments).toEqual(newPayments);
  });

  it('setPaymentsInCache should delete currentPayment property in the payment cache', () => {
    const newPaymentCache = {
      ...cachedPayments,
      currentPayment: {
        noticeCode: '123456789',
        creditorTaxId: '123456789',
      },
    };
    setPaymentCache(newPaymentCache, iun);
    let paymentCache = getPaymentCache(iun);
    expect(paymentCache?.currentPayment).toEqual(newPaymentCache.currentPayment);
    // set new payments
    setPaymentsInCache(cachedPayments.payments, iun);
    paymentCache = getPaymentCache(iun);
    expect(paymentCache?.currentPayment).toBeUndefined();
  });

  it('checkIfPaymentsIsAlreadyInCache should return true if payments is already in cache', () => {
    const paymentInfoRequest = paymentsData.pagoPaF24.map((payment) => ({
      noticeCode: payment.pagoPa?.noticeCode,
      creditorTaxId: payment.pagoPa?.creditorTaxId,
    }));

    const result = checkIfPaymentsIsAlreadyInCache(paymentInfoRequest, iun);

    expect(result).toEqual(true);
  });

  it('checkIfPaymentsIsAlreadyInCache should return false if payments is not in cache', () => {
    const paymentInfoRequest = [
      {
        noticeCode: '123456789',
        creditorTaxId: '123456789',
      },
    ];
    const result = checkIfPaymentsIsAlreadyInCache(paymentInfoRequest, iun);
    expect(result).toEqual(false);
  });

  it('checkIfPaymentsIsAlreadyInCache should return false if the paymentInfoRequest has one element and this payment has status FAILED', () => {
    const paymentFailed = {
      ...cachedPayments,
      payments: [
        ...cachedPayments.payments,
        {
          pagoPa: { ...cachedPayments.payments[0].pagoPa, status: PaymentStatus.FAILED },
          f24: cachedPayments.payments[0].f24,
        },
      ] as Array<PaymentDetails>,
    };
    setPaymentCache(paymentFailed, iun);
    const paymentInfoRequest = [
      {
        noticeCode: paymentFailed.payments[0].pagoPa?.noticeCode,
        creditorTaxId: paymentFailed.payments[0].pagoPa?.creditorTaxId,
      },
    ];
    const result = checkIfPaymentsIsAlreadyInCache(paymentInfoRequest, iun);
    expect(result).toEqual(false);
  });

  it('should return null if the json is invalid', () => {
    sessionStorage.setItem('payments', 'invalidJson');
    const paymentCache = getPaymentCache(iun);
    expect(paymentCache).toBeNull();
    expect(sessionStorage.getItem(PAYMENT_CACHE_KEY)).toBeNull();
  });

  it("should return null if the payment cache doesn't pass the schema check", () => {
    const invalidCache = {
      ...cachedPayments,
      unexpectedProperty: 'unexpectedProperty',
    };
    setPaymentCache(invalidCache, iun);
    const paymentCache = getPaymentCache(iun);
    expect(paymentCache).toBeNull();
    expect(sessionStorage.getItem(PAYMENT_CACHE_KEY)).toBeNull();
  });

  it('should return null if the payment cache has different iun from requested one', () => {
    const paymentCache = getPaymentCache('WRONG-IUN');
    expect(paymentCache).toBeNull();
    expect(sessionStorage.getItem(PAYMENT_CACHE_KEY)).toBeNull();
  });

  it('should return null if 2 minutes has passed', () => {
    const invalidCache = {
      ...cachedPayments,
      timestamp: new Date('1/1/1990').toISOString(),
    };
    setPaymentCache(invalidCache, iun);
    const paymentCache = getPaymentCache(iun);
    expect(paymentCache).toBeNull();
    expect(sessionStorage.getItem(PAYMENT_CACHE_KEY)).toBeNull();
  });
});
