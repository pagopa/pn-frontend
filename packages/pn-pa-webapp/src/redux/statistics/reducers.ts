/* eslint-disable functional/immutable-data */
import { isEqual } from 'lodash-es';

import {
  NotificationStatus,
  getDateFromString,
  today,
  twelveMonthsAgo,
} from '@pagopa-pn/pn-commons';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import {
  SelectedStatisticsFilter,
  StatisticsDataTypes,
  StatisticsFilter,
  StatisticsParsedResponse,
} from '../../models/Statistics';
import { normalizeStatisticsFilter } from '../../utility/statistics.utility';
import { RootState } from '../store';
import { getStatistics } from './actions';

const initialState = {
  loading: false,
  statistics: null as StatisticsParsedResponse | null,
  filter: {
    startDate: twelveMonthsAgo,
    endDate: today,
    selected: SelectedStatisticsFilter.last12Months,
  } as StatisticsFilter,
};

const statisticsSlice = createSlice({
  name: 'statisticsSlice',
  initialState,
  reducers: {
    resetState: () => initialState,
    setStatisticsFilter: (state, action: PayloadAction<StatisticsFilter>) => {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getStatistics.fulfilled, (state, action) => {
      state.statistics = action.payload;

      const parsedLastDate = action.payload?.lastDate
        ? getDateFromString(action.payload.lastDate, 'yyyy-MM-dd')
        : null;

      const nextFilter = normalizeStatisticsFilter(state.filter, parsedLastDate);

      if (!isEqual(nextFilter, state.filter)) {
        state.filter = nextFilter;
      }
    });
  },
});

export const { resetState, setStatisticsFilter } = statisticsSlice.actions;

export const hasData = (state: RootState) => {
  const accepted =
    state.statisticsState.statistics?.data?.[StatisticsDataTypes.FiledStatistics][
      NotificationStatus.ACCEPTED
    ];
  const refused =
    state.statisticsState.statistics?.data?.[StatisticsDataTypes.FiledStatistics][
      NotificationStatus.REFUSED
    ];
  return accepted && refused && (accepted.count > 0 || refused.count > 0);
};

export default statisticsSlice;
