import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import {
  AppMessage,
  AppResponseMessage,
  AppRouteParams,
  NotificationDetail as NotificationDetailModel,
  NotificationDetailOtherDocument,
  NotificationStatus,
  PAYMENT_CACHE_KEY,
  PaymentStatus,
  ResponseEventDispatcher,
  TimelineCategory,
  formatDate,
  getPaymentCache,
  populatePaymentsPagoPaF24,
  setPaymentCache,
} from '@pagopa-pn/pn-commons';
import { initLocalizationForTest } from '@pagopa-pn/pn-commons/src/test-utils';

import { downtimesDTO } from '../../__mocks__/AppStatus.mock';
import { mandatesByDelegate } from '../../__mocks__/Delegations.mock';
import { errorMock } from '../../__mocks__/Errors.mock';
import { paymentInfo } from '../../__mocks__/ExternalRegistry.mock';
import {
  cachedPayments,
  notificationDTO,
  notificationToFe,
  paymentsData,
  raddNotificationDTO,
} from '../../__mocks__/NotificationDetail.mock';
import {
  RenderResult,
  act,
  fireEvent,
  render,
  screen,
  testStore,
  waitFor,
  within,
} from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import { BffCheckTPPResponse } from '../../generated-client/notifications';
import * as routes from '../../navigation/routes.const';
import { NOTIFICATION_ACTIONS } from '../../redux/notification/actions';
import { ServerResponseErrorCode } from '../../utility/AppError/types';
import NotificationDetail from '../NotificationDetail.page';

const mockNavigateFn = vi.fn();
let mockIsDelegate = false;
let mockSource: AppRouteParams | undefined = AppRouteParams.AAR;
const mockAssignFn = vi.fn();

// mock imports
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useParams: () =>
    mockIsDelegate
      ? { id: 'DAPQ-LWQV-DKQH-202308-A-1', mandateId: '5' }
      : { id: 'DAPQ-LWQV-DKQH-202308-A-1' },
  useNavigate: () => mockNavigateFn,
  useLocation: () => ({ state: { source: mockSource }, pathname: '/' }),
}));

const getLegalFactIds = (notification: NotificationDetailModel, recIndex: number) => {
  const timelineElementDigitalSuccessWorkflow = notification.timeline.filter(
    (t) => t.category === TimelineCategory.NOTIFICATION_VIEWED && t.details.recIndex === recIndex
  )[0];
  return timelineElementDigitalSuccessWorkflow.legalFactsIds![0];
};

const delegator = mandatesByDelegate.find(
  (delegator) => delegator.delegator?.fiscalCode === notificationDTO.recipients[2].taxId
);

