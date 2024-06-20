/* eslint-disable functional/immutable-data */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { StatisticsFilter, StatisticsParsedResponse } from '../../models/Statistics';
import { getStatistics } from './actions';

const initialState = {
  loading: false,
  statistics: null as StatisticsParsedResponse | null,
  filter: null as StatisticsFilter | null,
};

const statisticsSlice = createSlice({
  name: 'statisticsSlice',
  initialState,
  reducers: {
    resetState: () => initialState,
    setStatisticsFilter: (state, action: PayloadAction<StatisticsFilter | null>) => {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getStatistics.fulfilled, (state, action) => {
      state.statistics = action.payload;
    });
  },
});

export const { resetState, setStatisticsFilter } = statisticsSlice.actions;

export default statisticsSlice;
