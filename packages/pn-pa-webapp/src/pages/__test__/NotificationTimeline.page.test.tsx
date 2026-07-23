import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import {
  AppMessage,
  NotificationDetail as NotificationDetailModel,
  TimelineCategory,
} from '@pagopa-pn/pn-commons';

import { notificationDTO } from '../../__mocks__/NotificationDetail.mock';
import { RenderResult, act, fireEvent, render, waitFor } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import NotificationTimeline from '../NotificationTimeline.page';

const getLegalFactIds = (notification: NotificationDetailModel, recIndex: number) => {
  const timelineElementDigitalSuccessWorkflow = notification.timeline.filter(
    (t) =>
      t.category === TimelineCategory.DIGITAL_SUCCESS_WORKFLOW && t.details.recIndex === recIndex
  )[0];
  return timelineElementDigitalSuccessWorkflow.legalFactsIds![0];
};

describe('NotificationTimeline Page', () => {
  const mockLegalIds = getLegalFactIds(notificationDTO, 0);

  let result: RenderResult;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
    vi.stubGlobal('location', { href: '', assign: vi.fn() });
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
    vi.unstubAllGlobals();
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