/*
ATTENZIONE: un'evenutale modifica al mock potrebbe causare il fallimento di alcuni test
*/
describe('NotificationDetail Page', async () => {
  let result: RenderResult;
  let mock: MockAdapter;
  const mockLegalIds = getLegalFactIds(notificationToFe, 2);
  const original = window.location;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href: '', assign: mockAssignFn },
    });
    initLocalizationForTest();
  });

  afterEach(() => {
    sessionStorage.removeItem(PAYMENT_CACHE_KEY);
    vi.clearAllMocks();
    mock.reset();
    mockSource = undefined;
    mockIsDelegate = false;
    window.location.href = '';
  });

  afterAll(() => {
    mock.restore();
    Object.defineProperty(window, 'location', { configurable: true, value: original });
  });

  const paymentInfoRequest = paymentInfo.map((payment) => ({
    creditorTaxId: payment.creditorTaxId,
    noticeCode: payment.noticeCode,
  }));

  it('renders NotificationDetail page', async () => {
    mock.onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`).reply(200, notificationDTO);
    mock.onPost(`/bff/v1/payments/info`, paymentInfoRequest).reply(200, paymentInfo);
    // we use regexp to not set the query parameters
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
    await act(async () => {
      result = render(<NotificationDetail />, {
        preloadedState: {
          userState: { user: { fiscal_number: notificationDTO.recipients[2].taxId } },
        },
      });
    });
    expect(mock.history.get).toHaveLength(2);
    expect(mock.history.get[0].url).toContain('/bff/v1/notifications/received');
    expect(mock.history.post[0].url).toBe(`/bff/v1/payments/info`);
    expect(mock.history.get[1].url).toContain('/bff/v1/downtime/history');
    expect(result.getByTestId('breadcrumb-link')).toHaveTextContent(/detail.breadcrumb-root/i);
    expect(result.container).toHaveTextContent(notificationToFe.abstract!);
    // check summary table
    const notificationDetailTable = result.getByTestId('notificationDetailTable');
    expect(notificationDetailTable).toBeInTheDocument();
    const tableRows = notificationDetailTable?.querySelectorAll('tr');
    expect(tableRows[0]).toHaveTextContent(`detail.sender${notificationToFe.senderDenomination}`);
    expect(tableRows[1]).toHaveTextContent(
      `detail.recipient${notificationToFe.recipients[2].denomination}`
    );
    expect(tableRows[2]).toHaveTextContent(`detail.date${formatDate(notificationToFe.sentAt)}`);
    expect(tableRows[3]).toHaveTextContent(`detail.iun${notificationToFe.iun}`);
    // check documents box
    const notificationDetailDocuments = result.getAllByTestId('notificationDetailDocuments');
    expect(notificationDetailDocuments).toHaveLength(
      notificationToFe.documents.length + notificationToFe.otherDocuments?.length!
    );
    const notificationDetailDocumentsMessage = result.getAllByTestId('documentsMessage');
    for (const notificationDetailDocumentMessage of notificationDetailDocumentsMessage) {
      expect(notificationDetailDocumentMessage).toHaveTextContent(
        /detail.acts_files.downloadable_aar|detail.acts_files.downloadable_acts/
      );
    }
    // check timeline box
    const NotificationDetailTimeline = result.getByTestId('NotificationDetailTimeline');
    expect(NotificationDetailTimeline).toBeInTheDocument();
    // check payment box
    const paymentData = result.getByTestId('paymentInfoBox');
    expect(paymentData).toBeInTheDocument();
    // check downtimes box
    const downtimesBox = result.getByTestId('downtimesBox');
    expect(downtimesBox).toBeInTheDocument();
    // check domicile banner
    const addDomicileBanner = result.getByTestId('addDomicileBanner');
    expect(addDomicileBanner).toBeInTheDocument();
  });

  it('renders NotificationDetail if status is cancelled', async () => {
    mock.onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`).reply(200, {
      ...notificationDTO,
      notificationStatus: NotificationStatus.CANCELLED,
      timeline: [
        ...notificationDTO.timeline,
        {
          elementId: 'NOTIFICATION_CANCELLATION_REQUEST.HYTD-ERPH-WDUE-202308-H-1',
          timestamp: '2033-08-14T13:42:54.17675939Z',
          legalFactsIds: [],
          category: TimelineCategory.NOTIFICATION_CANCELLATION_REQUEST,
          details: {},
        },
      ],
    });
    // we use regexp to not set the query parameters
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
    await act(async () => {
      result = render(<NotificationDetail />, {
        preloadedState: {
          userState: { user: { fiscal_number: notificationDTO.recipients[2].taxId } },
        },
      });
    });
    expect(mock.history.get).toHaveLength(2);
    expect(mock.history.get[0].url).toContain('/bff/v1/notifications/received');
    expect(mock.history.get[1].url).toContain('/bff/v1/downtime/history');
    // check documents box
    const notificationDetailDocumentsMessage = result.getAllByTestId('documentsMessage');
    for (const notificationDetailDocumentMessage of notificationDetailDocumentsMessage) {
      expect(notificationDetailDocumentMessage).toHaveTextContent(
        /detail.acts_files.notification_cancelled_aar|detail.acts_files.notification_cancelled_acts/
      );
    }
  });

  it('checks not available documents', async () => {
    mock.onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`).reply(200, {
      ...notificationDTO,
      documentsAvailable: false,
      sentAt: '2012-01-01T00:00:00Z',
    });
    mock.onPost(`/bff/v1/payments/info`, paymentInfoRequest).reply(200, paymentInfo);
    // we use regexp to not set the query parameters
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
    await act(async () => {
      result = render(<NotificationDetail />, {
        preloadedState: {
          userState: { user: { fiscal_number: notificationDTO.recipients[2].taxId } },
        },
      });
    });
    expect(mock.history.get).toHaveLength(2);
    expect(mock.history.post).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/bff/v1/notifications/received');
    expect(mock.history.get[1].url).toContain('/bff/v1/downtime/history');
    expect(mock.history.post[0].url).toBe(`/bff/v1/payments/info`);
    // check documents box
    const notificationDetailDocumentsMessage = result.getAllByTestId('documentsMessage');
    for (const notificationDetailDocumentMessage of notificationDetailDocumentsMessage) {
      expect(notificationDetailDocumentMessage).toHaveTextContent(
        /detail.acts_files.not_downloadable_aar|detail.acts_files.not_downloadable_acts/
      );
    }
  });

  it('checks not available payment', async () => {
    mock.onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`).reply(200, {
      ...notificationDTO,
      recipients: [
        { ...notificationDTO.recipients[2], payment: { creditorTaxId: null, noticeCode: null } },
      ],
    });
    // we use regexp to not set the query parameters
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
    await act(async () => {
      result = render(<NotificationDetail />);
    });
    // check payment box
    const paymentData = result.queryByTestId('paymentData');
    expect(paymentData).not.toBeInTheDocument();
  });

  it('executes the document download handler', async () => {
    mock.onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`).reply(200, notificationDTO);
    mock.onPost(`/bff/v1/payments/info`, paymentInfoRequest).reply(200, paymentInfo);
    // we use regexp to not set the query parameters
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
    mock
      .onGet(
        `/bff/v1/notifications/received/${notificationToFe.iun}/documents/ATTACHMENT?documentIdx=0`
      )
      .reply(200, {
        filename: notificationToFe.documents[0].ref.key,
        contentType: notificationToFe.documents[0].contentType,
        contentLength: 3028,
        sha256: notificationToFe.documents[0].digests.sha256,
        url: 'https://mocked-url.com',
      });
    await act(async () => {
      result = render(<NotificationDetail />, {
        preloadedState: {
          userState: { user: { fiscal_number: notificationDTO.recipients[2].taxId } },
        },
      });
    });
    expect(mock.history.get).toHaveLength(2);
    const documentButton = result.getAllByTestId('documentButton');
    fireEvent.click(documentButton[0]);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(3);
      expect(mock.history.post).toHaveLength(1);
      expect(mock.history.get[2].url).toContain(
        `/bff/v1/notifications/received/${notificationToFe.iun}/documents/ATTACHMENT?documentIdx=0`
      );
    });
    await waitFor(() => {
      expect(window.location.href).toBe('https://mocked-url.com');
    });
  });

  it('executes the legal fact download handler', async () => {
    mock.onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`).reply(200, notificationDTO);
    mock.onPost(`/bff/v1/payments/info`, paymentInfoRequest).reply(200, paymentInfo);
    // we use regexp to not set the query parameters
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
    mock
      .onGet(
        `/bff/v1/notifications/received/${notificationToFe.iun}/documents/LEGAL_FACT?documentId=${mockLegalIds.key}`
      )
      .reply(200, {
        retryAfter: 1,
      });
    await act(async () => {
      result = render(
        <>
          <AppMessage />
          <NotificationDetail />
        </>,
        {
          preloadedState: {
            userState: { user: { fiscal_number: notificationDTO.recipients[2].taxId } },
          },
        }
      );
    });
    expect(mock.history.get).toHaveLength(2);
    const legalFactButton = result.getAllByTestId('download-legalfact');
    fireEvent.click(legalFactButton[0]);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(3);
      expect(mock.history.get[2].url).toContain(
        `/bff/v1/notifications/received/${notificationToFe.iun}/documents/LEGAL_FACT?documentId=${mockLegalIds.key}`
      );
    });
    const docNotAvailableAlert = await waitFor(() => result.getByTestId('snackBarContainer'));
    expect(docNotAvailableAlert).toBeInTheDocument();
    mock
      .onGet(
        `/bff/v1/notifications/received/${notificationToFe.iun}/documents/LEGAL_FACT?documentId=${mockLegalIds.key}`
      )
      .reply(200, {
        filename: 'mocked-filename',
        contentLength: 1000,
        retryAfter: null,
        url: 'https://mocked-url-com',
      });
    // simulate that legal fact is now available
    fireEvent.click(legalFactButton[0]);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(4);
      expect(mock.history.get[3].url).toContain(
        `/bff/v1/notifications/received/${notificationToFe.iun}/documents/LEGAL_FACT?documentId=${mockLegalIds.key}`
      );
    });
    await waitFor(() => {
      expect(window.location.href).toBe('https://mocked-url-com');
    });
  });

  it('executes the other document (aar) download handler', async () => {
    const otherDocument: NotificationDetailOtherDocument = {
      documentId: notificationToFe.otherDocuments?.[0].documentId ?? '',
      documentType: notificationToFe.otherDocuments?.[0].documentType ?? '',
      digests: { sha256: '' },
      contentType: '',
      ref: {
        key: '',
        versionToken: '',
      },
    };
    mock.onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`).reply(200, notificationDTO);
    mock.onPost(`/bff/v1/payments/info`, paymentInfoRequest).reply(200, paymentInfo);
    // we use regexp to not set the query parameters
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
    mock
      .onGet(
        `/bff/v1/notifications/received/${notificationToFe.iun}/documents/AAR?documentId=${otherDocument.documentId}`
      )
      .reply(200, {
        retryAfter: 1,
      });
    await act(async () => {
      result = render(
        <>
          <AppMessage />
          <NotificationDetail />
        </>,
        {
          preloadedState: {
            userState: { user: { fiscal_number: notificationDTO.recipients[2].taxId } },
          },
        }
      );
    });

    expect(mock.history.get).toHaveLength(2);
    const AARBox = result.getByTestId('aarBox');
    const AARButton = within(AARBox).getByTestId('documentButton');
    fireEvent.click(AARButton);

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(3);
      expect(mock.history.get[2].url).toContain(
        `/bff/v1/notifications/received/${notificationToFe.iun}/documents/AAR?documentId=${otherDocument.documentId}`
      );
    });
    const docNotAvailableAlert = await waitFor(() => result.getByTestId('snackBarContainer'));
    expect(docNotAvailableAlert).toBeInTheDocument();
    mock
      .onGet(
        `/bff/v1/notifications/received/${notificationToFe.iun}/documents/AAR?documentId=${otherDocument.documentId}`
      )
      .reply(200, {
        filename: 'mocked-filename',
        contentLength: 1000,
        retryAfter: null,
        url: 'https://mocked-aar-com',
      });

    //simulate that aar is now available
    fireEvent.click(AARButton);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(4);
      expect(mock.history.get[3].url).toContain(
        `/bff/v1/notifications/received/${notificationToFe.iun}/documents/AAR?documentId=${otherDocument.documentId}`
      );
    });

    await waitFor(() => {
      expect(window.location.href).toBe('https://mocked-aar-com');
    });
  });

  it('executes the downtimws legal fact download handler', async () => {
    mock.onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`).reply(200, notificationDTO);
    mock.onPost(`/bff/v1/payments/info`, paymentInfoRequest).reply(200, paymentInfo);
    // we use regexp to not set the query parameters
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
    mock.onGet(`/bff/v1/downtime/legal-facts/${downtimesDTO.result[0].legalFactId}`).reply(200, {
      filename: 'mocked-filename',
      contentLength: 1000,
      url: 'https://mocked-url-com',
    });
    await act(async () => {
      result = render(<NotificationDetail />, {
        preloadedState: {
          userState: { user: { fiscal_number: notificationDTO.recipients[2].taxId } },
        },
      });
    });
    expect(mock.history.get).toHaveLength(2);
    const downtimesBox = result.getByTestId('downtimesBox');
    const legalFactDowntimesButton = downtimesBox?.querySelectorAll('button');
    fireEvent.click(legalFactDowntimesButton[0]);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(3);
      expect(mock.history.get[2].url).toContain(
        `/bff/v1/downtime/legal-facts/${downtimesDTO.result[0].legalFactId}`
      );
    });
    await waitFor(() => {
      expect(window.location.href).toBe('https://mocked-url-com');
    });
  });

  it('normal navigation - includes back button', async () => {
    mock.onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`).reply(200, notificationDTO);
    mock.onPost(`/bff/v1/payments/info`, paymentInfoRequest).reply(200, paymentInfo);
    // we use regexp to not set the query parameters
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
    await act(async () => {
      result = render(<NotificationDetail />, {
        preloadedState: {
          userState: { user: { fiscal_number: notificationDTO.recipients[2].taxId } },
        },
      });
    });
    const backButton = result.getByTestId('breadcrumb-indietro-button');
    expect(backButton).toBeInTheDocument();
    fireEvent.click(backButton);
    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(routes.NOTIFICHE);
  });

  it('navigation from QR code - does not include back button', async () => {
    mockSource = AppRouteParams.AAR;
    mock.onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`).reply(200, notificationDTO);
    mock.onGet(`/bff/v1/payments/info`, paymentInfoRequest).reply(200, paymentInfo);
    // we use regexp to not set the query parameters
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
    await act(async () => {
      result = render(<NotificationDetail />, {
        preloadedState: {
          userState: { user: { fiscal_number: notificationDTO.recipients[2].taxId } },
        },
      });
    });
    const backButton = result.queryByTestId('breadcrumb-indietro-button');
    expect(backButton).not.toBeInTheDocument();
  });

  it('navigation from Retrieval ID - does not include back button', async () => {
    mockSource = AppRouteParams.RETRIEVAL_ID;
    mock.onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`).reply(200, notificationDTO);
    mock.onGet(`/bff/v1/payments/info`, paymentInfoRequest).reply(200, paymentInfo);
    // we use regexp to not set the query parameters
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
    await act(async () => {
      result = render(<NotificationDetail />, {
        preloadedState: {
          userState: { user: { fiscal_number: notificationDTO.recipients[2].taxId } },
        },
      });
    });
    const backButton = result.queryByTestId('breadcrumb-indietro-button');
    expect(backButton).not.toBeInTheDocument();
  });

  it('API error', async () => {
    mock
      .onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`)
      .reply(errorMock.status, errorMock.data);
    // custom render
    await act(async () => {
      render(
        <>
          <ResponseEventDispatcher />
          <AppResponseMessage />
          <NotificationDetail />
        </>,
        {
          preloadedState: {
            userState: { user: { fiscal_number: notificationDTO.recipients[2].taxId } },
          },
        }
      );
    });
    const statusApiErrorComponent = screen.queryByTestId(
      `api-error-${NOTIFICATION_ACTIONS.GET_RECEIVED_NOTIFICATION}`
    );
    expect(statusApiErrorComponent).toBeInTheDocument();
  });

  it('renders NotificationDetail page with delegator logged', async () => {
    mockIsDelegate = true;
    mock
      .onGet(
        `/bff/v1/notifications/received/${notificationDTO.iun}?mandateId=${delegator?.mandateId}`
      )
      .reply(200, notificationDTO);
    mock.onPost(`/bff/v1/payments/info`, paymentInfoRequest).reply(200, paymentInfo);
    // we use regexp to not set the query parameters
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
    await act(async () => {
      result = render(<NotificationDetail />, {
        preloadedState: {
          userState: { user: { fiscal_number: 'CGNNMO80A03H501U' } },
          generalInfoState: {
            delegators: mandatesByDelegate,
          },
        },
      });
    });
    // when a delegator sees a notification, we expect that he sees the same things that sees the recipient except the disclaimer
    expect(mock.history.get).toHaveLength(2);
    expect(mock.history.get[0].url).toContain('/bff/v1/notifications/received');
    expect(mock.history.post[0].url).toBe(`/bff/v1/payments/info`);
    expect(mock.history.get[1].url).toContain('/bff/v1/downtime/history');
    expect(result.getByTestId('breadcrumb-link')).toHaveTextContent(/detail.breadcrumb-root/i);
    expect(result.container).toHaveTextContent(notificationToFe.abstract!);
    // check summary table
    const notificationDetailTable = result.getByTestId('notificationDetailTable');
    expect(notificationDetailTable).toBeInTheDocument();
    const tableRows = notificationDetailTable?.querySelectorAll('tr');
    expect(tableRows[0]).toHaveTextContent(`detail.sender${notificationToFe.senderDenomination}`);
    expect(tableRows[1]).toHaveTextContent(
      `detail.recipient${notificationToFe.recipients[2].denomination}`
    );
    expect(tableRows[2]).toHaveTextContent(`detail.date${formatDate(notificationToFe.sentAt)}`);
    expect(tableRows[3]).toHaveTextContent(`detail.iun${notificationToFe.iun}`);
    // check documents box
    const notificationDetailDocuments = result.getAllByTestId('notificationDetailDocuments');
    expect(notificationDetailDocuments).toHaveLength(
      notificationToFe.documents.length + notificationToFe.otherDocuments?.length!
    );
    const notificationDetailDocumentsMessage = result.getAllByTestId('documentsMessage');
    for (const notificationDetailDocumentMessage of notificationDetailDocumentsMessage) {
      expect(notificationDetailDocumentMessage).toHaveTextContent(
        /detail.acts_files.downloadable_aar|detail.acts_files.downloadable_acts/
      );
    }
    // check timeline box
    const NotificationDetailTimeline = result.getByTestId('NotificationDetailTimeline');
    expect(NotificationDetailTimeline).toBeInTheDocument();
    // check payment box
    const paymentData = result.getByTestId('paymentInfoBox');
    expect(paymentData).toBeInTheDocument();
    // check downtimes box
    const downtimesBox = result.getByTestId('downtimesBox');
    expect(downtimesBox).toBeInTheDocument();
    // check domicile banner
    const addDomicileBanner = result.queryByTestId('addDomicileBanner');
    expect(addDomicileBanner).not.toBeInTheDocument();
  });

  it('normal navigation when delegator is logged - includes back button', async () => {
    mockIsDelegate = true;
    mock
      .onGet(
        `/bff/v1/notifications/received/${notificationDTO.iun}?mandateId=${delegator?.mandateId}`
      )
      .reply(200, notificationDTO);
    mock.onPost(`/bff/v1/payments/info`, paymentInfoRequest).reply(200, paymentInfo);
    // we use regexp to not set the query parameters
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
    await act(async () => {
      result = render(<NotificationDetail />, {
        preloadedState: {
          userState: { user: { fiscal_number: 'CGNNMO80A03H501U' } },
          generalInfoState: {
            delegators: mandatesByDelegate,
            digitalAddresses: [],
          },
        },
      });
    });
    const backButton = result.getByTestId('breadcrumb-indietro-button');
    expect(backButton).toBeInTheDocument();
    fireEvent.click(backButton);
    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(
      routes.GET_NOTIFICHE_DELEGATO_PATH(delegator?.mandateId!)
    );
  });

  it('should dispatch getReceivedNotificationPaymentUrl on pay button click', async () => {
    vi.useFakeTimers();
    const paymentHistory = populatePaymentsPagoPaF24(
      notificationToFe.timeline,
      paymentsData.pagoPaF24,
      paymentInfo
    );
    const requiredPaymentIndex = paymentHistory.findIndex(
      (payment) => payment.pagoPa?.status === PaymentStatus.REQUIRED
    );
    const requiredPayment = paymentHistory[requiredPaymentIndex];
    mock.onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`).reply(200, notificationDTO);
    // we use regexp to not set the query parameters
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, { result: [] });
    mock.onPost(`/bff/v1/payments/info`, paymentInfoRequest.slice(0, 5)).reply(200, paymentInfo);
    mock
      .onPost(`/bff/v1/payments/cart`, {
        paymentNotice: {
          noticeNumber: requiredPayment.pagoPa?.noticeCode,
          fiscalCode: requiredPayment.pagoPa?.creditorTaxId,
          amount: requiredPayment.pagoPa?.amount,
          companyName: notificationToFe.senderDenomination,
          description: notificationToFe.subject,
        },
        returnUrl: window.location.href,
      })
      .reply(200, {
        checkoutUrl: 'https://mocked-url.com',
      });

    await act(async () => {
      result = render(<NotificationDetail />, {
        preloadedState: {
          userState: { user: { fiscal_number: notificationDTO.recipients[2].taxId } },
        },
      });
    });

    const payButton = result.getByTestId('pay-button');
    const item = result.queryAllByTestId('pagopa-item')[requiredPaymentIndex];
    expect(item).toBeInTheDocument();
    const radioButton = item?.querySelector('[data-testid="radio-button"] input');
    fireEvent.click(radioButton!);
    // after radio button click, there is a timer of 1 second after that the paymeny is enabled
    // wait...
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(payButton).toBeEnabled();
    // we need the act method, because the loading overlay is shown at button click
    await act(async () => {
      fireEvent.click(payButton);
    });
    expect(mock.history.post).toHaveLength(2);
    expect(mock.history.post[0].url).toBe(`/bff/v1/payments/info`);
    expect(mock.history.post[1].url).toBe(`/bff/v1/payments/cart`);
    await vi.waitFor(() => {
      expect(mockAssignFn).toHaveBeenCalledTimes(1);
      expect(mockAssignFn).toHaveBeenCalledWith('https://mocked-url.com');
    });
    vi.useRealTimers();
  });

  it('should not duplicate payments when api call to cart respond with an error', async () => {
    vi.useFakeTimers();
    const paymentHistory = populatePaymentsPagoPaF24(
      notificationToFe.timeline,
      paymentsData.pagoPaF24,
      paymentInfo
    );

    const requiredPaymentIndex = paymentHistory.findIndex(
      (payment) => payment.pagoPa?.status === PaymentStatus.REQUIRED
    );

    const requiredPayment = paymentHistory[requiredPaymentIndex];
    mock.onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`).reply(200, notificationDTO);
    mock.onPost(`/bff/v1/payments/info`, paymentInfoRequest.slice(0, 5)).reply(200, paymentInfo);
    mock
      .onPost(`/bff/v1/payments/cart`, {
        paymentNotice: {
          noticeNumber: requiredPayment.pagoPa?.noticeCode,
          fiscalCode: requiredPayment.pagoPa?.creditorTaxId,
          amount: requiredPayment.pagoPa?.amount,
          companyName: notificationToFe.senderDenomination,
          description: notificationToFe.subject,
        },
        returnUrl: window.location.href,
      })
      .reply(errorMock.status, errorMock.data);

    await act(async () => {
      result = render(<NotificationDetail />, {
        preloadedState: {
          userState: { user: { fiscal_number: notificationDTO.recipients[2].taxId } },
        },
      });
    });

    expect(testStore.getState().notificationState.paymentsData.pagoPaF24.length).toBe(6);

    const payButton = result.getByTestId('pay-button');
    const item = result.queryAllByTestId('pagopa-item')[requiredPaymentIndex];
    expect(item).toBeInTheDocument();
    const radioButton = item?.querySelector('[data-testid="radio-button"] input');
    fireEvent.click(radioButton!);
    // after radio button click, there is a timer of 1 second after that the paymeny is enabled
    // wait...
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(payButton).toBeEnabled();
    // we need the act method, because the loading overlay is shown at button click
    await act(async () => {
      fireEvent.click(payButton);
    });

    const errorMessage = item?.querySelector('[data-testid="generic-error-message"]');
    const reloadButton = item?.querySelector('[data-testid="reload-button"]');

    expect(errorMessage).toBeVisible();
    expect(reloadButton).toBeVisible();
    expect(testStore.getState().notificationState.paymentsData.pagoPaF24.length).toBe(6);

    vi.useRealTimers();
  });

  it('should show correct paginated payments', async () => {
    let paginationData = {
      page: 0,
      size: 5,
      totalElements: notificationDTO.recipients[2].payments?.length,
    };
    mock.onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`).reply(200, notificationDTO);
    // we use regexp to not set the query parameters
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, { result: [] });
    mock
      .onPost(`/bff/v1/payments/info`, paymentInfoRequest.slice(0, paginationData.size))
      .reply(200, paymentInfo.slice(0, paginationData.size));

    await act(async () => {
      result = render(<NotificationDetail />, {
        preloadedState: {
          userState: { user: { fiscal_number: notificationDTO.recipients[2].taxId } },
        },
      });
    });

    // check that the first 5 payments are shown
    const pagoPaItems = result.queryAllByTestId('pagopa-item');
    expect(pagoPaItems).toHaveLength(5);

    const pageSelector = result.getByTestId('pageSelector');
    const pageButtons = pageSelector?.querySelectorAll('button');
    // the buttons are < 1 2 >
    fireEvent.click(pageButtons[2]);
    paginationData = {
      ...paginationData,
      page: 1,
    };
    const paymentCache = getPaymentCache(notificationDTO.iun);
    expect(paymentCache?.currentPaymentPage).toBe(paginationData.page);

    // intercept the next request
    const secondPagePaymentInfoRequest = paymentInfoRequest.slice(
      paginationData.page * paginationData.size,
      (paginationData.page + 1) * paginationData.size
    );

    mock
      .onPost(`/bff/v1/payments/info`, secondPagePaymentInfoRequest)
      .reply(
        200,
        paymentInfo.slice(
          paginationData.page * paginationData.size,
          (paginationData.page + 1) * paginationData.size
        )
      );

    await waitFor(() => {
      expect(mock.history.post).toHaveLength(2);
    });

    // check that the other payments are shown
    const secondPageItems = result.queryAllByTestId('pagopa-item');
    expect(secondPageItems).toHaveLength(secondPagePaymentInfoRequest.length);
  });

  it('should load payments from cache when reloading the page, so it does not make the same request twice', async () => {
    let pagoPaItems: HTMLElement[] | undefined;
    mock.onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`).reply(200, notificationDTO);
    mock.onPost(`/bff/v1/payments/info`, paymentInfoRequest.slice(0, 5)).reply(200, paymentInfo);

    await act(async () => {
      result = render(<NotificationDetail />, {
        preloadedState: {
          userState: { user: { fiscal_number: notificationDTO.recipients[2].taxId } },
        },
      });
    });

    expect(mock.history.post).toHaveLength(1);
    pagoPaItems = result?.queryAllByTestId('pagopa-item');
    expect(pagoPaItems).toHaveLength(5);

    mock.resetHistory();

    await act(async () => {
      result?.rerender(<NotificationDetail />);
    });

    expect(mock.history.post).toHaveLength(0);
    pagoPaItems = result?.queryAllByTestId('pagopa-item');
    expect(pagoPaItems).toHaveLength(5);
  });

  it('should call payment info if reload after 6 minutes', async () => {
    mock.onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`).reply(200, notificationDTO);
    mock.onPost(`/bff/v1/payments/info`, paymentInfoRequest.slice(0, 5)).reply(200, paymentInfo);

    const date = new Date();
    const isoDate = new Date(date.setMinutes(date.getMinutes() - 6)).toISOString();
    const cacheWithOldDate = {
      ...cachedPayments,
      timestamp: isoDate,
    };
    sessionStorage.setItem('payments', JSON.stringify(cacheWithOldDate));

    await act(async () => {
      result = render(<NotificationDetail />, {
        preloadedState: {
          userState: { user: { fiscal_number: notificationDTO.recipients[2].taxId } },
        },
      });
    });

    expect(mock.history.post).toHaveLength(1);
    expect(mock.history.post[0].url).toBe(`/bff/v1/payments/info`);
  });

  it('should fetch only currentPayment if is present in cache', async () => {
    const currentPayment = {
      creditorTaxId: paymentsData.pagoPaF24[0].pagoPa?.creditorTaxId ?? '',
      noticeCode: paymentsData.pagoPaF24[0].pagoPa?.noticeCode ?? '',
    };

    setPaymentCache(
      {
        ...cachedPayments,
        currentPayment,
      },
      notificationDTO.iun
    );

    mock.onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`).reply(200, notificationDTO);
    mock
      .onPost(`/bff/v1/payments/info`, [
        {
          creditorTaxId: paymentsData.pagoPaF24[0].pagoPa?.creditorTaxId,
          noticeCode: paymentsData.pagoPaF24[0].pagoPa?.noticeCode,
        },
      ])
      .reply(200, paymentInfo.slice(0, 1));

    await act(async () => {
      result = render(<NotificationDetail />, {
        preloadedState: {
          userState: { user: { fiscal_number: notificationDTO.recipients[2].taxId } },
        },
      });
    });

    expect(mock.history.post).toHaveLength(1);
    expect(mock.history.post[0].url).toBe(`/bff/v1/payments/info`);
    const paymentCache = getPaymentCache(notificationDTO.iun);
    expect(paymentCache?.currentPayment).toBeUndefined();
  });

  it('render success alert when documents have been retrieved', async () => {
    mock
      .onGet(`/bff/v1/notifications/received/${raddNotificationDTO.iun}`)
      .reply(200, raddNotificationDTO);
    await act(async () => {
      result = render(<NotificationDetail />, {
        preloadedState: {
          userState: { user: { fiscal_number: raddNotificationDTO.recipients[2].taxId } },
        },
      });
    });

    const alertRadd = result.getByTestId('raddAlert');
    expect(alertRadd).toBeInTheDocument();
    expect(alertRadd).toHaveTextContent('detail.timeline.radd.title');
  });

  it('should show pay tpp button after call check-tpp api with retrievalId in user token', async () => {
    const mockRetrievalId = 'retrieval-id';
    mock.onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`).reply(200, notificationDTO);
    mock
      .onGet(`/bff/v1/notifications/received/check-tpp?retrievalId=${mockRetrievalId}`)
      .reply(200, {
        originId: notificationDTO.iun,
        retrievalId: mockRetrievalId,
        paymentButton: 'MOCK BANK',
      } as BffCheckTPPResponse);

    await act(async () => {
      result = render(<NotificationDetail />, {
        preloadedState: {
          userState: {
            user: {
              fiscal_number: notificationDTO.recipients[2].taxId,
              source: {
                channel: 'TPP',
                details: 'mock-tpp-id',
                retrievalId: mockRetrievalId,
              },
            },
          },
        },
      });
    });

    expect(
      mock.history.get.find(({ url }) => url?.includes('bff/v1/notifications/received/check-tpp'))
    ).toBeDefined();
    const tppPayButton = await waitFor(() => result.getByTestId('tpp-pay-button'));
    expect(tppPayButton).toBeInTheDocument();
    expect(tppPayButton).toHaveTextContent('MOCK BANK');
  });

  it('should show AccessDenied component when user is not authorized to see the notification', async () => {
    const unauthorizedError = {
      status: 404,
      data: {
        errors: [
          {
            code: ServerResponseErrorCode.PN_DELIVERY_USER_ID_NOT_RECIPIENT_OR_DELEGATOR,
          },
        ],
      },
    };

    mock
      .onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`)
      .reply(unauthorizedError.status, unauthorizedError.data);

    await act(async () => {
      result = render(<NotificationDetail />, {
        preloadedState: {
          userState: {
            user: {
              fiscal_number: notificationDTO.recipients[0].taxId,
              source: {
                channel: 'TPP',
                details: 'mock-tpp-id',
                retrievalId: 'retrieval-id',
              },
            },
          },
        },
      });
    });

    await waitFor(() => {
      expect(screen.getByText('from-tpp.not-found')).toBeInTheDocument();
    });

    const accessDeniedComponent = screen.getByText('from-tpp.not-found');
    expect(accessDeniedComponent).toBeInTheDocument();

    const subtitle = screen.getByText('from-tpp.not-found-subtitle');
    expect(subtitle).toBeInTheDocument();

    const homeButton = screen.getByRole('button');
    fireEvent.click(homeButton);

    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(routes.NOTIFICHE, { replace: true });
  });
});
