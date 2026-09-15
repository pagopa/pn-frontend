import MockAdapter from 'axios-mock-adapter';

import { AppResponseMessage, ResponseEventDispatcher } from '@pagopa-pn/pn-commons';

import { campaignsDTO } from '../../__mocks__/Campaigns.mock';
import { errorMock } from '../../__mocks__/Errors.mock';
import { RenderResult, act, fireEvent, render, screen, waitFor } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import { GET_CAMPAIGN_DETAIL_PATH } from '../../navigation/routes.const';
import Campaigns from '../Campaigns.page';

describe('Campaigns Page', () => {
  let result: RenderResult;
  let mock: MockAdapter;

  const campaignsPath = '/bff/v1/notifications/informal/campaigns?size=10';

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('renders campaigns and performs the initial API request', async () => {
    mock.onGet(campaignsPath).reply(200, campaignsDTO);

    await act(async () => {
      result = render(<Campaigns />);
    });

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(1);
    });

    expect(mock.history.get[0].url).toBe(campaignsPath);

    expect(screen.getByRole('heading')).toHaveTextContent('list.title');

    campaignsDTO.resultsPage.forEach((campaign) => {
      expect(result.getByText(campaign.title)).toBeInTheDocument();
      expect(result.getByText(campaign.campaignId)).toBeInTheDocument();
    });

    expect(result.getAllByText('button.open')).toHaveLength(campaignsDTO.resultsPage.length);
  });

  it('navigates to campaign detail', async () => {
    mock.onGet(campaignsPath).reply(200, campaignsDTO);

    await act(async () => {
      result = render(<Campaigns />);
    });

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(1);
    });

    const openButtons = result.getAllByText('button.open');
    fireEvent.click(openButtons[0]);

    expect(result.router.state.location.pathname).toBe(
      GET_CAMPAIGN_DETAIL_PATH(campaignsDTO.resultsPage[0].campaignId)
    );
  });

  it('shows the empty state when there are no campaigns', async () => {
    mock.onGet(campaignsPath).reply(200, {
      resultsPage: [],
      moreResult: false,
    });

    await act(async () => {
      result = render(<Campaigns />);
    });

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(1);
    });

    expect(result.getByText('list.empty-state.no-campaigns')).toBeInTheDocument();
  });

  it('shows the error state and retries the API request', async () => {
    mock
      .onGet(campaignsPath)
      .replyOnce(errorMock.status, errorMock.data)
      .onGet(campaignsPath)
      .reply(200, campaignsDTO);

    await act(async () => {
      result = render(
        <>
          <ResponseEventDispatcher />
          <AppResponseMessage />
          <Campaigns />
        </>
      );
    });

    await waitFor(() => {
      expect(result.getByText('list.empty-state.generic-error')).toBeInTheDocument();
    });

    fireEvent.click(result.getByText('list.empty-state.generic-error-cta'));

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(2);
    });

    campaignsDTO.resultsPage.forEach((campaign) => {
      expect(result.getByText(campaign.title)).toBeInTheDocument();
    });
  });
});
