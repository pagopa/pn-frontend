import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import {
  AppMessage,
  AppResponseMessage,
  Configuration,
  NotificationDetail as NotificationDetailModel,
  ResponseEventDispatcher,
  TimelineCategory,
} from '@pagopa-pn/pn-commons';

import { errorMock } from '../../__mocks__/Errors.mock';
import { notificationDTO } from '../../__mocks__/NotificationDetail.mock';
import { NotificationTimelineResponse } from '../../__mocks__/NotificationTimeline.mock';
import { RenderResult, act, fireEvent, render, waitFor } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import * as routes from '../../navigation/routes.const';
import { PfConfiguration } from '../../services/configuration.service';
import NotificationTimeline from '../NotificationTimeline.page';

const getLegalFactIds = (notification: NotificationDetailModel, recIndex: number) => {
  const timelineElementNotificationViewed = notification.timeline.filter(
    (t) => t.category === TimelineCategory.NOTIFICATION_VIEWED && t.details.recIndex === recIndex
  )[0];
  return timelineElementNotificationViewed.legalFactsIds![0];
};

const mockIsNewTimelineEnabledGetter = vi.fn();
const mockIsNewTimelineCopyEnabledGetter = vi.fn();
vi.mock('../../services/configuration.service', async () => {
  return {
    ...(await vi.importActual<any>('../../services/configuration.service')),
    getConfiguration: () => ({
      ...Configuration.get<PfConfiguration>(),
      IS_NEW_TIMELINE_ENABLED: mockIsNewTimelineEnabledGetter(),
      IS_NEW_TIMELINE_COPY_ENABLED: mockIsNewTimelineCopyEnabledGetter() ?? false,
    }),
  };
});

