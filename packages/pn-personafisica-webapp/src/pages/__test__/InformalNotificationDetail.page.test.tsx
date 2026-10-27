import MockAdapter from 'axios-mock-adapter';
import { Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

import {
  AppMessage,
  AppResponseMessage,
  PAYMENT_CACHE_KEY,
  PaymentStatus,
  ResponseEventDispatcher,
} from '@pagopa-pn/pn-commons';
import { initLocalizationForTest } from '@pagopa-pn/pn-commons/src/test-utils';
import userEvent from '@testing-library/user-event';

import { mandatesByDelegate } from '../../__mocks__/Delegations.mock';
import { errorMock } from '../../__mocks__/Errors.mock';
import { informalNotificationMock } from '../../__mocks__/InformalNotification.mock';
import { RenderResult, act, fireEvent, render, screen, waitFor } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import { BffFullInformalNotificationV1 } from '../../generated-client/informal-notifications';
import * as routes from '../../navigation/routes.const';
import { INFORMAL_NOTIFICATION_ACTIONS } from '../../redux/notification/informalActions';
import InformalNotificationDetail from '../InformalNotificationDetail.page';

const mockAssignFn = vi.fn();

const Component = () => (
  <Routes>
    <Route path={routes.DETTAGLIO_COMBO} element={<InformalNotificationDetail />} />
    <Route path={routes.NOTIFICHE} element={<div data-testid="notifications-page" />} />
  </Routes>
);

const iun = informalNotificationMock.iun;
const currentRecipient = informalNotificationMock.recipients[0];
const primaryMessage = (currentRecipient as any).message.primaryMessage;
const pagoPaPayment = currentRecipient.payments![0].pagoPa!;
const documents = informalNotificationMock.documents!;
const informalNotificationRoute = routes.GET_DETTAGLIO_COMUNICAZIONE_PATH(iun);

const paymentInfoRequest = [
  {
    noticeCode: pagoPaPayment.noticeCode,
    creditorTaxId: pagoPaPayment.creditorTaxId,
  },
];

const paymentInfo = [
  {
    ...paymentInfoRequest[0],
    status: PaymentStatus.REQUIRED,
    amount: 6068,
    causaleVersamento: 'Sollecito di pagamento Tari 2023',
    dueDate: '2026-05-26',
  },
];

const notificationWithoutPayments: BffFullInformalNotificationV1 = {
  ...informalNotificationMock,
  recipients: [{ ...currentRecipient, payments: [] }],
};

describe('InformalNotificationDetail Page', () => {
  let result: RenderResult;
  let mock: MockAdapter;

  const renderPage = async (preloadedState?: any) => {
    await act(async () => {
      result = render(<Component />, {
        preloadedState,
        route: informalNotificationRoute,
      });
    });
  };

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
    initLocalizationForTest();
  });

  beforeEach(() => {
    vi.stubGlobal('location', { href: '', assign: mockAssignFn });
  });

  afterEach(() => {
    sessionStorage.removeItem(PAYMENT_CACHE_KEY);
    vi.clearAllMocks();
    mock.reset();
    vi.unstubAllGlobals();
  });

  afterAll(() => {
    mock.restore();
  });

  it('renders InformalNotificationDetail page', async () => {
    mock
      .onGet(`/bff/v1/notifications/informal/received/${iun}`)
      .reply(200, informalNotificationMock);
    mock.onPost(`/bff/v1/payments/info`, paymentInfoRequest).reply(200, paymentInfo);
    await renderPage();
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toBe(`/bff/v1/notifications/informal/received/${iun}`);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
    });
    expect(mock.history.post[0].url).toBe(`/bff/v1/payments/info`);
    // check breadcrumb
    expect(result.getByTestId('breadcrumb-root-button')).toHaveTextContent('menu.notifiche');
    expect(result.getAllByText(primaryMessage.subject).length).toBeGreaterThan(0);
    // check abstract
    expect(result.container).toHaveTextContent(informalNotificationMock.senderDenomination);
    expect(result.container).toHaveTextContent(iun);
    // check documents box
    const notificationDetailDocuments = result.getAllByTestId('notificationDetailDocuments');
    expect(notificationDetailDocuments).toHaveLength(documents.length);
    expect(result.getByTestId('documentButton')).toHaveTextContent(documents[0].title!);
    expect(result.getByTestId('documentsMessage')).toHaveTextContent(
      'detail.acts_files.informal_downloadable_acts'
    );
    // check payment box
    const paymentData = await result.findByTestId('paymentInfoBox');
    expect(paymentData).toBeInTheDocument();
    // check sender contacts box
    expect(result.container).toHaveTextContent('detail.contact_sender.title');
    expect(result.container).toHaveTextContent(informalNotificationMock.senderContacts!.phone!);
  });

  it('API error', async () => {
    mock
      .onGet(`/bff/v1/notifications/informal/received/${iun}`)
      .reply(errorMock.status, errorMock.data);
    // custom render
    await act(async () => {
      render(
        <>
          <ResponseEventDispatcher />
          <AppResponseMessage />
          <Component />
        </>,
        {
          route: informalNotificationRoute,
        }
      );
    });
    const statusApiErrorComponent = screen.queryByTestId(
      `api-error-${INFORMAL_NOTIFICATION_ACTIONS.GET_RECEIVED_INFORMAL_NOTIFICATION}`
    );
    expect(statusApiErrorComponent).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumb-root-button')).toBeInTheDocument();
    expect(screen.getByText('menu.fallback-communication')).toBeInTheDocument();
    expect(screen.queryByTestId('notificationDetailDocuments')).not.toBeInTheDocument();
  });

  it('checks not available documents', async () => {
    mock
      .onGet(`/bff/v1/notifications/informal/received/${iun}`)
      .reply(200, { ...notificationWithoutPayments, documentsAvailable: false });
    await renderPage();
    expect(result.getByTestId('documentsDisabled')).toHaveTextContent(
      'detail.acts_files.not_downloadable_acts'
    );
    expect(result.queryByTestId('notificationDetailDocuments')).not.toBeInTheDocument();
    expect(result.queryByTestId('documentButton')).not.toBeInTheDocument();
    expect(result.queryByTestId('documentsMessage')).not.toBeInTheDocument();
  });

  it('does not render documents box when the communication has no documents', async () => {
    const { documentsAvailable, ...notificationWithoutDocuments } = notificationWithoutPayments;
    mock
      .onGet(`/bff/v1/notifications/informal/received/${iun}`)
      .reply(200, { ...notificationWithoutDocuments, documents: [] });
    await renderPage();
    expect(result.queryByTestId('notificationDetailDocuments')).not.toBeInTheDocument();
    expect(result.queryByTestId('documentsMessage')).not.toBeInTheDocument();
  });

  it('does not render payment box and does not fetch payment info without payments', async () => {
    mock
      .onGet(`/bff/v1/notifications/informal/received/${iun}`)
      .reply(200, notificationWithoutPayments);
    await renderPage();
    expect(mock.history.post).toHaveLength(0);
    expect(result.queryByTestId('paymentInfoBox')).not.toBeInTheDocument();
  });

  it('does not render sender contacts box without phone and site', async () => {
    mock
      .onGet(`/bff/v1/notifications/informal/received/${iun}`)
      .reply(200, { ...notificationWithoutPayments, senderContacts: {} });
    await renderPage();
    expect(result.container).not.toHaveTextContent('detail.contact_sender.title');
  });

  it('executes the document download handler', async () => {
    const docIdx = documents[0].docIdx;
    mock
      .onGet(`/bff/v1/notifications/informal/received/${iun}`)
      .reply(200, notificationWithoutPayments);
    mock
      .onGet(`/bff/v1/notifications/informal/received/${iun}/attachments/documents/${docIdx}`)
      .reply(200, {
        filename: documents[0].ref.key,
        contentType: documents[0].contentType,
        contentLength: 3028,
        sha256: documents[0].digests.sha256,
        url: 'https://mocked-url.com',
      });
    await renderPage();
    expect(mock.history.get).toHaveLength(1);
    const documentButton = result.getByTestId('documentButton');
    fireEvent.click(documentButton);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(2);
      expect(mock.history.get[1].url).toBe(
        `/bff/v1/notifications/informal/received/${iun}/attachments/documents/${docIdx}`
      );
    });
    await waitFor(() => {
      expect(globalThis.location.href).toBe('https://mocked-url.com');
    });
  });

  it('shows info message when the document is not available yet', async () => {
    const docIdx = documents[0].docIdx;
    mock
      .onGet(`/bff/v1/notifications/informal/received/${iun}`)
      .reply(200, notificationWithoutPayments);
    mock
      .onGet(`/bff/v1/notifications/informal/received/${iun}/attachments/documents/${docIdx}`)
      .reply(200, { retryAfter: 1000 });
    await act(async () => {
      result = render(
        <>
          <AppMessage />
          <Component />
        </>,
        {
          route: informalNotificationRoute,
        }
      );
    });
    fireEvent.click(result.getByTestId('documentButton'));
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(2);
    });
    expect(await result.findByText('detail.document-not-available')).toBeInTheDocument();
    expect(globalThis.location.href).toBe('');
  });

  it('executes the pagoPA notice download handler', async () => {
    mock
      .onGet(`/bff/v1/notifications/informal/received/${iun}`)
      .reply(200, informalNotificationMock);
    mock.onPost(`/bff/v1/payments/info`, paymentInfoRequest).reply(200, paymentInfo);
    mock
      .onGet(`/bff/v1/notifications/informal/received/${iun}/attachments/payment/PAGOPA`)
      .reply(200, { url: 'https://mocked-pagopa-url.com' });
    await renderPage();
    const downloadButton = await result.findByTestId('download-pagoPA-notice-button');
    fireEvent.click(downloadButton);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(2);
      expect(mock.history.get[1].url).toBe(
        `/bff/v1/notifications/informal/received/${iun}/attachments/payment/PAGOPA`
      );
    });
    await waitFor(() => {
      expect(globalThis.location.href).toBe('https://mocked-pagopa-url.com');
    });
  });

  it('should dispatch getReceivedNotificationPaymentUrl on pay button click', async () => {
    mock
      .onGet(`/bff/v1/notifications/informal/received/${iun}`)
      .reply(200, informalNotificationMock);
    mock.onPost(`/bff/v1/payments/info`, paymentInfoRequest).reply(200, paymentInfo);
    mock
      .onPost(`/bff/v1/payments/cart`, {
        paymentNotice: {
          noticeNumber: paymentInfo[0].noticeCode,
          fiscalCode: paymentInfo[0].creditorTaxId,
          amount: paymentInfo[0].amount,
          companyName: informalNotificationMock.senderDenomination,
          description: informalNotificationMock.subject,
        },
        returnUrl: globalThis.location.href,
      })
      .reply(200, {
        checkoutUrl: 'https://mocked-url.com',
      });
    await renderPage();
    // single unpaid payment is automatically selected
    const payButton = await result.findByTestId('pay-button');
    await waitFor(() => {
      expect(payButton).toHaveTextContent(/detail.payment.submit/);
      expect(payButton).toHaveTextContent(/60,68/);
    });
    fireEvent.click(payButton);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(2);
      expect(mock.history.post[1].url).toBe(`/bff/v1/payments/cart`);
    });
    await waitFor(() => {
      expect(mockAssignFn).toHaveBeenCalledTimes(1);
      expect(mockAssignFn).toHaveBeenCalledWith('https://mocked-url.com');
    });
  });

  it('navigates to the notifications list when clicking the root breadcrumb', async () => {
    mock
      .onGet(`/bff/v1/notifications/informal/received/${iun}`)
      .reply(200, notificationWithoutPayments);
    await renderPage();
    const rootButton = result.getByTestId('breadcrumb-root-button');
    await userEvent.click(rootButton);
    await waitFor(() => {
      expect(result.router.state.location.pathname).toBe(routes.NOTIFICHE);
    });
    expect(result.getByTestId('notifications-page')).toBeInTheDocument();
  });

  it('renders user notifications label in breadcrumb when delegators are present', async () => {
    mock
      .onGet(`/bff/v1/notifications/informal/received/${iun}`)
      .reply(200, notificationWithoutPayments);
    await renderPage({
      generalInfoState: {
        delegators: mandatesByDelegate,
      },
    });
    expect(result.getByTestId('breadcrumb-root-button')).toHaveTextContent('menu.notifiche-utente');
  });
});
