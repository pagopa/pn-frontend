import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { CampaignSummary } from '../../generated-client/informal-notifications';
import { getCampaigns } from './actions';

/* eslint-disable functional/immutable-data */
const campaignSlice = createSlice({
  name: 'campaignSlice',
  initialState: {
    campaigns: [] as Array<CampaignSummary>,
    pagination: {
      nextPagesKey: [] as Array<string>,
      size: 10,
      page: 0,
      moreResult: false,
    },
  },
  reducers: {
    setPagination: (state, action: PayloadAction<{ page: number; size: number }>) => {
      if (state.pagination.size !== action.payload.size) {
        // reset pagination
        state.pagination.nextPagesKey = [];
        state.pagination.moreResult = false;
      }
      state.pagination.size = action.payload.size;
      state.pagination.page = action.payload.page;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCampaigns.fulfilled, (state, action) => {
      state.campaigns = action.payload.resultsPage;
      state.pagination.moreResult = action.payload.moreResult;

      if (action.payload.nextPagesKey) {
        for (const pageKey of action.payload.nextPagesKey) {
          if (state.pagination.nextPagesKey.indexOf(pageKey) === -1) {
            state.pagination.nextPagesKey.push(pageKey);
          }
        }
      }
    });
  },
});

export const { setPagination } = campaignSlice.actions;

export default campaignSlice;
