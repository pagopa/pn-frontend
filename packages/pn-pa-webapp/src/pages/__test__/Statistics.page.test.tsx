import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { AppResponseMessage, ResponseEventDispatcher } from '@pagopa-pn/pn-commons';

import { userResponse } from '../../__mocks__/Auth.mock';
import {
  parsedEmptyResponseMock,
  parsedResponseMock, // parsedEmptyResponseMock,
  rawEmptyResponseMock,
  rawResponseMock, // rawResponseMock,
} from '../../__mocks__/Statistics.mock';
import { RenderResult, act, render, waitFor } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import Statistics from '../Statistics.page';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'it' },
  }),
}));

vi.mock('@pagopa-pn/pn-data-viz', async () => {
  return {
    ...(await vi.importActual<any>('@pagopa-pn/pn-data-viz')),
    PnECharts: () => 'mocked-chart',
  };
});

describe('Statistics Page tests', () => {
  let result: RenderResult;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
  });

  it('renders Statistics Page - empty statistics', () => {
    mock.onGet(/\/bff\/v1\/sender-dashboard\/dashboard-data-request*/).reply(200, null);
    const result = render(<Statistics />, {
      preloadedState: {
        userState: { user: userResponse },
      },
    });

    expect(result.container).toHaveTextContent('title');
    expect(result.container).toHaveTextContent('empty.description');
  });

  it('renders Statistics Page - no statistics for selected dates range', async () => {
    mock
      .onGet(/\/bff\/v1\/sender-dashboard\/dashboard-data-request*/)
      .reply(200, rawEmptyResponseMock);
    const result = render(<Statistics />, {
      preloadedState: {
        userState: { user: userResponse },
        statisticsState: { statistics: parsedEmptyResponseMock },
      },
    });

    // checks Page title and subtitle
    expect(result.container).toHaveTextContent('title');
    await waitFor(() => result.getByText('subtitle'));

    // checks last datetime update
    expect(result.container).toHaveTextContent('last_update');

    // checks section 1
    expect(result.container).toHaveTextContent('section_1');
    expect(result.container).toHaveTextContent('filter.lastMonth');
    expect(result.container).toHaveTextContent('filter.last3Months');
    expect(result.container).toHaveTextContent('filter.last6Months');
    expect(result.container).toHaveTextContent('filter.last12Months');

    const emptyComponentsText = result.getAllByText('empty.no_data_found');
    const emptyComponentsImage = await result.findAllByTestId('empty-image');

    /**
     * Fix the following 2 assertions after merging task PN-11564
     * expect(emptyComponentsText.length).toBe(1);
     * expect(emptyComponentsImage.length).toBe(1);
     * expect(result.container).not.toHaveTextContent('section2');
     */
    expect(emptyComponentsText.length).toBe(6);
    expect(emptyComponentsImage.length).toBe(6);
    expect(result.container).toHaveTextContent('section_2');
  });

  it('renders Statistics Page - data available', async () => {
    mock.onGet(/\/bff\/v1\/sender-dashboard\/dashboard-data-request*/).reply(200, rawResponseMock);
    const result = render(<Statistics />, {
      preloadedState: {
        userState: { user: userResponse },
        statisticsState: { statistics: parsedResponseMock },
      },
    });

    result.getByText('title');
    const lastMonth = result.getAllByText('filter.lastMonth');
    const last3Months = result.getAllByText('filter.last3Months');
    const last6MonthsTxt = result.getAllByText('filter.last6Months');
    const last12MonthsTxt = result.getAllByText('filter.last12Months');
    const filterBtn = result.getAllByText('filter.buttons.filter');
    const clearFilterBtn = result.getAllByText('filter.buttons.clear_filter');
    const charts = result.getAllByText('mocked-chart');

    expect(result.container).toHaveTextContent('section_2');
    expect(lastMonth.length).toBe(2);
    expect(last3Months.length).toBe(2);
    expect(last6MonthsTxt.length).toBe(2);
    expect(last12MonthsTxt.length).toBe(2);
    expect(filterBtn.length).toBe(2);
    expect(filterBtn[0]).toBeDisabled();
    expect(filterBtn[1]).toBeDisabled();
    expect(clearFilterBtn.length).toBe(2);
    expect(clearFilterBtn[0]).toBeDisabled();
    expect(clearFilterBtn[1]).toBeDisabled();
    expect(charts.length).toBe(6);
  });

  it('api return error', async () => {
    mock.onGet(/\/bff\/v1\/sender-dashboard\/dashboard-data-request*/).reply(500);
    await act(async () => {
      result = render(
        <>
          <ResponseEventDispatcher />
          <AppResponseMessage />
          <Statistics />
        </>
      );
    });
    expect(result.container).toHaveTextContent('error-fetch');
  });
});