describe('NotificationTimeline Page - IS_NEW_TIMELINE_ENABLED enabled', () => {
  const timelineIun = NotificationTimelineResponse.iun;
  const timelineSubject = NotificationTimelineResponse.subject;
  const mandateId = 'mocked-mandate-id';

  const timelineResponseWithHiddenLegalFact = (legalFactKey: string, category: string) => ({
    ...NotificationTimelineResponse,
    notificationStatusHistory: [
      {
        status: 'ACCEPTED',
        activeFrom: '2026-06-05T13:12:50.043521089Z',
        steps: [
          {
            stepType: 'EVENT',
            event: {
              elementId: 'REQUEST_ACCEPTED.IUN_TEST',
              timestamp: '2026-06-05T13:12:50.043521089Z',
              details: {},
              legalFactsIds: [{ key: legalFactKey, category }],
              category: 'REQUEST_ACCEPTED',
              isHidden: true,
            },
          },
        ],
      },
    ],
  });

  const cancelledKey = 'safestorage://PN_LEGAL_FACTS-cancelled-test.pdf';
  const senderAckKey = 'safestorage://PN_LEGAL_FACTS-sender-ack-test.pdf';

  const cancelledTimelineResponse = {
    ...NotificationTimelineResponse,
    isCancelled: true,
    notificationStatusHistory: [
      {
        status: 'CANCELLED',
        activeFrom: '2026-06-06T13:12:50.043521089Z',
        steps: [
          {
            stepType: 'EVENT',
            event: {
              elementId: 'NOTIFICATION_CANCELLED.IUN_TEST',
              timestamp: '2026-06-06T13:12:50.043521089Z',
              details: {},
              legalFactsIds: [{ key: cancelledKey, category: 'NOTIFICATION_CANCELLED' }],
              category: 'NOTIFICATION_CANCELLED',
              isHidden: true,
            },
          },
        ],
      },
      ...timelineResponseWithHiddenLegalFact(senderAckKey, 'SENDER_ACK').notificationStatusHistory,
    ],
  };

  let result: RenderResult;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
    vi.stubGlobal('location', { href: '', assign: vi.fn() });
  });

  beforeEach(() => {
    mockIsNewTimelineEnabledGetter.mockReturnValue(true);
    mockIsNewTimelineCopyEnabledGetter.mockReturnValue(false);
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
    vi.unstubAllGlobals();
  });

  it('fetch the timeline api and renders the new timeline', async () => {
    mock
      .onGet(`/bff/v1/notifications/received/${timelineIun}/timeline`)
      .reply(200, NotificationTimelineResponse);

    await act(async () => {
      result = render(<NotificationTimeline />, {
        route: routes.GET_DETTAGLIO_NOTIFICA_TIMELINE_PATH(timelineIun),
        path: routes.DETTAGLIO_NOTIFICA_TIMELINE,
      });
    });

    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toBe(`/bff/v1/notifications/received/${timelineIun}/timeline`);
    expect(result.getByTestId('NotificationEventsTimeline')).toBeInTheDocument();
    expect(result.queryByTestId('NotificationDetailTimeline')).not.toBeInTheDocument();
  });

  it('shows the api error when the timeline api fails', async () => {
    mock
      .onGet(`/bff/v1/notifications/received/${timelineIun}/timeline`)
      .reply(errorMock.status, errorMock.data);

    await act(async () => {
      result = render(
        <>
          <ResponseEventDispatcher />
          <AppResponseMessage />
          <NotificationTimeline />
        </>,
        {
          route: routes.GET_DETTAGLIO_NOTIFICA_TIMELINE_PATH(timelineIun),
          path: routes.DETTAGLIO_NOTIFICA_TIMELINE,
        }
      );
    });

    expect(result.getByTestId('api-error-getReceivedNotificationTimeline')).toBeInTheDocument();
    expect(result.queryByTestId('NotificationEventsTimeline')).not.toBeInTheDocument();
  });

  it('executes the legal fact download handler', async () => {
    // il prefisso "safestorage://" va estratto dalla chiave prima di essere usato come documentId
    const legalFactKey = 'safestorage://PN_LEGAL_FACTS-non-aar-test.pdf';
    const documentId = 'PN_LEGAL_FACTS-non-aar-test.pdf';
    const documentUrl = `/bff/v1/notifications/received/${timelineIun}/documents/LEGAL_FACT?documentId=${documentId}`;

    mock
      .onGet(`/bff/v1/notifications/received/${timelineIun}/timeline`)
      .reply(200, timelineResponseWithHiddenLegalFact(legalFactKey, 'SENDER_ACK'));
    mock.onGet(documentUrl).reply(200, { retryAfter: 1 });

    await act(async () => {
      result = render(
        <>
          <AppMessage />
          <NotificationTimeline />
        </>,
        {
          route: routes.GET_DETTAGLIO_NOTIFICA_TIMELINE_PATH(timelineIun),
          path: routes.DETTAGLIO_NOTIFICA_TIMELINE,
        }
      );
    });

    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toBe(`/bff/v1/notifications/received/${timelineIun}/timeline`);

    const legalFactButton = result.getByTestId('download-legalfact');
    fireEvent.click(legalFactButton);

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(2);
      expect(mock.history.get[1].url).toContain(documentUrl);
    });

    const docNotAvailableAlert = await waitFor(() => result.getByTestId('snackBarContainer'));
    expect(docNotAvailableAlert).toBeInTheDocument();

    mock.onGet(documentUrl).reply(200, {
      filename: 'mocked-filename',
      contentLength: 1000,
      retryAfter: null,
      url: 'https://mocked-url-com',
    });

    fireEvent.click(legalFactButton);

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(3);
      expect(mock.history.get[2].url).toContain(documentUrl);
    });

    await waitFor(() => {
      expect(globalThis.location.href).toBe('https://mocked-url-com');
    });
  });

  it('executes the legal fact download handler - AAR branch', async () => {
    // per l'AAR la chiave va usata per intero come documentId, senza estrarre alcun prefisso
    const legalFactKey = 'safestorage://PN_AAR-test.pdf';
    const documentUrl = `/bff/v1/notifications/received/${timelineIun}/documents/AAR?documentId=${encodeURIComponent(
      legalFactKey
    )}`;

    mock
      .onGet(`/bff/v1/notifications/received/${timelineIun}/timeline`)
      .reply(200, timelineResponseWithHiddenLegalFact(legalFactKey, 'AAR'));
    mock.onGet(documentUrl).reply(200, {
      filename: 'mocked-filename',
      contentLength: 1000,
      retryAfter: null,
      url: 'https://mocked-aar-url.com',
    });

    await act(async () => {
      result = render(<NotificationTimeline />, {
        route: routes.GET_DETTAGLIO_NOTIFICA_TIMELINE_PATH(timelineIun),
        path: routes.DETTAGLIO_NOTIFICA_TIMELINE,
      });
    });

    fireEvent.click(result.getByTestId('download-legalfact'));

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(2);
      expect(mock.history.get[1].url).toBe(documentUrl);
    });

    await waitFor(() => {
      expect(globalThis.location.href).toBe('https://mocked-aar-url.com');
    });
  });

  it('cancelled notification with new copy - shows a warning instead of downloading the legal facts', async () => {
    mockIsNewTimelineCopyEnabledGetter.mockReturnValue(true);
    const cancelledDocumentUrl = `/bff/v1/notifications/received/${timelineIun}/documents/LEGAL_FACT?documentId=PN_LEGAL_FACTS-cancelled-test.pdf`;

    mock
      .onGet(`/bff/v1/notifications/received/${timelineIun}/timeline`)
      .reply(200, cancelledTimelineResponse);
    mock.onGet(cancelledDocumentUrl).reply(200, {
      filename: 'mocked-filename',
      contentLength: 1000,
      retryAfter: null,
      url: 'https://mocked-cancelled-url.com',
    });

    await act(async () => {
      result = render(
        <>
          <AppMessage />
          <NotificationTimeline />
        </>,
        {
          route: routes.GET_DETTAGLIO_NOTIFICA_TIMELINE_PATH(timelineIun),
          path: routes.DETTAGLIO_NOTIFICA_TIMELINE,
        }
      );
    });

    const [cancelledButton, senderAckButton] = result.getAllByTestId('download-legalfact');
    expect(cancelledButton).toBeEnabled();
    expect(senderAckButton).toBeEnabled();

    fireEvent.click(senderAckButton);

    const warning = await waitFor(() => result.getByTestId('snackBarContainer'));
    expect(warning).toHaveTextContent('detail.document-unavailable');
    expect(mock.history.get).toHaveLength(1);

    fireEvent.click(cancelledButton);

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(2);
      expect(mock.history.get[1].url).toBe(cancelledDocumentUrl);
    });

    await waitFor(() => {
      expect(globalThis.location.href).toBe('https://mocked-cancelled-url.com');
    });
  });

  it('cancelled notification without new copy - disables the legal facts other than the cancellation', async () => {
    mock
      .onGet(`/bff/v1/notifications/received/${timelineIun}/timeline`)
      .reply(200, cancelledTimelineResponse);

    await act(async () => {
      result = render(
        <>
          <AppMessage />
          <NotificationTimeline />
        </>,
        {
          route: routes.GET_DETTAGLIO_NOTIFICA_TIMELINE_PATH(timelineIun),
          path: routes.DETTAGLIO_NOTIFICA_TIMELINE,
        }
      );
    });

    const [cancelledButton, senderAckButton] = result.getAllByTestId('download-legalfact');
    expect(cancelledButton).toBeEnabled();
    expect(senderAckButton).toBeDisabled();
    expect(result.queryByTestId('snackBarContainer')).not.toBeInTheDocument();
  });

  it('check the breadcrumb items', async () => {
    mock
      .onGet(`/bff/v1/notifications/received/${timelineIun}/timeline`)
      .reply(200, NotificationTimelineResponse);

    await act(async () => {
      result = render(<NotificationTimeline />, {
        route: routes.GET_DETTAGLIO_NOTIFICA_TIMELINE_PATH(timelineIun),
        path: routes.DETTAGLIO_NOTIFICA_TIMELINE,
      });
    });

    // root breadcrumb item is rendered
    const rootButton = result.getByTestId('breadcrumb-root-button');
    expect(rootButton).toBeInTheDocument();

    // subject breadcrumb item is rendered and shows the notification IUN
    const subjectButton = result.getByTestId('breadcrumb-subject-button');
    expect(subjectButton).toBeInTheDocument();
    expect(subjectButton).toHaveTextContent(timelineSubject);
  });

  it('navigates to the notification detail when clicking the subject breadcrumb', async () => {
    mock
      .onGet(`/bff/v1/notifications/received/${timelineIun}/timeline`)
      .reply(200, NotificationTimelineResponse);

    await act(async () => {
      result = render(<NotificationTimeline />, {
        route: routes.GET_DETTAGLIO_NOTIFICA_TIMELINE_PATH(timelineIun),
        path: routes.DETTAGLIO_NOTIFICA_TIMELINE,
      });
    });

    const subjectButton = result.getByTestId('breadcrumb-subject-button');
    fireEvent.click(subjectButton);

    await waitFor(() => {
      expect(result.router.state.location.pathname).toBe(
        routes.GET_DETTAGLIO_NOTIFICA_PATH(timelineIun)
      );
    });
  });

  it('navigates back when clicking the root breadcrumb', async () => {
    mock
      .onGet(`/bff/v1/notifications/received/${timelineIun}/timeline`)
      .reply(200, NotificationTimelineResponse);

    await act(async () => {
      result = render(<NotificationTimeline />, {
        route: routes.GET_DETTAGLIO_NOTIFICA_PATH(timelineIun),
        path: routes.DETTAGLIO_NOTIFICA,
      });
    });

    const rootButton = result.getByTestId('breadcrumb-root-button');
    fireEvent.click(rootButton);

    await waitFor(() => {
      expect(result.router.state.location.pathname).toBe(
        routes.GET_DETTAGLIO_NOTIFICA_PATH(timelineIun)
      );
    });
  });

  it('navigates to the delegate notifications list when clicking the root breadcrumb', async () => {
    mock
      .onGet(`/bff/v1/notifications/received/${timelineIun}?mandateId=${mandateId}`)
      .reply(200, notificationDTO);

    await act(async () => {
      result = render(<NotificationTimeline />, {
        route: routes.GET_DETTAGLIO_NOTIFICA_DELEGATO_TIMELINE_PATH(timelineIun, mandateId),
        path: routes.DETTAGLIO_NOTIFICA_DELEGATO_TIMELINE,
      });
    });

    const rootButton = result.getByTestId('breadcrumb-root-button');
    fireEvent.click(rootButton);

    await waitFor(() => {
      expect(result.router.state.location.pathname).toBe(
        routes.GET_NOTIFICHE_DELEGATO_PATH(mandateId)
      );
    });
  });

  it('navigates to the delegate notification detail when clicking the subject breadcrumb', async () => {
    mock
      .onGet(`/bff/v1/notifications/received/${timelineIun}?mandateId=${mandateId}`)
      .reply(200, notificationDTO);

    await act(async () => {
      result = render(<NotificationTimeline />, {
        route: routes.GET_DETTAGLIO_NOTIFICA_DELEGATO_TIMELINE_PATH(timelineIun, mandateId),
        path: routes.DETTAGLIO_NOTIFICA_DELEGATO_TIMELINE,
      });
    });

    const subjectButton = result.getByTestId('breadcrumb-subject-button');
    fireEvent.click(subjectButton);

    await waitFor(() => {
      expect(result.router.state.location.pathname).toBe(
        routes.GET_DETTAGLIO_NOTIFICA_DELEGATO_PATH(timelineIun, mandateId)
      );
    });
  });
});

