import MockAdapter from 'axios-mock-adapter';

import { AppResponseMessage, ResponseEventDispatcher } from '@pagopa-pn/pn-commons';

import { campaignDetailMock } from '../../__mocks__/CampaignDetail.mock';
import { RenderResult, act, fireEvent, render, waitFor } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import CampaignDetail from '../CampaignDetail.page';

describe('CampaignDetail Page', () => {
  let result: RenderResult;
  let mock: MockAdapter;

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

    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toBe(
      `/bff/v1/notifications/informal/campaigns/${campaignDetailMock.campaignId}`
    );
  });

  it('renders empty state when campaign detail is empty', async () => {
    mock.onGet('/bff/v1/notifications/informal/campaigns/empty-campaign').reply(200, {});

    await act(async () => {
      result = render(<CampaignDetail />, {
        route: '/campaigns/empty-campaign',
        path: '/campaigns/:id',
      });
    });

    await waitFor(() => {
      expect(result.getByText('[Titolo campagna]')).toBeInTheDocument();
    });

    expect(
      result.getByText('[Descrizione della campagna compilata in fase di inserimento]')
    ).toBeInTheDocument();

    expect(result.getByText('00/00/0000')).toBeInTheDocument();
    expect(result.getByText('000')).toBeInTheDocument();
    expect(result.getByText('[nome servizio]')).toBeInTheDocument();
  });

  it('renders api error when campaign detail request fails', async () => {
    mock
      .onGet(`/bff/v1/notifications/informal/campaigns/${campaignDetailMock.campaignId}`)
      .reply(500);

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

    await waitFor(() => {
      expect(result.getByTestId('emptyState')).toBeInTheDocument();
    });

    expect(
      result.getByRole('button', {
        name: 'detail.empty-state.generic-error-cta',
      })
    ).toBeInTheDocument();
  });

  it('retries campaign detail request', async () => {
    mock
      .onGet(`/bff/v1/notifications/informal/campaigns/${campaignDetailMock.campaignId}`)
      .reply(500);

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

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(1);
    });

    fireEvent.click(
      result.getByRole('button', {
        name: 'detail.empty-state.generic-error-cta',
      })
    );

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(2);
    });
  });
});
