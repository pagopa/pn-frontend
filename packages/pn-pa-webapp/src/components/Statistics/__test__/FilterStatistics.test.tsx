import { add } from 'date-fns';
import { vi } from 'vitest';

import {
  formatDate,
  formatToSlicedISOString,
  oneMonthAgo,
  sixMonthsAgo,
  today,
  twelveMonthsAgo,
} from '@pagopa-pn/pn-commons';
import { testCalendar, testFormElements, testInput } from '@pagopa-pn/pn-commons/src/test-utils';

import { fireEvent, render, testStore, waitFor, within } from '../../../__test__/test-utils';
import { SelectedStatisticsFilter, StatisticsFilter } from '../../../models/Statistics';
import FilterStatistics from '../FilterStatistics';

const lastDate = new Date();
lastDate.setDate(lastDate.getDate() - 5);

const defaultValues: StatisticsFilter = {
  startDate: twelveMonthsAgo,
  endDate: today,
  selected: SelectedStatisticsFilter.last12Months,
};

const last6MonthsFilterValue: StatisticsFilter = {
  startDate: sixMonthsAgo,
  endDate: today,
  selected: SelectedStatisticsFilter.last6Months,
};

const quickFilters = Object.values(SelectedStatisticsFilter).filter((value) => value !== 'custom');

describe('FilterStatistics component', async () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders default filter - lastDate null', async () => {
    // render component
    const { getByTestId } = render(<FilterStatistics filter={defaultValues} lastDate={null} />);

    const filterContainer = getByTestId('statistics-filter');
    expect(filterContainer).toBeInTheDocument();

    quickFilters.forEach((filter) => {
      const quickFilter = filterContainer.querySelector(`button[data-testid="filter.${filter}"`);
      if (filter === defaultValues.selected) {
        expect(quickFilter).toBeDisabled();
      } else {
        expect(quickFilter).toBeEnabled();
      }
    });
    testFormElements(
      filterContainer,
      'startDate',
      'filter.from_date',
      formatDate(formatToSlicedISOString(defaultValues.startDate), false)
    );
    testFormElements(
      filterContainer,
      'endDate',
      'filter.to_date',
      formatDate(formatToSlicedISOString(defaultValues.endDate), false)
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

  it('renders default filter - lastDate not null', async () => {
    // render component
    const { getByTestId } = render(
      <FilterStatistics filter={{ ...defaultValues, endDate: lastDate }} lastDate={lastDate} />
    );

    const filterContainer = getByTestId('statistics-filter');
    expect(filterContainer).toBeInTheDocument();

    testFormElements(
      filterContainer,
      'endDate',
      'filter.to_date',
      formatDate(formatToSlicedISOString(lastDate), false)
    );
    const submitButton = within(filterContainer).getByTestId('filterButton');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
    const cancelButton = within(filterContainer).getByTestId('cancelButton');
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toBeDisabled();
  });

  it('test startDate input', async () => {
    // render component
    const { getByTestId } = render(<FilterStatistics filter={defaultValues} lastDate={null} />);
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
    const { getByTestId } = render(<FilterStatistics filter={defaultValues} lastDate={null} />);
    const filterContainer = getByTestId('statistics-filter') as HTMLDivElement;
    await testInput(filterContainer, 'startDate', '14/03/2012');
    await testInput(filterContainer, 'endDate', '22/02/2022');
    await testCalendar(filterContainer, 'endDate', new Date('2017-05-22'), new Date('2022-02-22'));
  }, 10000);

  it('changes filtered dates using quick filters', async () => {
    // render component
    const { getByTestId } = render(<FilterStatistics filter={defaultValues} lastDate={null} />);
    const filterContainer = getByTestId('statistics-filter');

    const defaultFilter = within(filterContainer).getByTestId(`filter.${defaultValues.selected}`);

    const newFilter = filterContainer.querySelector(`button[data-testid="filter.last6Months"`);
    const submitButton = within(filterContainer).getByTestId('filterButton');
    const cancelButton = within(filterContainer).getByTestId('cancelButton');

    expect(defaultFilter).toBeDisabled();
    expect(newFilter).toBeEnabled();
    expect(submitButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();

    fireEvent.click(newFilter!);

    await waitFor(() => {
      expect(testStore.getState().statisticsState.filter).toStrictEqual(last6MonthsFilterValue);
    });
  });

  it('changes filtered dates using quick filters and with lastDate valued', async () => {
    // render component
    const { getByTestId } = render(
      <FilterStatistics filter={{ ...defaultValues, endDate: lastDate }} lastDate={lastDate} />
    );
    const filterContainer = getByTestId('statistics-filter');

    const defaultFilter = within(filterContainer).getByTestId(`filter.${defaultValues.selected}`);

    const newFilter = filterContainer.querySelector(`button[data-testid="filter.last6Months"`);
    const submitButton = within(filterContainer).getByTestId('filterButton');
    const cancelButton = within(filterContainer).getByTestId('cancelButton');

    expect(defaultFilter).toBeDisabled();
    expect(newFilter).toBeEnabled();
    expect(submitButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();

    fireEvent.click(newFilter!);

    await waitFor(() => {
      expect(testStore.getState().statisticsState.filter).toStrictEqual({
        ...last6MonthsFilterValue,
        endDate: lastDate,
      });
    });
  });

  it('should show chip disabled when startDate is greater than endDate', async () => {
    // set lastDate to a date before last month, so that the lastMonth chip is disabled because the endDate is before the startDate
    const endDate = add(lastDate, { months: -1, days: -1 });
    const { getByTestId } = render(<FilterStatistics filter={defaultValues} lastDate={endDate} />);

    const filterContainer = getByTestId('statistics-filter');
    const lastMonthChip = filterContainer.querySelector(`button[data-testid="filter.lastMonth"`);
    expect(lastMonthChip).toBeDisabled();
  });

  it('changes filtered dates using date pickers - reset', async () => {
    // render component
    const { getByTestId } = render(<FilterStatistics filter={defaultValues} lastDate={null} />);
    const filterContainer = getByTestId('statistics-filter');

    const defaultFilter = within(filterContainer).getByTestId(`filter.${defaultValues.selected}`);

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

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(testStore.getState().statisticsState.filter).toStrictEqual({
        startDate: oneMonthAgo,
        endDate: endDate,
        selected: SelectedStatisticsFilter.custom,
      });
    });

    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(testStore.getState().statisticsState.filter).toStrictEqual(defaultValues);
    });
  });
});
