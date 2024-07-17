import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import {
  AppResponseMessage,
  ResponseEventDispatcher,
  formatToSlicedISOString,
  sixMonthsAgo,
  today,
  twelveMonthsAgo,
} from '@pagopa-pn/pn-commons';
import { initLocalizationForTest, testInput } from '@pagopa-pn/pn-commons/src/test-utils';
import { fireEvent, waitFor, within } from '@testing-library/react';

import { userResponse } from '../../__mocks__/Auth.mock';
import { rawEmptyResponseMock, rawResponseMock } from '../../__mocks__/Statistics.mock';
import { render } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import Statistics from '../Statistics.page';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'it' },
  }),
}));

const dateFormatter = (date: Date) => {
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  return `${day}/${month}/${date.getFullYear()}`;
};

describe('Statistics Page tests', () => {
  let mock: MockAdapter;

  const originalClientHeight = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'clientHeight'
  );
  const originalClientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth');

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
    // we need this, because the element taken with useRef doesn't have height and width
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
      configurable: true,
      value: 200,
    });
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      value: 200,
    });
    initLocalizationForTest();
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
      value: originalClientHeight,
      configurable: true,
    });
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      value: originalClientWidth,
      configurable: true,
    });
  });

  it('renders Statistics Page - empty statistics', () => {
    mock.onGet(/\/bff\/v1\/sender-dashboard\/dashboard-data-request*/).reply(200, null);
    const { container } = render(<Statistics />, {
      preloadedState: {
        userState: { user: userResponse },
      },
    });

    expect(container).toHaveTextContent('title');
    expect(container).toHaveTextContent('empty.not_enough_data');
  });

  it('renders Statistics Page - no statistics for selected dates range', async () => {
    mock
      .onGet(/\/bff\/v1\/sender-dashboard\/dashboard-data-request*/)
      .reply(200, rawEmptyResponseMock);
    const { container, getByTestId, getAllByTestId } = render(<Statistics />, {
      preloadedState: {
        userState: { user: userResponse },
      },
    });

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(1);
    });

    // checks Page title and subtitle
    expect(container).toHaveTextContent('title');
    expect(container).toHaveTextContent('subtitle');

    // checks the export jpg button
    const exportJpgButton = getByTestId('exportJpgButton');
    expect(exportJpgButton).toBeInTheDocument();

    // checks last datetime update
    expect(container).toHaveTextContent('last_update');

    // checks filters
    const statisticsFilter = getAllByTestId('statistics-filter');
    expect(statisticsFilter).toHaveLength(1);

    // checks section 1
    expect(container).toHaveTextContent('section_1');
    expect(statisticsFilter[0]).toHaveTextContent('filter.lastMonth');
    expect(statisticsFilter[0]).toHaveTextContent('filter.last3Months');
    expect(statisticsFilter[0]).toHaveTextContent('filter.last6Months');
    expect(statisticsFilter[0]).toHaveTextContent('filter.last12Months');
    expect(statisticsFilter[0]).toHaveTextContent('filter.buttons.filter');
    expect(statisticsFilter[0]).toHaveTextContent('filter.buttons.clear_filter');
    const confirmBtn = within(statisticsFilter[0]).getByTestId('filterButton');
    const cancelBtn = within(statisticsFilter[0]).getByTestId('cancelButton');
    expect(confirmBtn).toBeDisabled();
    expect(cancelBtn).toBeDisabled();

    const emptyStatistics = getByTestId('emptyStatistics');
    const emptyComponentsImage = within(emptyStatistics).getByTestId('empty-image');

    expect(emptyStatistics).toHaveTextContent('empty.no_data_found');
    expect(emptyComponentsImage).toBeInTheDocument();
  });

  it('renders Statistics Page - data available', async () => {
    mock.onGet(/\/bff\/v1\/sender-dashboard\/dashboard-data-request*/).reply(200, rawResponseMock);
    const { container, getAllByTestId, getByTestId } = render(<Statistics />, {
      preloadedState: {
        userState: { user: userResponse },
      },
    });

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(1);
    });

    // checks Page title and subtitle
    expect(container).toHaveTextContent('title');
    expect(container).toHaveTextContent('subtitle');

    // checks filters
    const statisticsFilters = getAllByTestId('statistics-filter');
    expect(statisticsFilters).toHaveLength(2);

    // checks sections
    expect(container).toHaveTextContent('section_1');
    expect(container).toHaveTextContent('section_2');
    for (const statisticsFilter of statisticsFilters) {
      expect(statisticsFilter).toHaveTextContent('filter.lastMonth');
      expect(statisticsFilter).toHaveTextContent('filter.last3Months');
      expect(statisticsFilter).toHaveTextContent('filter.last6Months');
      expect(statisticsFilter).toHaveTextContent('filter.last12Months');
      expect(statisticsFilter).toHaveTextContent('filter.buttons.filter');
      expect(statisticsFilter).toHaveTextContent('filter.buttons.clear_filter');
      const confirmBtn = within(statisticsFilter).getByTestId('filterButton');
      const cancelBtn = within(statisticsFilter).getByTestId('cancelButton');
      expect(confirmBtn).toBeDisabled();
      expect(cancelBtn).toBeDisabled();
    }

    // checks charts
    const filedNotifications = getByTestId('filedNotifications');
    const lastState = getByTestId('lastStateContainer');
    const deliveryMode = getByTestId('deliveryMode');
    const digitalState = getByTestId('digitalStateContainer');
    const digitalMeanTime = getByTestId('digitalMeanTimeContainer');
    const digitalErrorsDetail = getByTestId('digitalErrorsDetail');

    expect(filedNotifications).toBeInTheDocument();
    expect(lastState).toBeInTheDocument();
    expect(deliveryMode).toBeInTheDocument();
    expect(digitalState).toBeInTheDocument();
    expect(digitalMeanTime).toBeInTheDocument();
    expect(digitalErrorsDetail).toBeInTheDocument();
  });

  it('filters Statistics Page', async () => {
    mock.onGet(/\/bff\/v1\/sender-dashboard\/dashboard-data-request*/).reply(200, rawResponseMock);
    const { getAllByTestId } = render(<Statistics />, {
      preloadedState: {
        userState: { user: userResponse },
      },
    });

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(1);
      expect(mock.history.get[0].url).toBe(
        `/bff/v1/sender-dashboard/dashboard-data-request/PA/${
          userResponse.organization.id
        }?startDate=${formatToSlicedISOString(twelveMonthsAgo)}&endDate=${formatToSlicedISOString(
          today
        )}`
      );
    });

    // checks filters
    const statisticsFilters = getAllByTestId('statistics-filter');
    expect(statisticsFilters).toHaveLength(2);

    // select fast filter (6 months)
    const last6MonthsFilter = within(statisticsFilters[0]).getByTestId('filter.last6Months');
    fireEvent.click(last6MonthsFilter);

    // checks that dates filter are updated
    await waitFor(() => {
      for (const statisticsFilter of statisticsFilters) {
        const startDate = statisticsFilter.querySelector(`input[name="startDate"]`);
        expect(startDate).toHaveValue(dateFormatter(sixMonthsAgo));
        const endDate = statisticsFilter.querySelector(`input[name="endDate"]`);
        expect(endDate).toHaveValue(dateFormatter(today));
        const confirmBtn = within(statisticsFilter).getByTestId('filterButton');
        const cancelBtn = within(statisticsFilter).getByTestId('cancelButton');
        expect(confirmBtn).toBeDisabled();
        expect(cancelBtn).toBeEnabled();
      }
    });

    // checks that the api is called correctly
    expect(mock.history.get).toHaveLength(2);
    expect(mock.history.get[1].url).toBe(
      `/bff/v1/sender-dashboard/dashboard-data-request/PA/${
        userResponse.organization.id
      }?startDate=${formatToSlicedISOString(sixMonthsAgo)}&endDate=${formatToSlicedISOString(
        today
      )}`
    );

    // cancel filters
    let cancelBtn = within(statisticsFilters[0]).getByTestId('cancelButton');
    fireEvent.click(cancelBtn);

    // checks that dates filter are updated
    await waitFor(() => {
      for (const statisticsFilter of statisticsFilters) {
        const startDate = statisticsFilter.querySelector(`input[name="startDate"]`);
        expect(startDate).toHaveValue(dateFormatter(twelveMonthsAgo));
        const endDate = statisticsFilter.querySelector(`input[name="endDate"]`);
        expect(endDate).toHaveValue(dateFormatter(today));
        const confirmBtn = within(statisticsFilter).getByTestId('filterButton');
        const cancelBtn = within(statisticsFilter).getByTestId('cancelButton');
        expect(confirmBtn).toBeDisabled();
        expect(cancelBtn).toBeDisabled();
      }
    });

    // checks that the api is called correctly
    expect(mock.history.get).toHaveLength(3);
    expect(mock.history.get[2].url).toBe(
      `/bff/v1/sender-dashboard/dashboard-data-request/PA/${
        userResponse.organization.id
      }?startDate=${formatToSlicedISOString(twelveMonthsAgo)}&endDate=${formatToSlicedISOString(
        today
      )}`
    );

    // set custom date
    await testInput(statisticsFilters[1], 'startDate', '22/02/2022');
    await testInput(statisticsFilters[1], 'endDate', '13/05/2024');
    const confirmBtn = within(statisticsFilters[1]).getByTestId('filterButton');
    cancelBtn = within(statisticsFilters[1]).getByTestId('cancelButton');
    expect(confirmBtn).toBeEnabled();
    expect(cancelBtn).toBeEnabled();

    // confirm filters
    fireEvent.click(confirmBtn);

    // checks that dates filter are updated
    await waitFor(() => {
      for (const statisticsFilter of statisticsFilters) {
        const startDate = statisticsFilter.querySelector(`input[name="startDate"]`);
        expect(startDate).toHaveValue('22/02/2022');
        const endDate = statisticsFilter.querySelector(`input[name="endDate"]`);
        expect(endDate).toHaveValue('13/05/2024');
        const confirmBtn = within(statisticsFilter).getByTestId('filterButton');
        const cancelBtn = within(statisticsFilter).getByTestId('cancelButton');
        expect(confirmBtn).toBeDisabled();
        expect(cancelBtn).toBeEnabled();
      }
    });

    // checks that the api is called correctly
    expect(mock.history.get).toHaveLength(4);
    expect(mock.history.get[3].url).toBe(
      `/bff/v1/sender-dashboard/dashboard-data-request/PA/${userResponse.organization.id}?startDate=2022-02-22&endDate=2024-05-13`
    );
  });

  it('api returns error', async () => {
    mock.onGet(/\/bff\/v1\/sender-dashboard\/dashboard-data-request*/).reply(500);
    const { container } = render(
      <>
        <ResponseEventDispatcher />
        <AppResponseMessage />
        <Statistics />
      </>,
      {
        preloadedState: {
          userState: { user: userResponse },
        },
      }
    );
    await waitFor(() => {
      expect(container).toHaveTextContent('error-fetch');
    });
  });
});
