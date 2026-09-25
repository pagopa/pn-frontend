import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import {
  BffCampaignDetailResponseV1,
  BffInformalSenderNotificationSearchResponse,
  CampaignSummary,
  InformalNotificationStatusV1,
} from '../../generated-client/informal-notifications';
import { getCampaignCommunications, getCampaignDetail, getCampaigns } from './actions';

const initialState = {
  campaigns: [] as Array<CampaignSummary>,
  campaignDetail: {} as BffCampaignDetailResponseV1,
  campaignCommunications: {} as BffInformalSenderNotificationSearchResponse,
  communicationFilters: {
    recipientId: '',
    iunMatch: '',
    status: [] as Array<InformalNotificationStatusV1>,
    outcome: '',
  },
  pagination: {
    nextPagesKey: [] as Array<string>,
    size: 10,
    page: 0,
    moreResult: false,
  },
  communicationsPagination: {
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

    resetCommunicationsPagination: (state) => {
      state.communicationsPagination.nextPagesKey = [];
      state.communicationsPagination.page = 0;
      state.communicationsPagination.moreResult = false;
    },

    setCommunicationFilters: (state, action) => {
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
          if (!state.pagination.nextPagesKey.includes(pageKey)) {
            state.pagination.nextPagesKey.push(pageKey);
          }
        }
      }
    });

    builder.addCase(getCampaignDetail.fulfilled, (state, action) => {
      state.campaignDetail = action.payload;
    });

    builder.addCase(getCampaignCommunications.fulfilled, (state, action) => {
      const { page, size } = action.meta.arg;
      const hasSizeChanged = state.communicationsPagination.size !== size;
      state.campaignCommunications = action.payload;
      state.communicationsPagination.page = page;
      state.communicationsPagination.size = size;
      state.communicationsPagination.moreResult = action.payload.moreResult ?? false;

      if (hasSizeChanged) {
        state.communicationsPagination.nextPagesKey = [];
      }

      if (action.payload.nextPagesKey) {
        for (const pageKey of action.payload.nextPagesKey) {
          if (!state.communicationsPagination.nextPagesKey.includes(pageKey)) {
            state.communicationsPagination.nextPagesKey.push(pageKey);
          }
        }
      }
    });
  },
});

export const {
  setPagination,
  resetCampaignDetail,
  setCommunicationFilters,
  resetCommunicationsPagination,
} = campaignSlice.actions;

export default campaignSlice;
