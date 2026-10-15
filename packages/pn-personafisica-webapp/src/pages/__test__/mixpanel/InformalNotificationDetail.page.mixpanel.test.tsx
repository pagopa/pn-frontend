import MockAdapter from 'axios-mock-adapter';
import { Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

import { EventNotificationTypes, PaymentStatus } from '@pagopa-pn/pn-commons';

import { errorMock } from '../../../__mocks__/Errors.mock';
import { informalNotificationMock } from '../../../__mocks__/InformalNotification.mock';
import { PFTriggerEventSpy, act, fireEvent, render, waitFor } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { PFEventsType } from '../../../models/PFEventsType';
import * as routes from '../../../navigation/routes.const';
import PFEventStrategyFactory from '../../../utility/MixpanelUtils/PFEventStrategyFactory';
import InformalNotificationDetail from '../../InformalNotificationDetail.page';

const mockAssignFn = vi.fn();

const Component = () => (
  <Routes>
    <Route path={routes.DETTAGLIO_COMBO} element={<InformalNotificationDetail />} />
  </Routes>
);

const iun = informalNotificationMock.iun;
const informalNotificationRoute = routes.GET_DETTAGLIO_COMUNICAZIONE_PATH(iun);
const pagoPaPayment = informalNotificationMock.recipients[0].payments![0].pagoPa!;

const paymentInfo = [
  {
    noticeCode: pagoPaPayment.noticeCode,
    creditorTaxId: pagoPaPayment.creditorTaxId,
    status: PaymentStatus.REQUIRED,
    amount: 6068,
    causaleVersamento: 'Sollecito di pagamento Tari 2023',
    dueDate: '2026-05-26',
  },
];

describe('InformalNotificationDetail.page - Mixpanel events', () => {
  let triggerEventSpy: PFTriggerEventSpy;
  let mock: MockAdapter;
  const original = globalThis.location;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
    Object.defineProperty(globalThis, 'location', {
      configurable: true,
      value: { href: '', assign: mockAssignFn },
    });
  });

  beforeEach(() => {
    triggerEventSpy = vi.spyOn(PFEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    mock.reset();
    mockAssignFn.mockClear();
    triggerEventSpy.mockRestore();
    sessionStorage.clear();
  });

  afterAll(() => {
    mock.restore();
    Object.defineProperty(globalThis, 'location', { configurable: true, value: original });
  });

  const setupMocks = () => {
    mock
      .onGet(`/bff/v1/notifications/informal/received/${iun}`)
      .reply(200, informalNotificationMock);
    mock.onPost('/bff/v1/payments/info').reply(200, paymentInfo);
  };

  it('fires SEND_NOTIFICATION_DETAIL on page load', async () => {
    setupMocks();

    await act(async () => {
      render(<Component />, { route: informalNotificationRoute });
    });

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_NOTIFICATION_DETAIL, {
        downtimeEvents: [],
        notificationStatus: informalNotificationMock.notificationStatus,
        checkIfUserHasPayments: true,
        paymentCount: 1,
        source: 'LISTA_NOTIFICHE',
        timeline: undefined,
        flow: 'not_set',
        delivery_mode: 'not_set',
        notification_type: EventNotificationTypes.INFORMAL,
      });
    });
  });

  it('does not fire SEND_NOTIFICATION_DETAIL when the api fails', async () => {
    mock
      .onGet(`/bff/v1/notifications/informal/received/${iun}`)
      .reply(errorMock.status, errorMock.data);

    await act(async () => {
      render(<Component />, { route: informalNotificationRoute });
    });

    expect(triggerEventSpy).not.toHaveBeenCalledWith(
      PFEventsType.SEND_NOTIFICATION_DETAIL,
      expect.anything()
    );
  });

  it('fires SEND_DOWNLOAD_ATTACHMENT when an attachment button is clicked', async () => {
    setupMocks();

    const { getAllByTestId } = await act(async () =>
      render(<Component />, { route: informalNotificationRoute })
    );

    await waitFor(() => getAllByTestId('documentButton'));
    fireEvent.click(getAllByTestId('documentButton')[0]);

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_DOWNLOAD_ATTACHMENT, {
      notification_type: EventNotificationTypes.INFORMAL,
    });
  });

  it('fires SEND_START_PAYMENT when pay button is clicked', async () => {
    setupMocks();
    mock.onPost('/bff/v1/payments/cart').reply(200, { checkoutUrl: 'https://mocked-url.com' });

    const { findByTestId } = await act(async () =>
      render(<Component />, { route: informalNotificationRoute })
    );

    const payButton = await findByTestId('pay-button');
    await waitFor(() => expect(payButton).toHaveTextContent(/60,68/));
    fireEvent.click(payButton);

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_START_PAYMENT, {
      psp: 'pagopa',
      notification_type: EventNotificationTypes.INFORMAL,
    });
  });

  it('fires SEND_DOWNLOAD_PAYMENT_NOTICE when pagoPA notice download button is clicked', async () => {
    setupMocks();
    mock
      .onGet(`/bff/v1/notifications/informal/received/${iun}/attachments/payment/PAGOPA`)
      .reply(200, { url: 'https://mocked-pagopa-url.com' });

    const { findByTestId } = await act(async () =>
      render(<Component />, { route: informalNotificationRoute })
    );

    const downloadButton = await findByTestId('download-pagoPA-notice-button');
    fireEvent.click(downloadButton);

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_DOWNLOAD_PAYMENT_NOTICE, {
      notification_type: EventNotificationTypes.INFORMAL,
    });
  });

  it('fires SEND_TAP_EXTERNAL_LINK when sender website is clicked', async () => {
    setupMocks();

    const { getByText } = await act(async () =>
      render(<Component />, { route: informalNotificationRoute })
    );

    const site = informalNotificationMock.senderContacts!.site!;
    fireEvent.click(getByText(site));

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_TAP_EXTERNAL_LINK, {
      link: `https://${site}`,
      notification_type: EventNotificationTypes.INFORMAL,
    });
  });
});
