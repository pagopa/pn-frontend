import MockAdapter from 'axios-mock-adapter';

import {
  AppResponseMessage,
  ResponseEventDispatcher,
  formatToTimezoneString,
  tenYearsAgo,
  today,
} from '@pagopa-pn/pn-commons';

import { campaignDetailMock, comunicationsList } from '../../__mocks__/CampaignDetail.mock';
import { RenderResult, act, fireEvent, render, waitFor, within } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import CampaignDetail from '../CampaignDetail.page';

describe('CampaignDetail Page', () => {
  let result: RenderResult;
  let mock: MockAdapter;

  const startParam = encodeURIComponent(formatToTimezoneString(tenYearsAgo));
  const endParam = encodeURIComponent(formatToTimezoneString(today));

  const comunicationsListPath = `/bff/v1/informal/campaigns/${campaignDetailMock.campaignId}/notifications/sent?startDate=${startParam}&endDate=${endParam}&size=10`;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('renders campaign detail', async () => {
    mock
      .onGet(`/bff/v1/notifications/informal/campaigns/${campaignDetailMock.campaignId}`)
      .reply(200, campaignDetailMock);

    mock.onGet(comunicationsListPath).reply(200, comunicationsList);

    await act(async () => {
      result = render(<CampaignDetail />, {
        route: `/campaigns/${campaignDetailMock.campaignId}`,
        path: '/campaigns/:id',
      });
    });

    await waitFor(() => {
      expect(
        result.getByRole('heading', {
          name: campaignDetailMock.title,
        })
      ).toBeInTheDocument();
    });

    expect(result.getByText(campaignDetailMock.description)).toBeInTheDocument();
    expect(result.getByText(campaignDetailMock.campaignId)).toBeInTheDocument();
    expect(result.getByText(campaignDetailMock.serviceName)).toBeInTheDocument();
    const campaignsList = result.getByTestId('campaignsList');
    expect(campaignsList).toBeInTheDocument();

    expect(mock.history.get).toHaveLength(2);
    expect(mock.history.get[0].url).toBe(
      `/bff/v1/notifications/informal/campaigns/${campaignDetailMock.campaignId}`
    );
    expect(mock.history.get[1].url).toBe(comunicationsListPath);
  });

  it('shows campaign detail while communications are still loading, without global loading', async () => {
    let resolveCommunications: (value: [number, typeof comunicationsList]) => void = () => {};

    mock
      .onGet(`/bff/v1/notifications/informal/campaigns/${campaignDetailMock.campaignId}`)
      .reply(200, campaignDetailMock);

    mock.onGet(comunicationsListPath).reply(
      () =>
        new Promise((resolve) => {
          resolveCommunications = resolve;
        })
    );

    await act(async () => {
      result = render(<CampaignDetail />, {
        route: `/campaigns/${campaignDetailMock.campaignId}`,
        path: '/campaigns/:id',
      });
    });

    await waitFor(() => {
      expect(
        result.getByRole('heading', {
          name: campaignDetailMock.title,
        })
      ).toBeInTheDocument();
    });

    expect(result.getByTestId('campaignCommunicationsLoading')).toBeInTheDocument();
    expect(result.queryByTestId('campaignsList')).not.toBeInTheDocument();
    expect(result.testStore.getState().appState.loading.result).toBe(false);

    await act(async () => {
      resolveCommunications([200, comunicationsList]);
    });

    await waitFor(() => {
      expect(result.getByTestId('campaignsList')).toBeInTheDocument();
    });
    expect(result.queryByTestId('campaignCommunicationsLoading')).not.toBeInTheDocument();
  });

  it('renders api error when campaign detail request fails', async () => {
    mock
      .onGet(`/bff/v1/notifications/informal/campaigns/${campaignDetailMock.campaignId}`)
      .reply(500);

    mock.onGet(comunicationsListPath).reply(200, comunicationsList);

    await act(async () => {
      result = result = render(
        <>
          <ResponseEventDispatcher />
          <AppResponseMessage />
          <CampaignDetail />
        </>,
        {
          route: `/campaigns/${campaignDetailMock.campaignId}`,
          path: '/campaigns/:id',
        }
      );
    });

    const detailErrorState = await waitFor(() => result.getByTestId('emptyState'));

    expect(detailErrorState).toBeInTheDocument();

    expect(
      within(detailErrorState).getByRole('button', {
        name: 'detail.empty-state.generic-error-cta',
      })
    ).toBeInTheDocument();
  });

  it('retries campaign detail request', async () => {
    const campaignDetailUrl = `/bff/v1/notifications/informal/campaigns/${campaignDetailMock.campaignId}`;

    mock.onGet(campaignDetailUrl).reply(500);

    mock.onGet(comunicationsListPath).reply(200, comunicationsList);

    await act(async () => {
      result = render(
        <>
          <ResponseEventDispatcher />
          <AppResponseMessage />
          <CampaignDetail />
        </>,
        {
          route: `/campaigns/${campaignDetailMock.campaignId}`,
          path: '/campaigns/:id',
        }
      );
    });

    await waitFor(() => {
      const campaignDetailRequests = mock.history.get.filter(
        ({ url }) => url === campaignDetailUrl
      );

      expect(campaignDetailRequests).toHaveLength(1);
    });

    const detailErrorState = await waitFor(() => result.getByTestId('emptyState'));

    expect(detailErrorState).toBeInTheDocument();

    fireEvent.click(
      within(detailErrorState).getByRole('button', {
        name: 'detail.empty-state.generic-error-cta',
      })
    );

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(3);
      expect(mock.history.get[2].url).toBe(
        `/bff/v1/notifications/informal/campaigns/${campaignDetailMock.campaignId}`
      );
    });
  });

  it('renders api error when comunications list request fails', async () => {
    mock
      .onGet(`/bff/v1/notifications/informal/campaigns/${campaignDetailMock.campaignId}`)
      .reply(200, campaignDetailMock);

    mock.onGet(comunicationsListPath).reply(500);

    await act(async () => {
      result = result = render(
        <>
          <ResponseEventDispatcher />
          <AppResponseMessage />
          <CampaignDetail />
        </>,
        {
          route: `/campaigns/${campaignDetailMock.campaignId}`,
          path: '/campaigns/:id',
        }
      );
    });

    const listErrorState = await waitFor(() => result.getByTestId('emptyState'));

    expect(listErrorState).toBeInTheDocument();

    expect(
      within(listErrorState).getByRole('button', {
        name: 'detail.empty-state.generic-error-cta',
      })
    ).toBeInTheDocument();
  });

  it('retries comunications list request', async () => {
    mock
      .onGet(`/bff/v1/notifications/informal/campaigns/${campaignDetailMock.campaignId}`)
      .reply(200, campaignDetailMock);

    mock.onGet(comunicationsListPath).reply(500);

    await act(async () => {
      result = render(
        <>
          <ResponseEventDispatcher />
          <AppResponseMessage />
          <CampaignDetail />
        </>,
        {
          route: `/campaigns/${campaignDetailMock.campaignId}`,
          path: '/campaigns/:id',
        }
      );
    });

    await waitFor(() => {
      const campaignDetailRequests = mock.history.get.filter(
        ({ url }) => url === comunicationsListPath
      );

      expect(campaignDetailRequests).toHaveLength(1);
    });

    const listErrorState = await waitFor(() => result.getByTestId('emptyState'));

    expect(listErrorState).toBeInTheDocument();

    fireEvent.click(
      within(listErrorState).getByRole('button', {
        name: 'detail.empty-state.generic-error-cta',
      })
    );

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(3);
      expect(mock.history.get[2].url).toBe(comunicationsListPath);
    });
  });

  const filteredState = (campaignId: string) => ({
    campaignState: {
      campaigns: [],
      campaignDetail: {},
      communicationsCampaignId: campaignId,
      campaignCommunications: {},
      communicationFilters: {
        recipientId: '',
        iunMatch: 'ABCD-EFGH-IJKL-123456-M-1',
        status: [],
        outcome: '',
      },
      pagination: { nextPagesKey: [], size: 10, page: 0, moreResult: false },
      communicationsPagination: { nextPagesKey: ['key-1'], size: 20, page: 1, moreResult: true },
    },
  });

  it('resets communications filters and pagination when opening another campaign', async () => {
    mock
      .onGet(`/bff/v1/notifications/informal/campaigns/${campaignDetailMock.campaignId}`)
      .reply(200, campaignDetailMock);
    mock.onGet(comunicationsListPath).reply(200, comunicationsList);

    await act(async () => {
      result = render(<CampaignDetail />, {
        route: `/campaigns/${campaignDetailMock.campaignId}`,
        path: '/campaigns/:id',
        preloadedState: filteredState('another-campaign'),
      });
    });

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(2);
    });
    expect(mock.history.get[1].url).toBe(comunicationsListPath);
    expect(result.testStore.getState().campaignState.communicationsCampaignId).toBe(
      campaignDetailMock.campaignId
    );
  });

  it('keeps communications filters and pagination when coming back to the same campaign', async () => {
    const filteredComunicationsListPath = `/bff/v1/informal/campaigns/${campaignDetailMock.campaignId}/notifications/sent?startDate=${startParam}&endDate=${endParam}&iunMatch=ABCD-EFGH-IJKL-123456-M-1&size=20&nextPagesKey=key-1`;

    mock
      .onGet(`/bff/v1/notifications/informal/campaigns/${campaignDetailMock.campaignId}`)
      .reply(200, campaignDetailMock);
    mock.onGet(filteredComunicationsListPath).reply(200, comunicationsList);

    await act(async () => {
      result = render(<CampaignDetail />, {
        route: `/campaigns/${campaignDetailMock.campaignId}`,
        path: '/campaigns/:id',
        preloadedState: filteredState(campaignDetailMock.campaignId),
      });
    });

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(2);
    });
    expect(mock.history.get[1].url).toBe(filteredComunicationsListPath);
  });

  it('shows communications filters when applied filters return no results', async () => {
    const filteredComunicationsListPath = `/bff/v1/informal/campaigns/${campaignDetailMock.campaignId}/notifications/sent?startDate=${startParam}&endDate=${endParam}&iunMatch=ABCD-EFGH-IJKL-123456-M-1&size=20&nextPagesKey=key-1`;

    mock
      .onGet(`/bff/v1/notifications/informal/campaigns/${campaignDetailMock.campaignId}`)
      .reply(200, campaignDetailMock);
    mock
      .onGet(filteredComunicationsListPath)
      .reply(200, { resultsPage: [], moreResult: false, nextPagesKey: [] });

    await act(async () => {
      result = render(<CampaignDetail />, {
        route: `/campaigns/${campaignDetailMock.campaignId}`,
        path: '/campaigns/:id',
        preloadedState: filteredState(campaignDetailMock.campaignId),
      });
    });

    await waitFor(() => {
      expect(result.getByTestId('campaignsList')).toBeInTheDocument();
    });
    expect(
      result.queryByText('detail.communications.no-communications-title')
    ).not.toBeInTheDocument();
  });

  it('resets communications pagination when applying filters', async () => {
    const paginatedState = {
      campaignState: {
        campaigns: [],
        campaignDetail: {},
        communicationsCampaignId: campaignDetailMock.campaignId,
        campaignCommunications: comunicationsList,
        communicationFilters: {
          recipientId: '',
          iunMatch: '',
          status: [],
          outcome: '',
        },
        pagination: { nextPagesKey: [], size: 10, page: 0, moreResult: false },
        communicationsPagination: {
          nextPagesKey: ['key-1'],
          size: 10,
          page: 0,
          moreResult: true,
        },
      },
    };

    const filteredComunicationsListPath = `/bff/v1/informal/campaigns/${campaignDetailMock.campaignId}/notifications/sent?startDate=${startParam}&endDate=${endParam}&iunMatch=ABCD-EFGH-IJKL-123456-M-1&size=10`;

    mock
      .onGet(`/bff/v1/notifications/informal/campaigns/${campaignDetailMock.campaignId}`)
      .reply(200, campaignDetailMock);

    mock.onGet(comunicationsListPath).reply(200, comunicationsList);

    mock.onGet(filteredComunicationsListPath).reply(200, {
      resultsPage: comunicationsList.resultsPage?.slice(0, 2) ?? [],
      moreResult: false,
      nextPagesKey: [],
    });

    await act(async () => {
      result = render(<CampaignDetail />, {
        route: `/campaigns/${campaignDetailMock.campaignId}`,
        path: '/campaigns/:id',
        preloadedState: paginatedState,
      });
    });

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(2);
    });

    fireEvent.change(result.getByLabelText('detail.communications.iun'), {
      target: { value: 'ABCD-EFGH-IJKL-123456-M-1' },
    });

    fireEvent.click(
      result.getByRole('button', {
        name: 'button.filtra',
      })
    );

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(3);
    });

    expect(mock.history.get[2].url).toBe(filteredComunicationsListPath);

    expect(result.testStore.getState().campaignState.communicationsPagination).toEqual({
      nextPagesKey: [],
      size: 10,
      page: 0,
      moreResult: false,
    });

    expect(result.container.querySelector('#page2')).not.toBeInTheDocument();
  });

  it('filters delivered communications excluding viewed ones', async () => {
    const deliveredCommunicationsListPath =
      `/bff/v1/informal/campaigns/${campaignDetailMock.campaignId}/notifications/sent` +
      `?startDate=${startParam}&endDate=${endParam}&viewed=false&delivered=true&size=10`;

    mock
      .onGet(`/bff/v1/notifications/informal/campaigns/${campaignDetailMock.campaignId}`)
      .reply(200, campaignDetailMock);

    mock.onGet(comunicationsListPath).reply(200, comunicationsList);

    mock.onGet(deliveredCommunicationsListPath).reply(200, {
      resultsPage: comunicationsList.resultsPage?.filter(
        (communication) =>
          communication.communicationOutcomes?.delivered &&
          !communication.communicationOutcomes?.viewed
      ),
      moreResult: false,
      nextPagesKey: [],
    });

    await act(async () => {
      result = render(<CampaignDetail />, {
        route: `/campaigns/${campaignDetailMock.campaignId}`,
        path: '/campaigns/:id',
      });
    });

    await waitFor(() => {
      expect(result.getByTestId('campaignsList')).toBeInTheDocument();
    });

    fireEvent.mouseDown(
      result.getByTestId('communicationOutcome').querySelector('[role="combobox"]')!
    );

    const deliveredOption = await result.findByRole('option', {
      name: 'detail.communications.outcomes.delivered',
    });

    fireEvent.click(deliveredOption);

    fireEvent.click(
      result.getByRole('button', {
        name: 'button.filtra',
      })
    );

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(3);
    });

    expect(mock.history.get[2].url).toBe(deliveredCommunicationsListPath);
  });
});