describe('NotificationTimeline Page - new timeline disabled', () => {
  const mockLegalIds = getLegalFactIds(notificationDTO, 2);
  const mandateId = 'mocked-mandate-id';

  let result: RenderResult;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
    vi.stubGlobal('location', { href: '', assign: vi.fn() });
  });

  beforeEach(() => {
    mockIsNewTimelineEnabledGetter.mockReturnValue(false);
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
    vi.unstubAllGlobals();
  });

  it('fetches the notification api and renders the legacy timeline', async () => {
    mock.onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`).reply(200, notificationDTO);

    await act(async () => {
      result = render(<NotificationTimeline />, {
        preloadedState: {
          userState: { user: { fiscal_number: notificationDTO.recipients[2].taxId } },
        },
        route: routes.GET_DETTAGLIO_NOTIFICA_TIMELINE_PATH(notificationDTO.iun),
        path: routes.DETTAGLIO_NOTIFICA_TIMELINE,
      });
    });

    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toBe(`/bff/v1/notifications/received/${notificationDTO.iun}`);
    expect(result.getByTestId('NotificationDetailTimeline')).toBeInTheDocument();
    expect(result.queryByTestId('NotificationEventsTimeline')).not.toBeInTheDocument();
  });

  it('executes the legal fact download handler', async () => {
    mock.onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`).reply(200, notificationDTO);
    mock
      .onGet(
        `/bff/v1/notifications/received/${notificationDTO.iun}/documents/LEGAL_FACT?documentId=${mockLegalIds.key}`
      )
      .reply(200, {
        retryAfter: 1,
      });

    await act(async () => {
      result = render(
        <>
          <AppMessage />
          <NotificationTimeline />
        </>,
        {
          preloadedState: {
            userState: { user: { fiscal_number: notificationDTO.recipients[2].taxId } },
          },
          route: routes.GET_DETTAGLIO_NOTIFICA_TIMELINE_PATH(notificationDTO.iun),
          path: routes.DETTAGLIO_NOTIFICA_TIMELINE,
        }
      );
    });

    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/bff/v1/notifications/received');

    const legalFactButton = result.getAllByTestId('download-legalfact');
    fireEvent.click(legalFactButton[0]);

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(2);
      expect(mock.history.get[1].url).toContain(
        `/bff/v1/notifications/received/${notificationDTO.iun}/documents/LEGAL_FACT?documentId=${mockLegalIds.key}`
      );
    });

    const docNotAvailableAlert = await waitFor(() => result.getByTestId('snackBarContainer'));
    expect(docNotAvailableAlert).toBeInTheDocument();

    mock
      .onGet(
        `/bff/v1/notifications/received/${notificationDTO.iun}/documents/LEGAL_FACT?documentId=${mockLegalIds.key}`
      )
      .reply(200, {
        filename: 'mocked-filename',
        contentLength: 1000,
        retryAfter: null,
        url: 'https://mocked-url-com',
      });

    fireEvent.click(legalFactButton[0]);

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(3);
      expect(mock.history.get[2].url).toContain(
        `/bff/v1/notifications/received/${notificationDTO.iun}/documents/LEGAL_FACT?documentId=${mockLegalIds.key}`
      );
    });

    await waitFor(() => {
      expect(globalThis.location.href).toBe('https://mocked-url-com');
    });
  });

  it('check the breadcrumb items', async () => {
    mock.onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`).reply(200, notificationDTO);

    await act(async () => {
      result = render(<NotificationTimeline />, {
        route: routes.GET_DETTAGLIO_NOTIFICA_TIMELINE_PATH(notificationDTO.iun),
        path: routes.DETTAGLIO_NOTIFICA_TIMELINE,
      });
    });

    // root breadcrumb item is rendered
    const rootButton = result.getByTestId('breadcrumb-root-button');
    expect(rootButton).toBeInTheDocument();

    // subject breadcrumb item is rendered and shows the notification IUN
    const subjectButton = result.getByTestId('breadcrumb-subject-button');
    expect(subjectButton).toBeInTheDocument();
    expect(subjectButton).toHaveTextContent(notificationDTO.subject);
  });

  it('navigates to the notification detail when clicking the subject breadcrumb', async () => {
    mock.onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`).reply(200, notificationDTO);
    await act(async () => {
      result = render(<NotificationTimeline />, {
        route: routes.GET_DETTAGLIO_NOTIFICA_TIMELINE_PATH(notificationDTO.iun),
        path: routes.DETTAGLIO_NOTIFICA_TIMELINE,
      });
    });

    const subjectButton = result.getByTestId('breadcrumb-subject-button');
    fireEvent.click(subjectButton);

    await waitFor(() => {
      expect(result.router.state.location.pathname).toBe(
        routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun)
      );
    });
  });

  it('navigates back when clicking the root breadcrumb', async () => {
    mock.onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`).reply(200, notificationDTO);

    await act(async () => {
      result = render(<NotificationTimeline />, {
        route: routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun),
        path: routes.DETTAGLIO_NOTIFICA,
      });
    });

    const rootButton = result.getByTestId('breadcrumb-root-button');
    fireEvent.click(rootButton);

    await waitFor(() => {
      expect(result.router.state.location.pathname).toBe(
        routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun)
      );
    });
  });

  it('navigates to the delegate notifications list when clicking the root breadcrumb', async () => {
    mock
      .onGet(`/bff/v1/notifications/received/${notificationDTO.iun}?mandateId=${mandateId}`)
      .reply(200, notificationDTO);

    await act(async () => {
      result = render(<NotificationTimeline />, {
        route: routes.GET_DETTAGLIO_NOTIFICA_DELEGATO_TIMELINE_PATH(notificationDTO.iun, mandateId),
        path: routes.DETTAGLIO_NOTIFICA_DELEGATO_TIMELINE,
      });
    });

    const rootButton = result.getByTestId('breadcrumb-root-button');
    fireEvent.click(rootButton);

    await waitFor(() => {
      expect(result.router.state.location.pathname).toBe(
        routes.GET_NOTIFICHE_DELEGATO_PATH(mandateId)
      );
    });
  });

  it('navigates to the delegate notification detail when clicking the subject breadcrumb', async () => {
    mock
      .onGet(`/bff/v1/notifications/received/${notificationDTO.iun}?mandateId=${mandateId}`)
      .reply(200, notificationDTO);

    await act(async () => {
      result = render(<NotificationTimeline />, {
        route: routes.GET_DETTAGLIO_NOTIFICA_DELEGATO_TIMELINE_PATH(notificationDTO.iun, mandateId),
        path: routes.DETTAGLIO_NOTIFICA_DELEGATO_TIMELINE,
      });
    });

    const subjectButton = result.getByTestId('breadcrumb-subject-button');
    fireEvent.click(subjectButton);

    await waitFor(() => {
      expect(result.router.state.location.pathname).toBe(
        routes.GET_DETTAGLIO_NOTIFICA_DELEGATO_PATH(notificationDTO.iun, mandateId)
      );
    });
  });
});
