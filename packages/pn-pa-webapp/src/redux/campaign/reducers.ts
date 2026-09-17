import { createSlice } from '@reduxjs/toolkit';

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
  reducers: {},
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
  },
});

export default campaignSlice;
