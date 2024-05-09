/* eslint-disable functional/immutable-data */
import { createSlice } from '@reduxjs/toolkit';

import { getStatistics } from './actions';
import { StatisticsResponse } from './types';

const initialState = {
  loading: false,
  statistics: {} as StatisticsResponse,
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
