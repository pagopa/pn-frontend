import { add } from 'date-fns';
import { vi } from 'vitest';

import {
  formatDate,
  formatToSlicedISOString,
  oneMonthAgo,
  sixMonthsAgo,
  today,
} from '@pagopa-pn/pn-commons';
import { testFormElements, testInput } from '@pagopa-pn/pn-commons/src/test-utils';

import {
  RenderResult,
  act,
  fireEvent,
  render,
  screen,
  testStore,
  waitFor,
  within,
} from '../../../__test__/test-utils';
import { SelectedStatisticsFilter, StatisticsFilter } from '../../../models/Statistics';
import FilterStatistics, { defaultValues } from '../FilterStatistics';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'it' },
  }),
}));

const initialValues = defaultValues;
const last6MonthsFilterValue: StatisticsFilter = {
  startDate: sixMonthsAgo,
  endDate: today,
  selected: SelectedStatisticsFilter.last6Months,
};
const quickFilters = Object.values(SelectedStatisticsFilter).filter((value) => value !== 'custom');

async function testCalendar(form: HTMLElement, elementName: string) {
  const input = form.querySelector(`input[name="${elementName}"]`);
  const button = input?.parentElement!.querySelector(`button`);
  fireEvent.click(button!);
  const dialog = screen.getByRole('dialog');
  expect(dialog).toBeInTheDocument();
  const dateButton = document.evaluate(
    `//button[text()="1"]`,
    document,
    null,
    XPathResult.ANY_TYPE,
    null
  );
  fireEvent.click(dateButton.iterateNext()!);
  await waitFor(() => {
    expect(input).toHaveValue('01/06/2024');
    expect(dialog).not.toBeInTheDocument();
  });
}

describe('FilterStatistics component', async () => {
  let result: RenderResult;
  let filterContainer: HTMLDivElement | undefined;

  const original = window.matchMedia;

  afterAll(() => {
    window.matchMedia = original;
  });

  it('renders default filter', async () => {
    // render component
    await act(async () => {
      result = render(<FilterStatistics filter={initialValues} />);
    });

    filterContainer = result.container.querySelector(
      `div[data-testid=statistics-filter]`
    ) as HTMLDivElement;
    expect(filterContainer).toBeInTheDocument();

    quickFilters.forEach((filter) => {
      const quickFilter = filterContainer?.querySelector(`button[data-testid="filter.${filter}"`);
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
      formatDate(formatToSlicedISOString(initialValues.startDate), false)
    );
    testFormElements(
      filterContainer,
      'endDate',
      'filter.to_date',
      formatDate(formatToSlicedISOString(initialValues.endDate), false)
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

  it('test startDate input', async () => {
    // render component
    await act(async () => {
      result = render(<FilterStatistics filter={initialValues} />);
    });

    filterContainer = result.container.querySelector(
      'div[data-testid=statistics-filter]'
    ) as HTMLDivElement;
    await testInput(filterContainer, 'startDate', '22/06/2024');
    await testCalendar(filterContainer, 'startDate');
  });

  it('test endDate input', async () => {
    // render component
    await act(async () => {
      result = render(<FilterStatistics filter={initialValues} />);
    });
    filterContainer = result.container.querySelector(
      'div[data-testid=statistics-filter]'
    ) as HTMLDivElement;
    await testInput(filterContainer, 'endDate', '22/06/2024');
    await testCalendar(filterContainer, 'endDate');
  });

  it('changes filtered dates using quick filters', async () => {
    // render component
    await act(async () => {
      result = render(<FilterStatistics filter={initialValues} />);
    });

    filterContainer = result.container.querySelector(
      `div[data-testid=statistics-filter]`
    ) as HTMLDivElement;

    const defaultFilter = filterContainer?.querySelector(
      `button[data-testid="filter.${initialValues.selected}"`
    );
    const newFilter = filterContainer?.querySelector(`button[data-testid="filter.last6Months"`);
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

  it('changes filtered dates using date pickers - reset', async () => {
    // render component
    await act(async () => {
      result = render(<FilterStatistics filter={initialValues} />);
    });

    filterContainer = result.container.querySelector(
      `div[data-testid=statistics-filter]`
    ) as HTMLDivElement;

    const defaultFilter = filterContainer?.querySelector(
      `button[data-testid="filter.${initialValues.selected}"`
    );

    const submitButton = within(filterContainer).getByTestId('filterButton');
    const cancelButton = within(filterContainer).getByTestId('cancelButton');

    expect(defaultFilter).toBeDisabled();
    expect(submitButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();

    await testInput(
      filterContainer,
      'endDate',
      formatDate(formatToSlicedISOString(add(today, { days: -1 })))
    );
    expect(submitButton).toBeEnabled();
    expect(cancelButton).toBeEnabled();

    await testInput(filterContainer, 'startDate', formatDate(formatToSlicedISOString(oneMonthAgo)));

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(testStore.getState().statisticsState.filter).toStrictEqual({
        startDate: oneMonthAgo,
        endDate: add(today, { days: -1 }),
        selected: SelectedStatisticsFilter.custom,
      });
    });

    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(testStore.getState().statisticsState.filter).toStrictEqual(initialValues);
    });
  });
});
