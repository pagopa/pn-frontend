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
import { PaConfiguration } from '../../services/configuration.service';
import NotificationTimeline from '../NotificationTimeline.page';

const getLegalFactIds = (notification: NotificationDetailModel, recIndex: number) => {
  const timelineElementDigitalSuccessWorkflow = notification.timeline.filter(
    (t) =>
      t.category === TimelineCategory.DIGITAL_SUCCESS_WORKFLOW && t.details.recIndex === recIndex
  )[0];
  return timelineElementDigitalSuccessWorkflow.legalFactsIds![0];
};

const mockIsNewTimelineEnabledGetter = vi.fn();
vi.mock('../../services/configuration.service', async () => {
  return {
    ...(await vi.importActual<any>('../../services/configuration.service')),
    getConfiguration: () => ({
      ...Configuration.get<PaConfiguration>(),
      IS_NEW_TIMELINE_ENABLED: mockIsNewTimelineEnabledGetter(),
    }),
  };
});

describe('NotificationTimeline Page - IS_NEW_TIMELINE_ENABLED enabled', () => {
  const timelineIun = NotificationTimelineResponse.iun;

  let result: RenderResult;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  beforeEach(() => {
    mockIsNewTimelineEnabledGetter.mockReturnValue(true);
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
  });

  it('fetch the timeline api and renders the new timeline', async () => {
    mock
      .onGet(`/bff/v1/notifications/sent/${timelineIun}/timeline`)
      .reply(200, NotificationTimelineResponse);

    await act(async () => {
      result = render(<NotificationTimeline />, {
        route: `/${timelineIun}/dettaglio/timeline`,
        path: '/:id/dettaglio/timeline',
      });
    });

    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toBe(`/bff/v1/notifications/sent/${timelineIun}/timeline`);
    expect(result.getByTestId('NotificationEventsTimeline')).toBeInTheDocument();
    expect(result.queryByTestId('NotificationDetailTimeline')).not.toBeInTheDocument();
  });

  it('shows the api error when the timeline api fails', async () => {
    mock
      .onGet(`/bff/v1/notifications/sent/${timelineIun}/timeline`)
      .reply(errorMock.status, errorMock.data);

    await act(async () => {
      result = render(
        <>
          <ResponseEventDispatcher />
          <AppResponseMessage />
          <NotificationTimeline />
        </>,
        {
          route: `/${timelineIun}/dettaglio/timeline`,
          path: '/:id/dettaglio/timeline',
        }
      );
    });

    expect(result.getByTestId('api-error-getSentNotificationTimeline')).toBeInTheDocument();
    expect(result.queryByTestId('NotificationEventsTimeline')).not.toBeInTheDocument();
  });
});

describe('NotificationTimeline Page - new timeline disabled', () => {
  const mockLegalIds = getLegalFactIds(notificationDTO, 0);

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
    mock.onGet(`/bff/v1/notifications/sent/${notificationDTO.iun}`).reply(200, notificationDTO);

    await act(async () => {
      result = render(<NotificationTimeline />, {
        route: `/${notificationDTO.iun}/dettaglio/timeline`,
        path: '/:id/dettaglio/timeline',
      });
    });

    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toBe(`/bff/v1/notifications/sent/${notificationDTO.iun}`);
    expect(result.getByTestId('NotificationDetailTimeline')).toBeInTheDocument();
    expect(result.queryByTestId('NotificationEventsTimeline')).not.toBeInTheDocument();
  });

  it('executes the legal fact download handler - mono recipient', async () => {
    mock.onGet(`/bff/v1/notifications/sent/${notificationDTO.iun}`).reply(200, notificationDTO);
    mock
      .onGet(
        `/bff/v1/notifications/sent/${notificationDTO.iun}/documents/LEGAL_FACT?documentId=${mockLegalIds.key}`
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
          route: `/${notificationDTO.iun}/dettaglio/timeline`,
          path: '/:id/dettaglio/timeline',
        }
      );
    });

    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/bff/v1/notifications/sent');

    const legalFactButton = result.getAllByTestId('download-legalfact');
    fireEvent.click(legalFactButton[0]);

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(2);
      expect(mock.history.get[1].url).toContain(
        `/bff/v1/notifications/sent/${notificationDTO.iun}/documents/LEGAL_FACT?documentId=${mockLegalIds.key}`
      );
    });

    const docNotAvailableAlert = await waitFor(() => result.getByTestId('snackBarContainer'));
    expect(docNotAvailableAlert).toBeInTheDocument();

    mock
      .onGet(
        `/bff/v1/notifications/sent/${notificationDTO.iun}/documents/LEGAL_FACT?documentId=${mockLegalIds.key}`
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
        `/bff/v1/notifications/sent/${notificationDTO.iun}/documents/LEGAL_FACT?documentId=${mockLegalIds.key}`
      );
    });

    await waitFor(() => {
      expect(globalThis.location.href).toBe('https://mocked-url-com');
    });
  });
});
