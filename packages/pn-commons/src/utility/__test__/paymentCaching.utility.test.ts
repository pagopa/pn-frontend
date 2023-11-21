import { cachedPayments, paymentsData } from '../../__mocks__/NotificationDetail.mock';
import {
  checkIfPaymentsIsAlreadyInCache,
  checkIunAndTimestamp,
  clearPaymentCache,
  deletePropertiesInPaymentCache,
  getPaymentCache,
  getPaymentsFromCache,
  isTimestampWithin2Minutes,
  setPaymentCache,
} from '../paymentCaching.utility';

describe('Payment caching utility', () => {
  beforeEach(() => {
    sessionStorage.setItem('payments', JSON.stringify(cachedPayments));
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should return the correct payment item', () => {
    const paymentCache = getPaymentCache();
    expect(paymentCache).toEqual(cachedPayments);
  });

  it('getPaymentsFromCache should return paymentsPage sorted by page', () => {
    const paymentsFromCache = getPaymentsFromCache();
    expect(paymentsFromCache).toEqual(cachedPayments.paymentsPage);
  });

  it('setPaymentCache should update the item in sessionStorage', () => {
    const newPaymentItem = {
      ...cachedPayments,
      iun: 'ARJP-NLZG-WETM-202311-J-2',
    };
    setPaymentCache(newPaymentItem);
    const paymentCache = getPaymentCache();
    expect(paymentCache).toEqual(newPaymentItem);
  });

  it('should set a new elements in the paymentsPage array', () => {
    const newPaymentItem = {
      ...cachedPayments,
      paymentsPage: [
        ...cachedPayments.paymentsPage,
        {
          page: 2,
          payments: {
            ...paymentsData,
            pagoPaF24: paymentsData.pagoPaF24.slice(10, 15),
          },
        },
      ],
    };
    setPaymentCache(newPaymentItem);
    const paymentCache = getPaymentCache();
    expect(paymentCache).toEqual(newPaymentItem);
  });

  it('should delete a property in the payment cache', () => {
    const paymentCache = getPaymentCache();
    expect(paymentCache).toEqual(cachedPayments);

    deletePropertiesInPaymentCache(['iun']);

    const result = {
      ...cachedPayments,
      iun: undefined,
    };

    delete result.iun;

    const paymentCacheAfterDelete = getPaymentCache();
    expect(paymentCacheAfterDelete).toEqual(result);
  });

  it('clearPaymentCache should clear the payment cache', () => {
    clearPaymentCache();
    const paymentCache = getPaymentCache();
    expect(paymentCache).toEqual(null);
  });

  it('isTimestampWithin2Minutes should return true if the timestamp is within 2 minutes and false if not', () => {
    let timestamp1 = '2023-11-17T14:13:53.165Z';
    let timestamp2 = '2023-11-17T14:15:53.165Z';
    const result = isTimestampWithin2Minutes(timestamp1, timestamp2);
    expect(result).toEqual(true);

    timestamp1 = '2023-11-17T14:13:53.165Z';
    timestamp2 = '2023-11-17T14:16:53.165Z';
    const result2 = isTimestampWithin2Minutes(timestamp1, timestamp2);
    expect(result2).toEqual(false);
  });

  it('checkIunAndTimestamp should return false if iun is different from cache', () => {
    const iun = 'ARJP-NLZG-WETM-202311-J-2';
    const timestamp = cachedPayments.timestamp;
    const result = checkIunAndTimestamp(iun, timestamp);
    expect(result).toEqual(false);
  });

  it('checkIunAndTimestamp should return false if timestamp is not within 2 minutes', () => {
    const iun = cachedPayments.iun;
    const timestamp = '2023-11-17T14:50:53.165Z';
    const result = checkIunAndTimestamp(iun, timestamp);
    expect(result).toEqual(false);
  });

  it('checkIunAndTimestamp should return true if iun is equal to cache and timestamp is within 2 minutes', () => {
    const iun = cachedPayments.iun;
    const timestamp = cachedPayments.timestamp;
    const result = checkIunAndTimestamp(iun, timestamp);
    expect(result).toEqual(true);
  });

  it('checkIfPaymentsIsAlreadyInCache should return true if payments is already in cache', () => {
    const paymentInfoRequest = paymentsData.pagoPaF24.map((payment) => ({
      noticeCode: payment.pagoPa?.noticeCode,
      creditorTaxId: payment.pagoPa?.creditorTaxId,
    }));

    const result = checkIfPaymentsIsAlreadyInCache(paymentInfoRequest);

    expect(result).toEqual(true);
  });

  it('checkIfPaymentsIsAlreadyInCache should return false if payments is not in cache', () => {
    const paymentInfoRequest = [
      {
        noticeCode: '123456789',
        creditorTaxId: '123456789',
      },
    ];

    const result = checkIfPaymentsIsAlreadyInCache(paymentInfoRequest);

    expect(result).toEqual(false);
  });
});
