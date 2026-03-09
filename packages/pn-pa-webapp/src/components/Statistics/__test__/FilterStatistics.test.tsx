import { add } from 'date-fns';
import { vi } from 'vitest';

import {
  formatDate,
  formatToSlicedISOString,
  oneMonthAgo,
  today,
  twelveMonthsAgo,
} from '@pagopa-pn/pn-commons';
import { testCalendar, testFormElements, testInput } from '@pagopa-pn/pn-commons/src/test-utils';

import { fireEvent, render, waitFor, within } from '../../../__test__/test-utils';
import { SelectedStatisticsFilter, StatisticsFilter } from '../../../models/Statistics';
import { normalizeStatisticsFilter } from '../../../utility/statistics.utility';
import FilterStatistics from '../FilterStatistics';

const lastDate = new Date('1980-06-22T10:00:00.000Z');

const quickFilters = Object.values(SelectedStatisticsFilter).filter((value) => value !== 'custom');

type BuildStatisticsFilterArgs = {
  selected?: StatisticsFilter['selected'];
  startDate?: Date;
  endDate?: Date;
  lastDate: Date | null;
};

const buildStatisticsFilter = ({
  lastDate,
  selected = SelectedStatisticsFilter.last12Months,
  startDate = twelveMonthsAgo,
  endDate = today,
}: BuildStatisticsFilterArgs): StatisticsFilter => {
  return normalizeStatisticsFilter({ selected, startDate, endDate }, lastDate);
};

const defaultFilterNoLastDate = buildStatisticsFilter({
  lastDate: null,
  selected: SelectedStatisticsFilter.last12Months,
});

const defaultFilterWithLastDate = buildStatisticsFilter({
  lastDate,
  selected: SelectedStatisticsFilter.last12Months,
});

const last6MonthsNoLastDate = buildStatisticsFilter({
  lastDate: null,
  selected: SelectedStatisticsFilter.last6Months,
});

const last6MonthsWithLastDate = buildStatisticsFilter({
  lastDate,
  selected: SelectedStatisticsFilter.last6Months,
});

