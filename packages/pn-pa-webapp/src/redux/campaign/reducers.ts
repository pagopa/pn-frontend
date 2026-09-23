import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import {
  BffCampaignDetailResponseV1,
  BffInformalSenderNotificationSearchResponse,
  CampaignSummary,
} from '../../generated-client/informal-notifications';
import { getCampaignCommunications, getCampaignDetail, getCampaigns } from './actions';

const initialState = {
  campaigns: [] as Array<CampaignSummary>,
  campaignDetail: {} as BffCampaignDetailResponseV1,
  campaignCommunications: {} as BffInformalSenderNotificationSearchResponse,
  communicationFilters: {
    recipientId: '',
    iunMatch: '',
    status: '',
    outcome: '',
  },
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

    setCommunicationFilters: (
      state,
      action: PayloadAction<{
        recipientId: string;
        iunMatch: string;
        status: string;
        outcome: string;
      }>
    ) => {
      state.communicationFilters = action.payload;
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

    builder.addCase(getCampaignCommunications.fulfilled, (state, action) => {
      state.campaignCommunications = action.payload;
    });
  },
});

export const { setPagination, resetCampaignDetail, setCommunicationFilters } =
  campaignSlice.actions;

export default campaignSlice;
