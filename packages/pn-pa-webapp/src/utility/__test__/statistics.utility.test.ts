import { getEndOfDay, subtractMonthsFromDate } from '@pagopa-pn/pn-commons';

import { SelectedStatisticsFilter, StatisticsFilter } from '../../models/Statistics';
import { normalizeStatisticsFilter } from '../statistics.utility';

const lastDate = new Date('1980-06-22T10:00:00.000Z');
const maxEndDate = getEndOfDay(lastDate);

/**
 * Provides a valid StatisticsFilter shape for normalization tests.
 * The concrete start/end values are not significant for quick filters, since the normalizer
 * recomputes them from the selected preset and the computed maxEndDate.
 */
const makeBaseFilter = (overrides?: Partial<StatisticsFilter>): StatisticsFilter => ({
  selected: SelectedStatisticsFilter.last12Months,
  startDate: new Date('1979-01-01T00:00:00.000Z'),
  endDate: new Date('1979-12-31T00:00:00.000Z'),
  ...overrides,
});

/**
 * Normalizes a filter using a fixed lastDate to ensure deterministic expectations.
 */
const normalizeWithLastDate = (overrides?: Partial<StatisticsFilter>) =>
  normalizeStatisticsFilter(makeBaseFilter(overrides), lastDate);

describe('normalizeStatisticsFilter', () => {
  it('anchors quick filters to maxEndDate and computes the correct startDate for lastMonth', () => {
    const result = normalizeWithLastDate({ selected: SelectedStatisticsFilter.lastMonth });

    expect(result.endDate).toEqual(maxEndDate);
    expect(result.startDate).toEqual(subtractMonthsFromDate(maxEndDate, 1, 1));
  });

  it('anchors quick filters to maxEndDate and computes the correct startDate for last3Months', () => {
    const result = normalizeWithLastDate({ selected: SelectedStatisticsFilter.last3Months });

    expect(result.endDate).toEqual(maxEndDate);
    expect(result.startDate).toEqual(subtractMonthsFromDate(maxEndDate, 3, 1));
  });

  it('anchors quick filters to maxEndDate and computes the correct startDate for last6Months', () => {
    const result = normalizeWithLastDate({ selected: SelectedStatisticsFilter.last6Months });

    expect(result.endDate).toEqual(maxEndDate);
    expect(result.startDate).toEqual(subtractMonthsFromDate(maxEndDate, 6, 1));
  });

  it('anchors quick filters to maxEndDate and computes the correct startDate for last12Months', () => {
    const result = normalizeWithLastDate({ selected: SelectedStatisticsFilter.last12Months });

    expect(result.endDate).toEqual(maxEndDate);
    expect(result.startDate).toEqual(subtractMonthsFromDate(maxEndDate, 12, 1));
  });

  it('clamps custom endDate to maxEndDate while preserving startDate', () => {
    const startDate = new Date('1980-01-10T00:00:00.000Z');
    const endDateAfterMax = new Date('1980-12-31T00:00:00.000Z');

    const result = normalizeWithLastDate({
      selected: SelectedStatisticsFilter.custom,
      startDate,
      endDate: endDateAfterMax,
    });

    expect(result.startDate).toEqual(startDate);
    expect(result.endDate).toEqual(maxEndDate);
  });

  it('keeps custom endDate unchanged when it is already within bounds', () => {
    const okEndDate = new Date('1980-06-01T00:00:00.000Z');

    const result = normalizeWithLastDate({
      selected: SelectedStatisticsFilter.custom,
      endDate: okEndDate,
    });

    expect(result.endDate).toEqual(okEndDate);
  });
});