describe('FilterStatistics component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders default filter - lastDate null', () => {
    // render component
    const { getByTestId } = render(
      <FilterStatistics filter={defaultFilterNoLastDate} lastDate={null} />
    );

    const filterContainer = getByTestId('statistics-filter');
    expect(filterContainer).toBeInTheDocument();

    quickFilters.forEach((filter) => {
      const quickFilter = within(filterContainer).getByTestId(`filter.${filter}`);
      if (filter === defaultFilterNoLastDate.selected) {
        expect(quickFilter).toBeDisabled();
      } else {
        expect(quickFilter).toBeEnabled();
      }
    });
    testFormElements(
      filterContainer,
      'startDate',
      'filter.from_date',
      formatDate(formatToSlicedISOString(defaultFilterNoLastDate.startDate), false)
    );
    testFormElements(
      filterContainer,
      'endDate',
      'filter.to_date',
      formatDate(formatToSlicedISOString(defaultFilterNoLastDate.endDate), false)
    );
    const submitButton = within(filterContainer).getByTestId('filterButton');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/filter.buttons.filter/i);
    const cancelButton = within(filterContainer).getByTestId('cancelButton');
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toBeDisabled();
    expect(cancelButton).toHaveTextContent(/filter.buttons.clear_filter/i);
  });

  it('renders default filter - lastDate not null', () => {
    // render component
    const { getByTestId } = render(
      <FilterStatistics filter={defaultFilterWithLastDate} lastDate={lastDate} />
    );

    const filterContainer = getByTestId('statistics-filter');
    expect(filterContainer).toBeInTheDocument();

    testFormElements(
      filterContainer,
      'endDate',
      'filter.to_date',
      formatDate(formatToSlicedISOString(defaultFilterWithLastDate.endDate), false)
    );
    const submitButton = within(filterContainer).getByTestId('filterButton');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
    const cancelButton = within(filterContainer).getByTestId('cancelButton');
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toBeDisabled();
  });

  it('disables submit when endDate is after lastDate', async () => {
    // render component
    const { getByTestId } = render(
      <FilterStatistics filter={defaultFilterWithLastDate} lastDate={lastDate} />
    );

    const filterContainer = getByTestId('statistics-filter');
    const submitButton = within(filterContainer).getByTestId('filterButton');
    const cancelButton = within(filterContainer).getByTestId('cancelButton');

    // Make the form dirty by setting an out-of-bounds endDate
    await testInput(filterContainer, 'endDate', '23/06/1980');

    await waitFor(() => {
      expect(cancelButton).toBeEnabled();
      expect(submitButton).toBeDisabled();
    });
  });

  it('test startDate input', async () => {
    // render component
    const { getByTestId } = render(
      <FilterStatistics filter={defaultFilterNoLastDate} lastDate={null} />
    );
    const filterContainer = getByTestId('statistics-filter') as HTMLDivElement;
    await testInput(filterContainer, 'startDate', '22/02/2022');
    await testCalendar(
      filterContainer,
      'startDate',
      new Date('2019-12-14'),
      new Date('2022-02-22')
    );
  }, 10000);

  it('test endDate input', async () => {
    // render component
    const { getByTestId } = render(
      <FilterStatistics filter={defaultFilterNoLastDate} lastDate={null} />
    );
    const filterContainer = getByTestId('statistics-filter') as HTMLDivElement;
    await testInput(filterContainer, 'startDate', '14/03/2012');
    await testInput(filterContainer, 'endDate', '22/02/2022');
    await testCalendar(filterContainer, 'endDate', new Date('2017-05-22'), new Date('2022-02-22'));
  }, 10000);

  it('changes filtered dates using quick filters', async () => {
    // render component
    const { getByTestId, testStore } = render(
      <FilterStatistics filter={defaultFilterNoLastDate} lastDate={null} />
    );
    const filterContainer = getByTestId('statistics-filter');

    const defaultFilter = within(filterContainer).getByTestId(
      `filter.${defaultFilterNoLastDate.selected}`
    );

    const newFilter = within(filterContainer).getByTestId('filter.last6Months');
    const submitButton = within(filterContainer).getByTestId('filterButton');
    const cancelButton = within(filterContainer).getByTestId('cancelButton');

    expect(defaultFilter).toBeDisabled();
    expect(newFilter).toBeEnabled();
    expect(submitButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();

    fireEvent.click(newFilter!);

    await waitFor(() => {
      expect(testStore.getState().statisticsState.filter).toStrictEqual(last6MonthsNoLastDate);
    });
  });

  it('changes filtered dates using quick filters and with lastDate valued', async () => {
    // render component
    const { getByTestId, testStore } = render(
      <FilterStatistics filter={defaultFilterWithLastDate} lastDate={lastDate} />
    );
    const filterContainer = getByTestId('statistics-filter');

    const defaultFilter = within(filterContainer).getByTestId(
      `filter.${defaultFilterWithLastDate.selected}`
    );

    const newFilter = within(filterContainer).getByTestId('filter.last6Months');
    const submitButton = within(filterContainer).getByTestId('filterButton');
    const cancelButton = within(filterContainer).getByTestId('cancelButton');

    expect(defaultFilter).toBeDisabled();
    expect(newFilter).toBeEnabled();
    expect(submitButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();

    fireEvent.click(newFilter!);

    await waitFor(() => {
      expect(testStore.getState().statisticsState.filter).toStrictEqual(last6MonthsWithLastDate);
    });
  });

  it('changes filtered dates using date pickers - reset', async () => {
    // render component
    const { getByTestId, testStore } = render(
      <FilterStatistics filter={defaultFilterNoLastDate} lastDate={null} />
    );
    const filterContainer = getByTestId('statistics-filter');

    const defaultFilter = within(filterContainer).getByTestId(
      `filter.${defaultFilterNoLastDate.selected}`
    );

    const submitButton = within(filterContainer).getByTestId('filterButton');
    const cancelButton = within(filterContainer).getByTestId('cancelButton');

    expect(defaultFilter).toBeDisabled();
    expect(submitButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();

    const endDate = add(today, { days: -6 });
    await testInput(filterContainer, 'startDate', formatDate(formatToSlicedISOString(oneMonthAgo)));
    await testInput(filterContainer, 'endDate', formatDate(formatToSlicedISOString(endDate)));
    expect(submitButton).toBeEnabled();
    expect(cancelButton).toBeEnabled();

    const expectedCustom = buildStatisticsFilter({
      lastDate: null,
      selected: SelectedStatisticsFilter.custom,
      startDate: oneMonthAgo,
      endDate: endDate,
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(testStore.getState().statisticsState.filter).toStrictEqual(expectedCustom);
    });

    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(testStore.getState().statisticsState.filter).toStrictEqual(defaultFilterNoLastDate);
    });
  });

  it('clear filter resets form if dates were edited but not submitted', async () => {
    const { getByTestId } = render(
      <FilterStatistics filter={defaultFilterNoLastDate} lastDate={null} />
    );

    const filterContainer = getByTestId('statistics-filter');

    const submitButton = within(filterContainer).getByTestId('filterButton');
    const cancelButton = within(filterContainer).getByTestId('cancelButton');

    // initial state
    expect(submitButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();

    // change dates without submitting the request
    await testInput(filterContainer, 'startDate', '10/06/1980');
    await testInput(filterContainer, 'endDate', '01/08/1988');

    expect(cancelButton).toBeEnabled();

    fireEvent.click(cancelButton);

    await waitFor(() => {
      const startDateInput = within(filterContainer).getByLabelText(
        'filter.from_date-input-aria-label'
      );
      const endDateInput = within(filterContainer).getByLabelText(
        'filter.to_date-input-aria-label'
      );

      expect(startDateInput).toHaveValue(
        formatDate(formatToSlicedISOString(defaultFilterNoLastDate.startDate), false)
      );
      expect(endDateInput).toHaveValue(
        formatDate(formatToSlicedISOString(defaultFilterNoLastDate.endDate), false)
      );

      expect(submitButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();
    });
  });
});
