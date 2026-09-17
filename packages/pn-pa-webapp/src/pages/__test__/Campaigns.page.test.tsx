import MockAdapter from 'axios-mock-adapter';

import { AppResponseMessage, ResponseEventDispatcher } from '@pagopa-pn/pn-commons';

import {
  campaignsDTO,
  campaignsPage2DTO,
  campaignsSize20DTO,
} from '../../__mocks__/Campaigns.mock';
import { errorMock } from '../../__mocks__/Errors.mock';
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
import { GET_CAMPAIGN_DETAIL_PATH } from '../../navigation/routes.const';
import Campaigns from '../Campaigns.page';

describe('Campaigns Page', () => {
  let result: RenderResult;
  let mock: MockAdapter;

  const campaignsPath = (size = 10, nextPagesKey?: string) =>
    `/bff/v1/notifications/informal/campaigns?size=${size}${
      nextPagesKey ? `&nextPagesKey=${nextPagesKey}` : ''
    }`;

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
    mock.onGet(campaignsPath()).reply(200, campaignsDTO);

    await act(async () => {
      result = render(<Campaigns />);
    });

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(1);
    });

    expect(mock.history.get[0].url).toBe(campaignsPath());

    expect(screen.getByRole('heading')).toHaveTextContent('list.title');

    campaignsDTO.resultsPage.forEach((campaign) => {
      expect(result.getByText(campaign.title)).toBeInTheDocument();
      expect(result.getByText(campaign.campaignId)).toBeInTheDocument();
    });

    expect(result.getAllByText('button.open')).toHaveLength(campaignsDTO.resultsPage.length);
  });

  it('changes page using the next page key', async () => {
    mock.onGet(campaignsPath()).replyOnce(200, campaignsDTO);
    mock.onGet(campaignsPath(10, 'page-key-1')).replyOnce(200, campaignsPage2DTO);

    await act(async () => {
      result = render(<Campaigns />);
    });

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(1);
    });

    const pageSelector = result.getByTestId('pageSelector');
    const pageButtons = within(pageSelector).getAllByRole('button');

    fireEvent.click(pageButtons[2]);

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(2);
    });

    expect(mock.history.get[1].url).toBe(campaignsPath(10, 'page-key-1'));

    campaignsPage2DTO.resultsPage.forEach((campaign) => {
      expect(result.getByText(campaign.title)).toBeInTheDocument();
    });
  });

  it('resets pagination when page size changes', async () => {
    mock.onGet(campaignsPath()).replyOnce(200, campaignsDTO);
    mock.onGet(campaignsPath(10, 'page-key-1')).replyOnce(200, campaignsPage2DTO);
    mock.onGet(campaignsPath(20)).replyOnce(200, campaignsSize20DTO);

    await act(async () => {
      result = render(<Campaigns />);
    });

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(1);
    });

    const pageSelector = result.getByTestId('pageSelector');
    const pageButtons = within(pageSelector).getAllByRole('button');

    fireEvent.click(pageButtons[2]);

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(2);
    });

    expect(mock.history.get[1].url).toBe(campaignsPath(10, 'page-key-1'));

    const rowsPerPageButton = result.container.querySelector('#rows-per-page');

    fireEvent.click(rowsPerPageButton!);
    fireEvent.click(await result.findByTestId('pageSize-20'));

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(3);
    });

    expect(mock.history.get[2].url).toBe(campaignsPath(20));
    await waitFor(() => {
      expect(result.container.querySelector('#page1')).toHaveAttribute('aria-current', 'true');
      expect(result.container.querySelector('#page2')).not.toHaveAttribute('aria-current');
    });
  });

  it('navigates to campaign detail', async () => {
    mock.onGet(campaignsPath()).reply(200, campaignsDTO);

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
    mock.onGet(campaignsPath()).reply(200, {
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
      .onGet(campaignsPath())
      .replyOnce(errorMock.status, errorMock.data)
      .onGet(campaignsPath())
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
