import MockAdapter from 'axios-mock-adapter';
import { MockInstance, vi } from 'vitest';

import { PAYMENT_CACHE_KEY, PaymentStatus, setPaymentCache } from '@pagopa-pn/pn-commons';

import { paymentInfo } from '../../../../__mocks__/ExternalRegistry.mock';
import { notificationToFe, paymentsData, recipients } from '../../../../__mocks__/NotificationDetail.mock';
import { createMockedStore } from '../../../../__test__/test-utils';
import { apiClient } from '../../../../api/apiClients';
import { PFEventsType } from '../../../../models/PFEventsType';
import PFEventStrategyFactory from '../../../../utility/MixpanelUtils/PFEventStrategyFactory';
import { getReceivedNotificationPaymentInfo } from '../../actions';

const failedPayment = paymentInfo.find((p) => p.status === PaymentStatus.FAILED)!;
const succeededPayment = paymentInfo.find((p) => p.status === PaymentStatus.SUCCEEDED)!;

const currentPayment = {
  creditorTaxId: failedPayment.creditorTaxId,
  noticeCode: failedPayment.noticeCode,
};

describe('getReceivedNotificationPaymentInfo - Mixpanel events', () => {
  let mock: MockAdapter;
  let triggerEventSpy: MockInstance<[PFEventsType, unknown?], void>;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  beforeEach(() => {
    triggerEventSpy = vi.spyOn(PFEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    mock.reset();
    sessionStorage.removeItem(PAYMENT_CACHE_KEY);
    triggerEventSpy.mockRestore();
  });

  afterAll(() => {
    mock.restore();
  });

  it('fires SEND_PAYMENT_OUTCOME when returning from payment page', async () => {
    const mockedStore = createMockedStore({
      notificationState: { notification: notificationToFe, paymentsData },
    });

    setPaymentCache(
      { iun: notificationToFe.iun, timestamp: new Date().toISOString(), currentPayment, payments: [] },
      notificationToFe.iun
    );

    mock
      .onPost('/bff/v1/payments/info', [currentPayment])
      .reply(200, [{ ...failedPayment, status: PaymentStatus.FAILED }]);

    await mockedStore.dispatch(
      getReceivedNotificationPaymentInfo({
        taxId: recipients[2].taxId,
        paymentInfoRequest: [currentPayment],
      })
    );

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_PAYMENT_OUTCOME, {
      outcome: PaymentStatus.FAILED,
    });
    expect(triggerEventSpy).not.toHaveBeenCalledWith(PFEventsType.SEND_PAYMENTS_COUNT);
  });

  it('fires SEND_PAYMENT_OUTCOME and SEND_PAYMENTS_COUNT when payment succeeds', async () => {
    const currentSucceededPayment = {
      creditorTaxId: succeededPayment.creditorTaxId,
      noticeCode: succeededPayment.noticeCode,
    };

    const mockedStore = createMockedStore({
      notificationState: { notification: notificationToFe, paymentsData },
    });

    setPaymentCache(
      {
        iun: notificationToFe.iun,
        timestamp: new Date().toISOString(),
        currentPayment: currentSucceededPayment,
        payments: [],
      },
      notificationToFe.iun
    );

    mock
      .onPost('/bff/v1/payments/info', [currentSucceededPayment])
      .reply(200, [{ ...succeededPayment, status: PaymentStatus.SUCCEEDED }]);

    await mockedStore.dispatch(
      getReceivedNotificationPaymentInfo({
        taxId: recipients[2].taxId,
        paymentInfoRequest: [currentSucceededPayment],
      })
    );

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_PAYMENT_OUTCOME, {
      outcome: PaymentStatus.SUCCEEDED,
    });
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_PAYMENTS_COUNT);
  });
});