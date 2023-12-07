import { cachedPayments, paymentsData } from '../../__mocks__/NotificationDetail.mock';
import { PaymentDetails, PaymentStatus, RecipientType } from '../../models';
import {
  checkIfPaymentsIsAlreadyInCache,
  checkIun,
  clearPaymentCache,
  deletePropertiesInPaymentCache,
  getPaymentCache,
  isTimestampWithin2Minutes,
  setPaymentCache,
  setPaymentsInCache,
} from '../paymentCaching.utility';

describe('Payment caching utility', () => {
  beforeEach(() => {
    sessionStorage.setItem('payments', JSON.stringify(cachedPayments));
    // TODO avoid console.warn
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
    const oldPaymentCache = {
      ...cachedPayments,
      currentPaymentPage: 1,
    };
    setPaymentCache(oldPaymentCache, iun);

    const newPaymentItem = {
      ...cachedPayments,
      currentPaymentPage: 2,
    };
    setPaymentCache(newPaymentItem, iun);
    const paymentCache = getPaymentCache(iun);
    expect(paymentCache).toEqual(newPaymentItem);
  });

  it('should set a new elements in the paymentsPage array', () => {
    const newPaymentItem = {
      ...cachedPayments,
      currentPayment: {
        noticeCode: '123456789',
        creditorTaxId: '123456789',
      },
    };

    setPaymentCache(newPaymentItem, iun);
    const paymentCache = getPaymentCache(iun);
    expect(paymentCache).toEqual(newPaymentItem);
  });

  it('should delete a property in the payment cache', () => {
    const newPaymentItem = {
      ...cachedPayments,
      currentPayment: {
        noticeCode: '123456789',
        creditorTaxId: '123456789',
      },
    };

    setPaymentCache(newPaymentItem, iun);

    deletePropertiesInPaymentCache(['currentPayment'], iun);

    const result = {
      ...cachedPayments,
      currentPayment: undefined,
    };

    delete result.currentPayment;

    const paymentCacheAfterDelete = getPaymentCache(iun);
    expect(paymentCacheAfterDelete).toEqual(result);
  });

  it('clearPaymentCache should clear the payment cache', () => {
    clearPaymentCache();
    const paymentCache = getPaymentCache(iun);
    expect(paymentCache).toEqual(null);
  });

  it('isTimestampWithin2Minutes should return true if the timestamp is within 2 minutes and false if not', () => {
    let timestamp1 = '2023-11-17T14:13:53.165Z';
    let timestamp2 = '2023-11-17T14:15:53.165Z';
    const result = isTimestampWithin2Minutes(timestamp1, timestamp2);
    expect(result).toEqual(true);

    timestamp1 = '2023-11-17T14:13:53.165Z';
    timestamp2 = '2023-11-17T14:16:53.165Z';
    expect(() => isTimestampWithin2Minutes(timestamp1, timestamp2)).toThrowError(
      'Timestamp is not valid'
    );
  });

  it('checkIunAndTimestamp should return false if iun is different from cache', () => {
    const newIun = 'ARJP-NLZG-WETM-202311-J-2';
    expect(() => checkIun(newIun, iun)).toThrowError('Iun is not valid');
  });

  it('isTimestampWithin2Minutes should throw an error if is not within 2 minutes', () => {
    const timestamp = '2023-11-17T14:50:53.165Z';
    expect(() => isTimestampWithin2Minutes(timestamp, new Date().toISOString())).toThrowError(
      'Timestamp is not valid'
    );
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

  it('setPaymentsInCache should set a new payments in cache', () => {
    const newPayment: PaymentDetails[] = [
      {
        pagoPa: {
          noticeCode: '123456789',
          creditorTaxId: '123456789',
          applyCost: true,
          recipientType: RecipientType.PF,
          status: PaymentStatus.REQUIRED,
          paymentSourceChannel: 'PAGO_PA',
        },
        f24: undefined,
      },
    ];

    setPaymentsInCache(newPayment, iun);

    const paymentCache = getPaymentCache(iun);
    expect(paymentCache).toEqual({
      ...cachedPayments,
      payments: [...newPayment, ...cachedPayments.payments],
    });
  });

  it('should return null if the payment cache is invalid', () => {
    const invalidCache = {
      ...cachedPayments,
      unexpectedProperty: 'unexpectedProperty',
    };

    setPaymentCache(invalidCache, iun);

    const paymentCache = getPaymentCache(iun);

    expect(paymentCache).toEqual(null);
  });

  it('should return null if the json is invalid', () => {
    sessionStorage.setItem('payments', 'invalidJson');

    const paymentCache = getPaymentCache(iun);

    expect(paymentCache).toEqual(null);
  });
});
