import { createSlice } from '@reduxjs/toolkit';

import {
  BffCampaignDetailResponseV1,
  CampaignSummary,
} from '../../generated-client/informal-notifications';
import { getCampaignDetail, getCampaigns } from './actions';

const initialState = {
  campaigns: [] as Array<CampaignSummary>,
  campaignDetail: {} as BffCampaignDetailResponseV1,
  pagination: {
    nextPagesKey: [] as Array<string>,
    size: 10,
    page: 0,
    moreResult: false,
  },
};

/* eslint-disable functional/immutable-data */
const campaignSlice = createSlice({
  name: 'campaignSlice',
  initialState,
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

    resetCampaignDetail: (state) => {
      state.campaignDetail = {} as BffCampaignDetailResponseV1;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getCampaigns.fulfilled, (state, action) => {
      const { page, size } = action.meta.arg;
      const hasSizeChanged = state.pagination.size !== size;

      state.campaigns = action.payload.resultsPage;
      state.pagination.page = page;
      state.pagination.size = size;
      state.pagination.moreResult = action.payload.moreResult;

      if (hasSizeChanged) {
        state.pagination.nextPagesKey = [];
      }

      if (action.payload.nextPagesKey) {
        for (const pageKey of action.payload.nextPagesKey) {
          if (state.pagination.nextPagesKey.indexOf(pageKey) === -1) {
            state.pagination.nextPagesKey.push(pageKey);
          }
        }
      }
    });

    builder.addCase(getCampaignDetail.fulfilled, (state, action) => {
      state.campaignDetail = action.payload;
    });
  },
});

export const { setPagination, resetCampaignDetail } = campaignSlice.actions;

export default campaignSlice;
