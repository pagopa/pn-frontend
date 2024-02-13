import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import {
  AppResponseMessage,
  DOWNTIME_HISTORY,
  DOWNTIME_LEGAL_FACT_DETAILS,
  LegalFactId,
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

import { downtimesDTO, simpleDowntimeLogPage } from '../../__mocks__/AppStatus.mock';
import { arrayOfDelegators } from '../../__mocks__/Delegations.mock';
import { paymentInfo } from '../../__mocks__/ExternalRegistry.mock';
import {
  cachedPayments,
  notificationDTO,
  notificationToFe,
  paymentsData,
} from '../../__mocks__/NotificationDetail.mock';
import {
  RenderResult,
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '../../__test__/test-utils';
import {
  NOTIFICATION_DETAIL,
  NOTIFICATION_DETAIL_DOCUMENTS,
  NOTIFICATION_DETAIL_LEGALFACT,
  NOTIFICATION_DETAIL_OTHER_DOCUMENTS,
  NOTIFICATION_PAYMENT_INFO,
  NOTIFICATION_PAYMENT_URL,
} from '../../api/notifications/notifications.routes';
import * as routes from '../../navigation/routes.const';
import { NOTIFICATION_ACTIONS } from '../../redux/notification/actions';
import NotificationDetail from '../NotificationDetail.page';

const mockNavigateFn = vi.fn();
let mockIsDelegate = false;
let mockIsFromQrCode = false;
const mockAssignFn = vi.fn();

// mock imports
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useParams: () =>
    mockIsDelegate
      ? { id: 'DAPQ-LWQV-DKQH-202308-A-1', mandateId: '5' }
      : { id: 'DAPQ-LWQV-DKQH-202308-A-1' },
  useNavigate: () => mockNavigateFn,
  useLocation: () => ({ state: { fromQrCode: mockIsFromQrCode }, pathname: '/' }),
}));

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'it' },
  }),
}));

const getLegalFactIds = (notification: NotificationDetailModel, recIndex: number) => {
  const timelineElementDigitalSuccessWorkflow = notification.timeline.filter(
    (t) => t.category === TimelineCategory.NOTIFICATION_VIEWED && t.details.recIndex === recIndex
  )[0];
  return timelineElementDigitalSuccessWorkflow.legalFactsIds![0] as LegalFactId;
};

