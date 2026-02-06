import { clampMax, getEndOfDay, subtractMonthsFromDate, today } from '@pagopa-pn/pn-commons';

import { SelectedStatisticsFilter, StatisticsFilter } from '../models/Statistics';

export const normalizeStatisticsFilter = (
  filter: StatisticsFilter,
  lastDate: Date | null
): StatisticsFilter => {
  const maxEndDate = getEndOfDay(lastDate ?? today);

  // Quick Filters: always related to maxEndDate
  if (filter.selected !== SelectedStatisticsFilter.custom) {
    const startDate = (() => {
      switch (filter.selected) {
        case SelectedStatisticsFilter.lastMonth:
          return subtractMonthsFromDate(maxEndDate, 1, 1);
        case SelectedStatisticsFilter.last3Months:
          return subtractMonthsFromDate(maxEndDate, 3, 1);
        case SelectedStatisticsFilter.last6Months:
          return subtractMonthsFromDate(maxEndDate, 6, 1);
        case SelectedStatisticsFilter.last12Months:
        default:
          return subtractMonthsFromDate(maxEndDate, 12, 1);
      }
    })();

    return { ...filter, startDate, endDate: maxEndDate };
  }

  // Custom filter: clamp end <= maxEndDate
  const endDate = clampMax(filter.endDate, maxEndDate);
  return { ...filter, endDate };
};
