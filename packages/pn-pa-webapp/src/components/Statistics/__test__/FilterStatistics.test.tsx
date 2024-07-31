import { add } from 'date-fns';
import { vi } from 'vitest';

import {
  formatDate,
  formatToSlicedISOString,
  oneMonthAgo,
  sixMonthsAgo,
  today,
} from '@pagopa-pn/pn-commons';
import { testCalendar, testFormElements, testInput } from '@pagopa-pn/pn-commons/src/test-utils';

import { fireEvent, render, testStore, waitFor, within } from '../../../__test__/test-utils';
import { SelectedStatisticsFilter, StatisticsFilter } from '../../../models/Statistics';
import FilterStatistics, { defaultValues } from '../FilterStatistics';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'it' },
  }),
}));

const lastDate = new Date('2024-03-14T00:00:00.000Z');

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
    await testCalendar(filterContainer, 'startDate');
  });

  it('test endDate input', async () => {
    // render component
    const { getByTestId } = render(<FilterStatistics filter={defaultValues} lastDate={null} />);
    const filterContainer = getByTestId('statistics-filter') as HTMLDivElement;
    await testInput(filterContainer, 'startDate', '14/03/2012');
    await testInput(filterContainer, 'endDate', '22/02/2022');
    await testCalendar(filterContainer, 'endDate');
  });

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