const delegator = arrayOfDelegators.find(
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
  // this is needed because there is a bug when vi.mock is used
  // https://github.com/vitest-dev/vitest/issues/3300
  // maybe with vitest 1, we can remove the workaround
  const apiClients = await import('../../api/apiClients');

  beforeAll(() => {
    mock = new MockAdapter(apiClients.apiClient);
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href: '', assign: mockAssignFn },
    });
  });

  afterEach(() => {
    sessionStorage.removeItem(PAYMENT_CACHE_KEY);
    vi.clearAllMocks();
    mock.reset();
    mockIsFromQrCode = false;
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
    mock.onGet(NOTIFICATION_DETAIL(notificationDTO.iun)).reply(200, notificationDTO);
    mock.onPost(NOTIFICATION_PAYMENT_INFO(), paymentInfoRequest).reply(200, paymentInfo);
    // we use regexp to not set the query parameters
    mock.onGet(new RegExp(DOWNTIME_HISTORY({ startDate: '' }))).reply(200, downtimesDTO);
    await act(async () => {
      result = render(<NotificationDetail />, {
        preloadedState: {
          userState: { user: { fiscal_number: notificationDTO.recipients[2].taxId } },
        },
      });
    });
    expect(mock.history.get).toHaveLength(2);
    expect(mock.history.get[0].url).toContain('/notifications/received');
    expect(mock.history.post[0].url).toBe(NOTIFICATION_PAYMENT_INFO());
    expect(mock.history.get[1].url).toContain('/downtime/v1/history');
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
    mock.onGet(NOTIFICATION_DETAIL(notificationDTO.iun)).reply(200, {
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
    mock.onGet(new RegExp(DOWNTIME_HISTORY({ startDate: '' }))).reply(200, downtimesDTO);
    await act(async () => {
      result = render(<NotificationDetail />, {
        preloadedState: {
          userState: { user: { fiscal_number: notificationDTO.recipients[2].taxId } },
        },
      });
    });
    expect(mock.history.get).toHaveLength(2);
    expect(mock.history.get[0].url).toContain('/notifications/received');
    expect(mock.history.get[1].url).toContain('/downtime/v1/history');
    // check documents box
    const notificationDetailDocumentsMessage = result.getAllByTestId('documentsMessage');
    for (const notificationDetailDocumentMessage of notificationDetailDocumentsMessage) {
      expect(notificationDetailDocumentMessage).toHaveTextContent(
        /detail.acts_files.notification_cancelled_aar|detail.acts_files.notification_cancelled_acts/
      );
    }
  });

  it('checks not available documents', async () => {
    mock.onGet(NOTIFICATION_DETAIL(notificationDTO.iun)).reply(200, {
      ...notificationDTO,
      documentsAvailable: false,
      sentAt: '2012-01-01T00:00:00Z',
    });
    mock.onPost(NOTIFICATION_PAYMENT_INFO(), paymentInfoRequest).reply(200, paymentInfo);
    // we use regexp to not set the query parameters
    mock.onGet(new RegExp(DOWNTIME_HISTORY({ startDate: '' }))).reply(200, downtimesDTO);
    await act(async () => {
      result = render(<NotificationDetail />, {
        preloadedState: {
          userState: { user: { fiscal_number: notificationDTO.recipients[2].taxId } },
        },
      });
    });
    expect(mock.history.get).toHaveLength(2);
    expect(mock.history.post).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/notifications/received');
    expect(mock.history.get[1].url).toContain('/downtime/v1/history');
    expect(mock.history.post[0].url).toBe(NOTIFICATION_PAYMENT_INFO());
    // check documents box
    const notificationDetailDocumentsMessage = result.getAllByTestId('documentsMessage');
    for (const notificationDetailDocumentMessage of notificationDetailDocumentsMessage) {
      expect(notificationDetailDocumentMessage).toHaveTextContent(
        /detail.acts_files.not_downloadable_aar|detail.acts_files.not_downloadable_acts/
      );
    }
  });

  it('checks not available payment', async () => {
    mock.onGet(NOTIFICATION_DETAIL(notificationDTO.iun)).reply(200, {
      ...notificationDTO,
      recipients: [
        { ...notificationDTO.recipients[2], payment: { creditorTaxId: null, noticeCode: null } },
      ],
    });
    // we use regexp to not set the query parameters
    mock.onGet(new RegExp(DOWNTIME_HISTORY({ startDate: '' }))).reply(200, downtimesDTO);
    await act(async () => {
      result = render(<NotificationDetail />);
    });
    // check payment box
    const paymentData = result.queryByTestId('paymentData');
    expect(paymentData).not.toBeInTheDocument();
  });

  it('executes the document download handler', async () => {
    mock.onGet(NOTIFICATION_DETAIL(notificationDTO.iun)).reply(200, notificationDTO);
    mock.onPost(NOTIFICATION_PAYMENT_INFO(), paymentInfoRequest).reply(200, paymentInfo);
    // we use regexp to not set the query parameters
    mock.onGet(new RegExp(DOWNTIME_HISTORY({ startDate: '' }))).reply(200, downtimesDTO);
    mock.onGet(NOTIFICATION_DETAIL_DOCUMENTS(notificationToFe.iun, '0')).reply(200, {
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
        `/delivery/notifications/received/${notificationToFe.iun}/attachments/documents/0`
      );
    });
    await waitFor(() => {
      expect(window.location.href).toBe('https://mocked-url.com');
    });
  });

  it('executes the legal fact download handler', async () => {
    mock.onGet(NOTIFICATION_DETAIL(notificationDTO.iun)).reply(200, notificationDTO);
    mock.onPost(NOTIFICATION_PAYMENT_INFO(), paymentInfoRequest).reply(200, paymentInfo);
    // we use regexp to not set the query parameters
    mock.onGet(new RegExp(DOWNTIME_HISTORY({ startDate: '' }))).reply(200, downtimesDTO);
    mock.onGet(NOTIFICATION_DETAIL_LEGALFACT(notificationToFe.iun, mockLegalIds)).reply(200, {
      retryAfter: 1,
    });
    await act(async () => {
      result = render(<NotificationDetail />, {
        preloadedState: {
          userState: { user: { fiscal_number: notificationDTO.recipients[2].taxId } },
        },
      });
    });
    expect(mock.history.get).toHaveLength(2);
    const legalFactButton = result.getAllByTestId('download-legalfact');
    fireEvent.click(legalFactButton[0]);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(3);
      expect(mock.history.get[2].url).toContain(
        `/delivery-push/${notificationToFe.iun}/legal-facts/${mockLegalIds.category}/${mockLegalIds.key}`
      );
    });
    window.location.href = '';
    const docNotAvailableAlert = await waitFor(() => result.getByTestId('docNotAvailableAlert'));
    expect(docNotAvailableAlert).toBeInTheDocument();
    mock.onGet(NOTIFICATION_DETAIL_LEGALFACT(notificationToFe.iun, mockLegalIds)).reply(200, {
      filename: 'mocked-filename',
      contentLength: 1000,
      retryAfter: null,
      url: 'https://mocked-url-com',
    });
    // simulate that legal fact is now available
    await act(async () => {
      await new Promise((r) => setTimeout(r, 1000));
    });
    expect(docNotAvailableAlert).not.toBeInTheDocument();
    fireEvent.click(legalFactButton[0]);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(4);
      expect(mock.history.get[3].url).toContain(
        `/delivery-push/${notificationToFe.iun}/legal-facts/${mockLegalIds.category}/${mockLegalIds.key}`
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
    };
    mock.onGet(NOTIFICATION_DETAIL(notificationDTO.iun)).reply(200, notificationDTO);
    mock.onPost(NOTIFICATION_PAYMENT_INFO(), paymentInfoRequest).reply(200, paymentInfo);
    // we use regexp to not set the query parameters
    mock.onGet(new RegExp(DOWNTIME_HISTORY({ startDate: '' }))).reply(200, downtimesDTO);
    mock
      .onGet(NOTIFICATION_DETAIL_OTHER_DOCUMENTS(notificationToFe.iun, otherDocument))
      .reply(200, {
        retryAfter: 1,
      });
    await act(async () => {
      result = render(<NotificationDetail />, {
        preloadedState: {
          userState: { user: { fiscal_number: notificationDTO.recipients[2].taxId } },
        },
      });
    });
    expect(mock.history.get).toHaveLength(2);
    const AARBox = result.getByTestId('aarBox');
    const AARButton = within(AARBox).getByTestId('documentButton');
    fireEvent.click(AARButton);

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(3);
      expect(mock.history.get[2].url).toContain(
        `/delivery-push/${notificationToFe.iun}/document/AAR`
      );
    });

    const docNotAvailableAlert = await waitFor(() => result.getByTestId('docNotAvailableAlert'));
    expect(docNotAvailableAlert).toBeInTheDocument();
    mock
      .onGet(NOTIFICATION_DETAIL_OTHER_DOCUMENTS(notificationToFe.iun, otherDocument))
      .reply(200, {
        filename: 'mocked-filename',
        contentLength: 1000,
        retryAfter: null,
        url: 'https://mocked-aar-com',
      });
    //simulate that legal fact is now available
    await act(async () => {
      await new Promise((r) => setTimeout(r, 1000));
    });
    expect(docNotAvailableAlert).not.toBeInTheDocument();
    fireEvent.click(AARButton);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(4);
      expect(mock.history.get[3].url).toContain(
        `/delivery-push/${notificationToFe.iun}/document/AAR`
      );
    });
    await waitFor(() => {
      expect(window.location.href).toBe('https://mocked-aar-com');
    });
  });

  it('executes the downtimws legal fact download handler', async () => {
    mock.onGet(NOTIFICATION_DETAIL(notificationDTO.iun)).reply(200, notificationDTO);
    mock.onPost(NOTIFICATION_PAYMENT_INFO(), paymentInfoRequest).reply(200, paymentInfo);
    // we use regexp to not set the query parameters
    mock.onGet(new RegExp(DOWNTIME_HISTORY({ startDate: '' }))).reply(200, downtimesDTO);
    mock
      .onGet(DOWNTIME_LEGAL_FACT_DETAILS(simpleDowntimeLogPage.downtimes[0].legalFactId!))
      .reply(200, {
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
        `/downtime/v1/legal-facts/${simpleDowntimeLogPage.downtimes[0].legalFactId}`
      );
    });
    await waitFor(() => {
      expect(window.location.href).toBe('https://mocked-url-com');
    });
  });

  it('normal navigation - includes back button', async () => {
    mock.onGet(NOTIFICATION_DETAIL(notificationDTO.iun)).reply(200, notificationDTO);
    mock.onPost(NOTIFICATION_PAYMENT_INFO(), paymentInfoRequest).reply(200, paymentInfo);
    // we use regexp to not set the query parameters
    mock.onGet(new RegExp(DOWNTIME_HISTORY({ startDate: '' }))).reply(200, downtimesDTO);
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
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(routes.NOTIFICHE);
  });

  it('navigation from QR code - does not include back button', async () => {
    mockIsFromQrCode = true;
    mock.onGet(NOTIFICATION_DETAIL(notificationDTO.iun)).reply(200, notificationDTO);
    mock.onGet(NOTIFICATION_PAYMENT_INFO(), paymentInfoRequest).reply(200, paymentInfo);
    // we use regexp to not set the query parameters
    mock.onGet(new RegExp(DOWNTIME_HISTORY({ startDate: '' }))).reply(200, downtimesDTO);
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
    mock.onGet(NOTIFICATION_DETAIL(notificationDTO.iun)).reply(500);
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
      .onGet(NOTIFICATION_DETAIL(notificationDTO.iun, delegator?.mandateId))
      .reply(200, notificationDTO);
    mock.onPost(NOTIFICATION_PAYMENT_INFO(), paymentInfoRequest).reply(200, paymentInfo);
    // we use regexp to not set the query parameters
    mock.onGet(new RegExp(DOWNTIME_HISTORY({ startDate: '' }))).reply(200, downtimesDTO);
    await act(async () => {
      result = render(<NotificationDetail />, {
        preloadedState: {
          userState: { user: { fiscal_number: 'CGNNMO80A03H501U' } },
          generalInfoState: {
            delegators: arrayOfDelegators,
          },
        },
      });
    });
    // when a delegator sees a notification, we expect that he sees the same things that sees the recipient except the disclaimer
    expect(mock.history.get).toHaveLength(2);
    expect(mock.history.get[0].url).toContain('/notifications/received');
    expect(mock.history.post[0].url).toBe(NOTIFICATION_PAYMENT_INFO());
    expect(mock.history.get[1].url).toContain('/downtime/v1/history');
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
      .onGet(NOTIFICATION_DETAIL(notificationDTO.iun, delegator?.mandateId))
      .reply(200, notificationDTO);
    mock.onPost(NOTIFICATION_PAYMENT_INFO(), paymentInfoRequest).reply(200, paymentInfo);
    // we use regexp to not set the query parameters
    mock.onGet(new RegExp(DOWNTIME_HISTORY({ startDate: '' }))).reply(200, downtimesDTO);
    await act(async () => {
      result = render(<NotificationDetail />, {
        preloadedState: {
          userState: { user: { fiscal_number: 'CGNNMO80A03H501U' } },
          generalInfoState: {
            delegators: arrayOfDelegators,
            defaultAddresses: [],
          },
        },
      });
    });
    const backButton = result.getByTestId('breadcrumb-indietro-button');
    expect(backButton).toBeInTheDocument();
    fireEvent.click(backButton);
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(
      routes.GET_NOTIFICHE_DELEGATO_PATH(delegator?.mandateId!)
    );
  });

  // TO-FIX: il test fallisce perchè fakeTimers non funziona bene con waitFor
  it.skip('should dispatch getNotificationPaymentUrl on pay button click', async () => {
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
    mock.onGet(NOTIFICATION_DETAIL(notificationDTO.iun)).reply(200, notificationDTO);
    // we use regexp to not set the query parameters
    mock.onGet(new RegExp(DOWNTIME_HISTORY({ startDate: '' }))).reply(200, { result: [] });
    mock
      .onPost(NOTIFICATION_PAYMENT_INFO(), paymentInfoRequest.slice(0, 5))
      .reply(200, paymentInfo);
    mock
      .onPost(NOTIFICATION_PAYMENT_URL(), {
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
    fireEvent.click(payButton);
    expect(mock.history.post).toHaveLength(2);
    expect(mock.history.post[0].url).toBe(NOTIFICATION_PAYMENT_INFO());
    expect(mock.history.post[1].url).toBe(NOTIFICATION_PAYMENT_URL());
    await waitFor(() => {
      expect(mockAssignFn).toBeCalledTimes(1);
      expect(mockAssignFn).toBeCalledWith('https://mocked-url.com');
    });
    vi.useRealTimers();
  });

  it('should show correct paginated payments', async () => {
    let paginationData = {
      page: 0,
      size: 5,
      totalElements: notificationDTO.recipients[2].payments?.length,
    };
    mock.onGet(NOTIFICATION_DETAIL(notificationDTO.iun)).reply(200, notificationDTO);
    // we use regexp to not set the query parameters
    mock.onGet(new RegExp(DOWNTIME_HISTORY({ startDate: '' }))).reply(200, { result: [] });
    mock
      .onPost(NOTIFICATION_PAYMENT_INFO(), paymentInfoRequest.slice(0, paginationData.size))
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
      .onPost(NOTIFICATION_PAYMENT_INFO(), secondPagePaymentInfoRequest)
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
    mock.onGet(NOTIFICATION_DETAIL(notificationDTO.iun)).reply(200, notificationDTO);
    mock
      .onPost(NOTIFICATION_PAYMENT_INFO(), paymentInfoRequest.slice(0, 5))
      .reply(200, paymentInfo);

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
    mock.onGet(NOTIFICATION_DETAIL(notificationDTO.iun)).reply(200, notificationDTO);
    mock
      .onPost(NOTIFICATION_PAYMENT_INFO(), paymentInfoRequest.slice(0, 5))
      .reply(200, paymentInfo);

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
    expect(mock.history.post[0].url).toBe(NOTIFICATION_PAYMENT_INFO());
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

    mock.onGet(NOTIFICATION_DETAIL(notificationDTO.iun)).reply(200, notificationDTO);
    mock
      .onPost(NOTIFICATION_PAYMENT_INFO(), [
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
    expect(mock.history.post[0].url).toBe(NOTIFICATION_PAYMENT_INFO());
    const paymentCache = getPaymentCache(notificationDTO.iun);
    expect(paymentCache?.currentPayment).toBeUndefined();
  });

  it('render success alert when documents have been picked up', async () => {
    mock
      .onGet(NOTIFICATION_DETAIL(notificationDTO.iun))
      .reply(200, { ...notificationDTO, radd: true });
    await act(async () => {
      result = render(<NotificationDetail />);
    });

    const alertRadd = result.getAllByTestId('raddAlert')[0];
    expect(alertRadd).toBeInTheDocument();
    expect(alertRadd).toHaveTextContent('detail.timeline.radd.title');
  });
});
