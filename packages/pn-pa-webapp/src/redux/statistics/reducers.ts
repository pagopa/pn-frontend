/* eslint-disable functional/immutable-data */
import { createSlice } from '@reduxjs/toolkit';

import { StatisticsParsedResponse } from '../../models/Statistics';
import { getStatistics } from './actions';

const initialState = {
  loading: false,
  statistics: null as StatisticsParsedResponse | null,
};

const statisticsSlice = createSlice({
  name: 'statisticsSlice',
  initialState,
  // initialState: {
  //   errors: []
  // },
  reducers: {
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getStatistics.fulfilled, (state, action) => {
      state.statistics = action.payload;
    });
  },
});

export const { resetState } = statisticsSlice.actions;

export default statisticsSlice;
