import MockAdapter from 'axios-mock-adapter';
import { Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

import {
  AppMessage,
  AppResponseMessage,
  DeliveryOutcomeType,
  NotificationDetail as NotificationDetailModel,
  NotificationDetailOtherDocument,
  NotificationFeePolicy,
  NotificationStatus,
  PAYMENT_CACHE_KEY,
  PagoPaIntegrationMode,
  PaymentStatus,
  ResponseEventDispatcher,
  StatusHistoryParser,
  TimelineCategory,
  formatDate,
  getPaymentCache,
  populatePaymentsPagoPaF24,
  setPaymentCache,
} from '@pagopa-pn/pn-commons';

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
import { adminUser, adminUserWithGroup, operatorUser } from '../../__mocks__/User.mock';
import {
  RenderResult,
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import * as routes from '../../navigation/routes.const';
import { NOTIFICATION_ACTIONS } from '../../redux/notification/actions';
import { getConfiguration } from '../../services/configuration.service';
import NotificationDetail from '../NotificationDetail.page';

const mockAssignFn = vi.fn();

const pfRecipient = notificationDTO.recipients[0];
const pgRecipient = notificationDTO.recipients[1];

const Component = () => (
  <Routes>
    <Route path={routes.DETTAGLIO_NOTIFICA} element={<NotificationDetail />} />
    <Route path={routes.DETTAGLIO_NOTIFICA_DELEGATO} element={<NotificationDetail />} />
  </Routes>
);

const getLegalFactIds = (notification: NotificationDetailModel, recIndex: number) => {
  const timelineElementDigitalSuccessWorkflow = notification.timeline.find(
    (t) =>
      t.category === TimelineCategory.SEND_ANALOG_PROGRESS &&
      t.legalFactsIds &&
      t.legalFactsIds?.length > 0 &&
      t.details.recIndex === recIndex
  );
  return timelineElementDigitalSuccessWorkflow!.legalFactsIds![0];
};

const delegator = mandatesByDelegate.find(
  (delegator) => delegator.delegator?.fiscalCode === pgRecipient.taxId
);

/*
ATTENZIONE: un'evenutale modifica al mock potrebbe causare il fallimento di alcuni test
*/
describe('NotificationDetail Page', async () => {
  let result: RenderResult;
  let mock: MockAdapter;
  const mockLegalIds = getLegalFactIds(notificationToFe, 1);
  const original = globalThis.location;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
    Object.defineProperty(globalThis, 'location', {
      configurable: true,
      value: { href: '', assign: mockAssignFn },
    });
  });

  afterEach(() => {
    sessionStorage.removeItem(PAYMENT_CACHE_KEY);
    vi.clearAllMocks();
    mock.reset();
    globalThis.location.href = '';
  });

  afterAll(() => {
    mock.restore();
    Object.defineProperty(globalThis, 'location', { configurable: true, value: original });
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
      result = render(<Component />, {
        preloadedState: { userState: { user: adminUser } },
        route: routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun),
      });
    });
    expect(mock.history.get).toHaveLength(2);
    expect(mock.history.post).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/bff/v1/notifications/received');
    expect(mock.history.get[1].url).toContain('/bff/v1/downtime/history');
    expect(mock.history.post[0].url).toBe(`/bff/v1/payments/info`);
    expect(result?.getByTestId('breadcrumb-link')).toHaveTextContent(/detail.breadcrumb-root/i);
    expect(result?.container).toHaveTextContent(notificationToFe.abstract!);
    // check summary table
    const notificationDetailTable = result?.getByTestId('notificationDetailTable');
    expect(notificationDetailTable).toBeInTheDocument();
    const tableRows = notificationDetailTable?.querySelectorAll('tr');
    expect(tableRows[0]).toHaveTextContent(`detail.sender${notificationToFe.senderDenomination}`);
    expect(tableRows[1]).toHaveTextContent(`detail.recipient${pgRecipient.denomination}`);
    expect(tableRows[2]).toHaveTextContent(`detail.date${formatDate(notificationToFe.sentAt)}`);
    expect(tableRows[3]).toHaveTextContent(`detail.iun${notificationToFe.iun}`);
    // check documents box
    const notificationDetailDocuments = result?.getAllByTestId('notificationDetailDocuments');
    expect(notificationDetailDocuments).toHaveLength(
      notificationToFe.documents.length + notificationToFe.otherDocuments?.length!
    );
    const notificationDetailDocumentsMessage = result?.getAllByTestId('documentsMessage');
    for (const notificationDetailDocumentMessage of notificationDetailDocumentsMessage) {
      expect(notificationDetailDocumentMessage).toHaveTextContent(
        /detail.acts_files.downloadable_aar|detail.acts_files.downloadable_acts/
      );
    }
    // check timeline box
    const NotificationDetailTimeline = result?.getByTestId('NotificationDetailTimeline');
    expect(NotificationDetailTimeline).toBeInTheDocument();
    // check payment box
    const paymentData = result?.getByTestId('paymentInfoBox');
    expect(paymentData).toBeInTheDocument();
    // check downtimes box
    const downtimesBox = result?.getByTestId('downtimesBox');
    expect(downtimesBox).toBeInTheDocument();
    // check domicile banner
    const addDomicileBanner = result?.getByTestId('addDomicileBanner');
    expect(addDomicileBanner).toBeInTheDocument();
  });

  it('renders NotificationCostBanner - ASYNC and single recipient - admin user', async () => {
    const asyncSingleRecipientDTO = {
      ...notificationDTO,
      notificationFeePolicy: NotificationFeePolicy.DeliveryMode,
      pagoPaIntMode: PagoPaIntegrationMode.Async,
      recipients: [pgRecipient],
    };

    mock
      .onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`)
      .reply(200, asyncSingleRecipientDTO);
    mock.onPost(`/bff/v1/payments/info`, paymentInfoRequest).reply(200, paymentInfo);
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);

    await act(async () => {
      result = render(<Component />, {
        preloadedState: {
          userState: { user: adminUser },
        },
        route: routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun),
      });
    });

    expect(result.getByTestId('notificationCostBanner')).toBeInTheDocument();
    expect(result.getByText('notification-cost-banner.enable-sercq.cta')).toBeInTheDocument();
    expect(result.queryByTestId('addDomicileBanner')).not.toBeInTheDocument();

    // the banner should only show the "enable-sercq" CTA and no close button
    const banner = result.getByTestId('notificationCostBanner');
    const bannerButtons = within(banner).queryAllByRole('button');

    expect(bannerButtons).toHaveLength(1);
    expect(bannerButtons[0]).toHaveTextContent('notification-cost-banner.enable-sercq.cta');
  });

  it('renders NotificationCostBanner - ASYNC and single recipient - operator user', async () => {
    const asyncSingleRecipientDTO = {
      ...notificationDTO,
      notificationFeePolicy: NotificationFeePolicy.DeliveryMode,
      pagoPaIntMode: PagoPaIntegrationMode.Async,
      recipients: [pgRecipient],
    };

    mock
      .onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`)
      .reply(200, asyncSingleRecipientDTO);
    mock.onPost(`/bff/v1/payments/info`, paymentInfoRequest).reply(200, paymentInfo);
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);

    await act(async () => {
      result = render(<Component />, {
        preloadedState: {
          userState: { user: operatorUser },
        },
        route: routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun),
      });
    });

    expect(result.getByTestId('notificationCostBanner')).toBeInTheDocument();
    expect(result.queryByText('notification-cost-banner.enable-sercq.cta')).not.toBeInTheDocument();
    expect(result.queryByTestId('addDomicileBanner')).not.toBeInTheDocument();
  });

  it('does not render NotificationCostBanner when notificationFeePolicy is DELIVERY_MODE but pagoPaIntMode is not ASYNC', async () => {
    const dto = {
      ...notificationDTO,
      notificationFeePolicy: NotificationFeePolicy.DeliveryMode,
      pagoPaIntMode: PagoPaIntegrationMode.Sync,
      recipients: [pgRecipient],
    };

    mock.onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`).reply(200, dto);
    mock.onPost(`/bff/v1/payments/info`, paymentInfoRequest).reply(200, paymentInfo);
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);

    await act(async () => {
      result = render(<Component />, {
        preloadedState: {
          userState: { user: adminUser },
        },
        route: routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun),
      });
    });

    expect(result.queryByTestId('notificationCostBanner')).not.toBeInTheDocument();
    expect(result.getByTestId('addDomicileBanner')).toBeInTheDocument();
  });

  it('does not render NotificationCostBanner when pagoPaIntMode is ASYNC but notificationFeePolicy is not DELIVERY_MODE', async () => {
    const dto = {
      ...notificationDTO,
      notificationFeePolicy: NotificationFeePolicy.FlatRate,
      pagoPaIntMode: PagoPaIntegrationMode.Async,
      recipients: [pgRecipient],
    };

    mock.onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`).reply(200, dto);
    mock.onPost(`/bff/v1/payments/info`, paymentInfoRequest).reply(200, paymentInfo);
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);

    await act(async () => {
      result = render(<Component />, {
        preloadedState: {
          userState: { user: adminUser },
        },
        route: routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun),
      });
    });

    expect(result.queryByTestId('notificationCostBanner')).not.toBeInTheDocument();
    expect(result.getByTestId('addDomicileBanner')).toBeInTheDocument();
  });

  it('renders pec unreachable alert - SIMPLE_REGISTERED_LETTER and ASYNC', async () => {
    const asyncSingleRecipientDTO = {
      ...notificationDTO,
      notificationFeePolicy: NotificationFeePolicy.DeliveryMode,
      pagoPaIntMode: PagoPaIntegrationMode.Async,
      recipients: [pgRecipient],
    };

    const spy = vi.spyOn(StatusHistoryParser, 'parse').mockReturnValue({
      resolveDeliveryOutcome: () => ({ type: DeliveryOutcomeType.DIGITAL_FAILURE }),
      hasViewedStatus: () => true,
      hasSimpleRegisteredLetter: () => true,
    } as any);

    mock
      .onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`)
      .reply(200, asyncSingleRecipientDTO);
    mock.onPost(`/bff/v1/payments/info`, paymentInfoRequest).reply(200, paymentInfo);
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);

    await act(async () => {
      result = render(<Component />, {
        preloadedState: {
          userState: { user: adminUser },
        },
        route: routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun),
      });
    });

    expect(result.getByTestId('notificationCostBanner')).toBeInTheDocument();
    expect(result.getByTestId('pecUnreachableAlertText')).toBeInTheDocument();

    spy.mockRestore();
  });

  it('does not render pec unreachable alert - SIMPLE_REGISTERED_LETTER and not ASYNC', async () => {
    const spy = vi.spyOn(StatusHistoryParser, 'parse').mockReturnValue({
      resolveDeliveryOutcome: () => ({ type: DeliveryOutcomeType.DIGITAL_FAILURE }),
      hasViewedStatus: () => true,
      hasSimpleRegisteredLetter: () => true,
    } as any);

    mock.onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`).reply(200, notificationDTO);
    mock.onPost(`/bff/v1/payments/info`, paymentInfoRequest).reply(200, paymentInfo);
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);

    await act(async () => {
      result = render(<Component />, {
        preloadedState: {
          userState: { user: adminUser },
        },
        route: routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun),
      });
    });

    expect(result.queryByTestId('pecUnreachableAlertText')).not.toBeInTheDocument();

    spy.mockRestore();
  });

  it('does not render NotificationCostBanner when notification is cancelled', async () => {
    const cancelledAsyncSingleRecipientDTO = {
      ...notificationDTO,
      notificationFeePolicy: NotificationFeePolicy.DeliveryMode,
      pagoPaIntMode: PagoPaIntegrationMode.Async,
      recipients: [pgRecipient],
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
    };

    mock
      .onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`)
      .reply(200, cancelledAsyncSingleRecipientDTO);
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);

    await act(async () => {
      result = render(<Component />, {
        preloadedState: {
          userState: { user: adminUser },
        },
        route: routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun),
      });
    });

    expect(result.queryByTestId('notificationCostBanner')).not.toBeInTheDocument();
    expect(result.queryByTestId('addDomicileBanner')).not.toBeInTheDocument();
  });

  it('does not render DomicileBanner when not viewed', async () => {
    const spy = vi.spyOn(StatusHistoryParser, 'parse').mockReturnValue({
      resolveDeliveryOutcome: () => null,
      hasViewedStatus: () => false,
      hasSimpleRegisteredLetter: () => false,
    } as any);

    mock.onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`).reply(200, notificationDTO);
    mock.onPost(`/bff/v1/payments/info`, paymentInfoRequest).reply(200, paymentInfo);
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);

    await act(async () => {
      result = render(<Component />, {
        preloadedState: {
          userState: { user: adminUser },
        },
        route: routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun),
      });
    });

    expect(result.queryByTestId('addDomicileBanner')).not.toBeInTheDocument();
    expect(result.queryByTestId('notificationCostBanner')).not.toBeInTheDocument();

    spy.mockRestore();
  });

  it('renders DomicileBanner when viewed and not NotificationCostBanner - admin user', async () => {
    const spy = vi.spyOn(StatusHistoryParser, 'parse').mockReturnValue({
      resolveDeliveryOutcome: () => ({ type: DeliveryOutcomeType.VIEWED }),
      hasViewedStatus: () => true,
      hasSimpleRegisteredLetter: () => false,
    } as any);

    mock.onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`).reply(200, notificationDTO);
    mock.onPost(`/bff/v1/payments/info`, paymentInfoRequest).reply(200, paymentInfo);
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);

    await act(async () => {
      result = render(<Component />, {
        preloadedState: {
          userState: { user: adminUser },
        },
        route: routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun),
      });
    });

    expect(result.getByTestId('addDomicileBanner')).toBeInTheDocument();
    expect(result.queryByTestId('notificationCostBanner')).not.toBeInTheDocument();

    spy.mockRestore();
  });

  it('does not render DomicileBanner when viewed and not NotificationCostBanner - admin with groups', async () => {
    const spy = vi.spyOn(StatusHistoryParser, 'parse').mockReturnValue({
      resolveDeliveryOutcome: () => ({ type: DeliveryOutcomeType.VIEWED }),
      hasViewedStatus: () => true,
      hasSimpleRegisteredLetter: () => false,
    } as any);

    mock.onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`).reply(200, notificationDTO);
    mock.onPost(`/bff/v1/payments/info`, paymentInfoRequest).reply(200, paymentInfo);
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);

    await act(async () => {
      result = render(<Component />, {
        preloadedState: {
          userState: { user: adminUserWithGroup },
        },
        route: routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun),
      });
    });

    expect(result.queryByTestId('addDomicileBanner')).not.toBeInTheDocument();
    expect(result.queryByTestId('notificationCostBanner')).not.toBeInTheDocument();

    spy.mockRestore();
  });

  it('does not render pec unreachable alert - SIMPLE_REGISTERED_LETTER and ASYNC with multiple recipients', async () => {
    const asyncMultiRecipientDTO = {
      ...notificationDTO,
      notificationFeePolicy: NotificationFeePolicy.DeliveryMode,
      pagoPaIntMode: PagoPaIntegrationMode.Async,
      recipients: [pgRecipient, pfRecipient],
    };

    const spy = vi.spyOn(StatusHistoryParser, 'parse').mockReturnValue({
      resolveDeliveryOutcome: () => ({ type: DeliveryOutcomeType.DIGITAL_FAILURE }),
      hasViewedStatus: () => true,
      hasSimpleRegisteredLetter: () => true,
    } as any);

    mock
      .onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`)
      .reply(200, asyncMultiRecipientDTO);
    mock.onPost(`/bff/v1/payments/info`, paymentInfoRequest).reply(200, paymentInfo);
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);

    await act(async () => {
      result = render(<Component />, {
        preloadedState: {
          userState: { user: adminUser },
        },
        route: routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun),
      });
    });

    expect(result.queryByTestId('pecUnreachableAlertText')).not.toBeInTheDocument();

    expect(result.getByTestId('addDomicileBanner')).toBeInTheDocument();
    expect(result.queryByTestId('notificationCostBanner')).not.toBeInTheDocument();

    spy.mockRestore();
  });

  it('renders NotificationDetail page when status is CANCELLED - documents messages', async () => {
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
      result = render(<Component />, {
        preloadedState: {
          userState: { user: adminUser },
        },
        route: routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun),
      });
    });
    expect(mock.history.get).toHaveLength(2);
    expect(mock.history.get[0].url).toContain('/bff/v1/notifications/received');
    expect(mock.history.get[1].url).toContain('/bff/v1/downtime/history');
    // check documents box
    const notificationDetailDocumentsMessage = result?.getAllByTestId('documentsMessage');
    for (const notificationDetailDocumentMessage of notificationDetailDocumentsMessage) {
      expect(notificationDetailDocumentMessage).toHaveTextContent(
        /detail.acts_files.notification_cancelled_aar|detail.acts_files.notification_cancelled_acts/
      );
    }
  });

  it('renders CANCELLED alert with help link CTA', async () => {
    const { NOTIFICATION_CANCELLED_HELP_LINK } = getConfiguration();
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

    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);

    await act(async () => {
      result = render(<Component />, {
        preloadedState: {
          userState: { user: adminUser },
        },
        route: routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun),
      });
    });

    const cancelledAlert = result.getByTestId('cancelledAlertText');
    expect(cancelledAlert).toBeInTheDocument();

    expect(cancelledAlert).toHaveTextContent('detail.cancelled.message');

    const ctaLink = within(cancelledAlert).getByRole('link', { name: 'detail.cancelled.cta' });
    expect(ctaLink).toHaveAttribute('href', NOTIFICATION_CANCELLED_HELP_LINK);
    expect(ctaLink).toHaveAttribute('target', '_blank');
    expect(ctaLink).toHaveAttribute('rel', expect.stringContaining('noopener'));
    expect(ctaLink).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
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
      result = render(<Component />, {
        preloadedState: {
          userState: { user: adminUser },
        },
        route: routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun),
      });
    });
    expect(mock.history.get).toHaveLength(2);
    expect(mock.history.post).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/bff/v1/notifications/received');
    expect(mock.history.get[1].url).toContain('/bff/v1/downtime/history');
    expect(mock.history.post[0].url).toBe(`/bff/v1/payments/info`);
    // check documents box
    const notificationDetailDocumentsMessage = result?.getAllByTestId('documentsMessage');
    for (const notificationDetailDocumentMessage of notificationDetailDocumentsMessage) {
      expect(notificationDetailDocumentMessage).toHaveTextContent(
        /detail.acts_files.not_downloadable_aar|detail.acts_files.not_downloadable_acts/
      );
    }
  });

  it('checks not available payment', async () => {
    mock.onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`).reply(200, {
      ...notificationDTO,
      recipients: [{ ...pgRecipient, payment: { creditorTaxId: null, noticeCode: null } }],
    });
    // we use regexp to not set the query parameters
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
    await act(async () => {
      result = render(<Component />, {
        preloadedState: {
          userState: { user: adminUser },
        },
        route: routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun),
      });
    });
    // check payment box
    const paymentData = result?.queryByTestId('paymentData');
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
      result = render(<Component />, {
        preloadedState: {
          userState: { user: adminUser },
        },
        route: routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun),
      });
    });
    expect(mock.history.get).toHaveLength(2);
    const documentButton = result?.getAllByTestId('documentButton');
    fireEvent.click(documentButton[0]);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(3);
      expect(mock.history.post).toHaveLength(1);
      expect(mock.history.get[2].url).toContain(
        `/bff/v1/notifications/received/${notificationToFe.iun}/documents/ATTACHMENT?documentIdx=0`
      );
    });
    await waitFor(() => {
      expect(globalThis.location.href).toBe('https://mocked-url.com');
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
          <Component />
        </>,
        {
          preloadedState: {
            userState: { user: adminUser },
          },
          route: routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun),
        }
      );
    });
    expect(mock.history.get).toHaveLength(2);
    const legalFactButton = result?.getAllByTestId('download-legalfact');
    fireEvent.click(legalFactButton[0]);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(3);
      expect(mock.history.get[2].url).toContain(
        `/bff/v1/notifications/received/${notificationToFe.iun}/documents/LEGAL_FACT?documentId=${mockLegalIds.key}`
      );
    });
    const docNotAvailableAlert = await waitFor(() => result?.getByTestId('snackBarContainer'));
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
      expect(globalThis.location.href).toBe('https://mocked-url-com');
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
          <Component />
        </>,
        {
          preloadedState: {
            userState: { user: adminUser },
          },
          route: routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun),
        }
      );
    });
    expect(mock.history.get).toHaveLength(2);
    const AARBox = result?.getByTestId('aarBox');
    const AARButton = within(AARBox).getByTestId('documentButton');
    fireEvent.click(AARButton);

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(3);
      expect(mock.history.get[2].url).toContain(
        `/bff/v1/notifications/received/${notificationToFe.iun}/documents/AAR?documentId=${otherDocument.documentId}`
      );
    });

    const docNotAvailableAlert = await waitFor(() => result?.getByTestId('snackBarContainer'));
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
    //simulate that legal fact is now available
    fireEvent.click(AARButton);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(4);
      expect(mock.history.get[3].url).toContain(
        `/bff/v1/notifications/received/${notificationToFe.iun}/documents/AAR?documentId=${otherDocument.documentId}`
      );
    });
    await waitFor(() => {
      expect(globalThis.location.href).toBe('https://mocked-aar-com');
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
      result = render(<Component />, {
        preloadedState: {
          userState: { user: adminUser },
        },
        route: routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun),
      });
    });
    expect(mock.history.get).toHaveLength(2);
    expect(mock.history.post).toHaveLength(1);
    const downtimesBox = result?.getByTestId('downtimesBox');
    const legalFactDowntimesButton = downtimesBox?.querySelectorAll('button');
    fireEvent.click(legalFactDowntimesButton[0]);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(3);
      expect(mock.history.get[2].url).toContain(
        `/bff/v1/downtime/legal-facts/${downtimesDTO.result[0].legalFactId}`
      );
    });
    await waitFor(() => {
      expect(globalThis.location.href).toBe('https://mocked-url-com');
    });
  });

  it('normal navigation - includes back button', async () => {
    mock.onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`).reply(200, notificationDTO);
    mock.onPost(`/bff/v1/payments/info`, paymentInfoRequest).reply(200, paymentInfo);
    // we use regexp to not set the query parameters
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
    await act(async () => {
      result = render(<Component />, {
        preloadedState: {
          userState: { user: adminUser },
        },
        route: routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun),
      });
    });
    const backButton = result?.getByTestId('breadcrumb-indietro-button');
    expect(backButton).toBeInTheDocument();
    fireEvent.click(backButton);
    expect(result.router.state.location.pathname).toBe(routes.NOTIFICHE);
  });

  it('navigation from QR code - does not include back button', async () => {
    mock.onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`).reply(200, notificationDTO);
    mock.onPost(`/bff/v1/payments/info`, paymentInfoRequest).reply(200, paymentInfo);
    // we use regexp to not set the query parameters
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
    await act(async () => {
      result = render(<Component />, {
        preloadedState: {
          userState: {
            user: adminUser,
          },
        },
        route: [
          {
            pathname: routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun),
            state: { fromQrCode: true },
          },
        ],
      });
    });
    const backButton = result?.queryByTestId('breadcrumb-indietro-button');
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
          <Component />
        </>,
        {
          preloadedState: {
            userState: { user: adminUser },
          },
          route: routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun),
        }
      );
    });
    const statusApiErrorComponent = screen.queryByTestId(
      `api-error-${NOTIFICATION_ACTIONS.GET_RECEIVED_NOTIFICATION}`
    );
    expect(statusApiErrorComponent).toBeInTheDocument();
  });

  it('renders NotificationDetail page with delegator logged', async () => {
    mock
      .onGet(
        `/bff/v1/notifications/received/${notificationDTO.iun}?mandateId=${delegator?.mandateId}`
      )
      .reply(200, notificationDTO);
    mock.onPost(`/bff/v1/payments/info`, paymentInfoRequest).reply(200, paymentInfo);
    // we use regexp to not set the query parameters
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
    await act(async () => {
      result = render(<Component />, {
        preloadedState: {
          userState: { user: adminUser },
          generalInfoState: {
            delegators: mandatesByDelegate,
          },
        },
        route: routes.GET_DETTAGLIO_NOTIFICA_DELEGATO_PATH(
          notificationDTO.iun,
          delegator!.mandateId
        ),
      });
    });
    // when a delegator sees a notification, we expect that he sees the same things that sees the recipient except the disclaimer
    expect(mock.history.get).toHaveLength(2);
    expect(mock.history.get[0].url).toContain('/bff/v1/notifications/received');
    expect(mock.history.get[1].url).toContain('/bff/v1/downtime/history');
    expect(result?.getByTestId('breadcrumb-link')).toHaveTextContent(/detail.breadcrumb-root/i);
    expect(result?.container).toHaveTextContent(notificationToFe.abstract!);
    // check summary table
    const notificationDetailTable = result?.getByTestId('notificationDetailTable');
    expect(notificationDetailTable).toBeInTheDocument();
    const tableRows = notificationDetailTable?.querySelectorAll('tr');
    expect(tableRows[0]).toHaveTextContent(`detail.sender${notificationToFe.senderDenomination}`);
    expect(tableRows[1]).toHaveTextContent(`detail.recipient${pgRecipient.denomination}`);
    expect(tableRows[2]).toHaveTextContent(`detail.date${formatDate(notificationToFe.sentAt)}`);
    expect(tableRows[3]).toHaveTextContent(`detail.iun${notificationToFe.iun}`);
    // check documents box
    const notificationDetailDocuments = result?.getAllByTestId('notificationDetailDocuments');
    expect(notificationDetailDocuments).toHaveLength(
      notificationToFe.documents.length + notificationToFe.otherDocuments?.length!
    );
    const notificationDetailDocumentsMessage = result?.getAllByTestId('documentsMessage');
    for (const notificationDetailDocumentMessage of notificationDetailDocumentsMessage) {
      expect(notificationDetailDocumentMessage).toHaveTextContent(
        /detail.acts_files.downloadable_aar|detail.acts_files.downloadable_acts/
      );
    }
    // check timeline box
    const NotificationDetailTimeline = result?.getByTestId('NotificationDetailTimeline');
    expect(NotificationDetailTimeline).toBeInTheDocument();
    // check payment box
    const paymentData = result?.getByTestId('paymentInfoBox');
    expect(paymentData).toBeInTheDocument();
    // check downtimes box
    const downtimesBox = result?.getByTestId('downtimesBox');
    expect(downtimesBox).toBeInTheDocument();
    // check domicile banner
    const addDomicileBanner = result?.queryByTestId('addDomicileBanner');
    expect(addDomicileBanner).not.toBeInTheDocument();
  });

  it('normal navigation when delegator is logged - includes back button', async () => {
    mock
      .onGet(
        `/bff/v1/notifications/received/${notificationDTO.iun}?mandateId=${delegator?.mandateId}`
      )
      .reply(200, notificationDTO);
    mock.onPost(`/bff/v1/payments/info`, paymentInfoRequest).reply(200, paymentInfo);
    // we use regexp to not set the query parameters
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
    await act(async () => {
      result = render(<Component />, {
        preloadedState: {
          userState: { user: adminUser },
          generalInfoState: {
            delegators: mandatesByDelegate,
            digitalAddresses: [],
          },
        },
        route: routes.GET_DETTAGLIO_NOTIFICA_DELEGATO_PATH(
          notificationDTO.iun,
          delegator!.mandateId
        ),
      });
    });
    const backButton = result?.getByTestId('breadcrumb-indietro-button');
    expect(backButton).toBeInTheDocument();
    fireEvent.click(backButton);
    expect(result.router.state.location.pathname).toBe(routes.NOTIFICHE_DELEGATO);
  });

  it('renders NotificationDetail page - admin with groups', async () => {
    mock.onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`).reply(200, notificationDTO);
    mock.onPost(`/bff/v1/payments/info`, paymentInfoRequest).reply(200, paymentInfo);
    // we use regexp to not set the query parameters
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
    await act(async () => {
      result = render(<Component />, {
        preloadedState: {
          userState: { user: adminUserWithGroup },
        },
        route: routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun),
      });
    });
    // when a delegator sees a notification, we expect that he sees the same things that sees the recipient except the disclaimer
    expect(mock.history.get).toHaveLength(2);
    expect(mock.history.post).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/bff/v1/notifications/received');
    expect(mock.history.get[1].url).toContain('/bff/v1/downtime/history');
    expect(mock.history.post[0].url).toBe(`/bff/v1/payments/info`);
    expect(result?.getByTestId('breadcrumb-link')).toHaveTextContent(/detail.breadcrumb-root/i);
    expect(result?.container).toHaveTextContent(notificationToFe.abstract!);
    // check summary table
    const notificationDetailTable = result?.getByTestId('notificationDetailTable');
    expect(notificationDetailTable).toBeInTheDocument();
    const tableRows = notificationDetailTable?.querySelectorAll('tr');
    expect(tableRows[0]).toHaveTextContent(`detail.sender${notificationToFe.senderDenomination}`);
    expect(tableRows[1]).toHaveTextContent(`detail.recipient${pgRecipient.denomination}`);
    expect(tableRows[2]).toHaveTextContent(`detail.date${formatDate(notificationToFe.sentAt)}`);
    expect(tableRows[3]).toHaveTextContent(`detail.iun${notificationToFe.iun}`);
    // check documents box
    const notificationDetailDocuments = result?.getAllByTestId('notificationDetailDocuments');
    expect(notificationDetailDocuments).toHaveLength(
      notificationToFe.documents.length + notificationToFe.otherDocuments?.length!
    );
    const notificationDetailDocumentsMessage = result?.getAllByTestId('documentsMessage');
    for (const notificationDetailDocumentMessage of notificationDetailDocumentsMessage) {
      expect(notificationDetailDocumentMessage).toHaveTextContent(
        /detail.acts_files.downloadable_aar|detail.acts_files.downloadable_acts/
      );
    }
    // check timeline box
    const NotificationDetailTimeline = result?.getByTestId('NotificationDetailTimeline');
    expect(NotificationDetailTimeline).toBeInTheDocument();
    // check payment box
    const paymentData = result?.getByTestId('paymentInfoBox');
    expect(paymentData).toBeInTheDocument();
    // check downtimes box
    const downtimesBox = result?.getByTestId('downtimesBox');
    expect(downtimesBox).toBeInTheDocument();
    // check domicile banner
    const addDomicileBanner = result?.queryByTestId('addDomicileBanner');
    expect(addDomicileBanner).not.toBeInTheDocument();
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
        returnUrl: globalThis.location.href,
      })
      .reply(200, {
        checkoutUrl: 'https://mocked-url.com',
      });

    await act(async () => {
      result = render(<Component />, {
        preloadedState: {
          userState: { user: adminUser },
        },
        route: routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun),
      });
    });

    const payButton = result?.getByTestId('pay-button');
    const item = result?.queryAllByTestId('pagopa-item')[requiredPaymentIndex];
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
        returnUrl: globalThis.location.href,
      })
      .reply(errorMock.status, errorMock.data);

    await act(async () => {
      result = render(<Component />, {
        preloadedState: {
          userState: { user: adminUser },
        },
        route: routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun),
      });
    });

    expect(result.testStore.getState().notificationState.paymentsData.pagoPaF24.length).toBe(6);

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
    expect(result.testStore.getState().notificationState.paymentsData.pagoPaF24.length).toBe(6);

    vi.useRealTimers();
  });

  it('should show correct paginated payments', async () => {
    let paginationData = {
      page: 0,
      size: 5,
      totalElements: pgRecipient.payments?.length,
    };

    mock.onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`).reply(200, notificationDTO);
    mock
      .onPost(`/bff/v1/payments/info`, paymentInfoRequest.slice(0, paginationData.size))
      .reply(200, paymentInfo.slice(0, paginationData.size));

    await act(async () => {
      result = render(<Component />, {
        preloadedState: {
          userState: { user: adminUser },
        },
        route: routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun),
      });
    });

    // check that the first 5 payments are shown
    const pagoPaItems = result?.queryAllByTestId('pagopa-item');
    expect(pagoPaItems).toHaveLength(5);

    const pageSelector = result?.getByTestId('pageSelector');
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
    const secondPageItems = result?.queryAllByTestId('pagopa-item');
    expect(secondPageItems).toHaveLength(secondPagePaymentInfoRequest.length);
  });

  it('should load payments from cache when reloading the page, so it does not make the same request twice', async () => {
    let pagoPaItems: HTMLElement[] | undefined;
    mock.onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`).reply(200, notificationDTO);
    mock.onPost(`/bff/v1/payments/info`, paymentInfoRequest.slice(0, 5)).reply(200, paymentInfo);

    await act(async () => {
      result = render(<Component />, {
        preloadedState: {
          userState: { user: adminUser },
        },
        route: routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun),
      });
    });

    expect(mock.history.post).toHaveLength(1);
    pagoPaItems = result?.queryAllByTestId('pagopa-item');
    expect(pagoPaItems).toHaveLength(5);

    mock.resetHistory();

    await act(async () => {
      result?.rerender(<Component />);
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
      result = render(<Component />, {
        preloadedState: {
          userState: { user: adminUser },
        },
        route: routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun),
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
      result = render(<Component />, {
        preloadedState: {
          userState: { user: adminUser },
        },
        route: routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun),
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
      result = render(<Component />, {
        preloadedState: {
          userState: { user: adminUser },
        },
        route: routes.GET_DETTAGLIO_NOTIFICA_PATH(raddNotificationDTO.iun),
      });
    });

    const alertRadd = result.getAllByTestId('raddAlert')[0];
    expect(alertRadd).toBeInTheDocument();
    expect(alertRadd).toHaveTextContent('detail.timeline.radd.title');
  });
});
