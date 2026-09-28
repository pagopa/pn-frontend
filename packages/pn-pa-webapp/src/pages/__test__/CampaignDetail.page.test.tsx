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
});
