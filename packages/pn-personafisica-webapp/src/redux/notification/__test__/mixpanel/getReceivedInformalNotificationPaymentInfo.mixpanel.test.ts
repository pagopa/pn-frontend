import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import {
  EventNotificationTypes,
  PAYMENT_CACHE_KEY,
  PaymentStatus,
  setPaymentCache,
} from '@pagopa-pn/pn-commons';

import { informalNotificationMock } from '../../../../__mocks__/InformalNotification.mock';
import { PFTriggerEventSpy, createMockedStore } from '../../../../__test__/test-utils';
import { apiClient } from '../../../../api/apiClients';
import { PFEventsType } from '../../../../models/PFEventsType';
import PFEventStrategyFactory from '../../../../utility/MixpanelUtils/PFEventStrategyFactory';
import { getReceivedInformalNotificationPaymentInfo } from '../../informalActions';

const pagoPaPayment = informalNotificationMock.recipients[0].payments![0].pagoPa!;

const currentPayment = {
  noticeCode: pagoPaPayment.noticeCode,
  creditorTaxId: pagoPaPayment.creditorTaxId,
};

describe('getReceivedInformalNotificationPaymentInfo - Mixpanel events', () => {
  let mock: MockAdapter;
  let triggerEventSpy: PFTriggerEventSpy;

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
      notificationState: { informalNotification: informalNotificationMock },
    });

    setPaymentCache(
      {
        iun: informalNotificationMock.iun,
        timestamp: new Date().toISOString(),
        currentPayment,
        payments: [],
      },
      informalNotificationMock.iun
    );

    mock
      .onPost('/bff/v1/payments/info', [currentPayment])
      .reply(200, [{ ...currentPayment, status: PaymentStatus.SUCCEEDED }]);

    await mockedStore.dispatch(
      getReceivedInformalNotificationPaymentInfo({ paymentInfoRequest: [currentPayment] })
    );

    expect(triggerEventSpy).toHaveBeenCalledTimes(1);
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_PAYMENT_OUTCOME, {
      outcome: PaymentStatus.SUCCEEDED,
      notification_type: EventNotificationTypes.INFORMAL,
    });
  });

  it('does not fire SEND_PAYMENT_OUTCOME when there is no current payment in cache', async () => {
    const mockedStore = createMockedStore({
      notificationState: { informalNotification: informalNotificationMock },
    });

    mock
      .onPost('/bff/v1/payments/info', [currentPayment])
      .reply(200, [{ ...currentPayment, status: PaymentStatus.REQUIRED }]);

    await mockedStore.dispatch(
      getReceivedInformalNotificationPaymentInfo({ paymentInfoRequest: [currentPayment] })
    );

    expect(triggerEventSpy).not.toHaveBeenCalled();
  });
});
