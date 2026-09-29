import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import {
  BffCampaignDetailResponseV1,
  BffInformalSenderNotificationSearchResponse,
  CampaignSummary,
  InformalNotificationStatusV1,
} from '../../generated-client/informal-notifications';
import { getCampaignCommunications, getCampaignDetail, getCampaigns } from './actions';

export const initialCommunicationFilters = {
  recipientId: '',
  iunMatch: '',
  status: [] as Array<InformalNotificationStatusV1>,
  outcome: '',
};

export const initialCommunicationsPagination = {
  nextPagesKey: [] as Array<string>,
  size: 10,
  page: 0,
  moreResult: false,
};

const initialState = {
  campaigns: [] as Array<CampaignSummary>,
  campaignDetail: {} as BffCampaignDetailResponseV1,
  communicationsCampaignId: '',
  campaignCommunications: {} as BffInformalSenderNotificationSearchResponse,
  communicationFilters: initialCommunicationFilters,
  pagination: {
    nextPagesKey: [] as Array<string>,
    size: 10,
    page: 0,
    moreResult: false,
  },
  communicationsPagination: initialCommunicationsPagination,
};

/* eslint-disable functional/immutable-data */
const campaignSlice = createSlice({
  name: 'campaignSlice',
  initialState,
  reducers: {
    resetCampaignDetail: (state) => {
      state.campaignDetail = {} as BffCampaignDetailResponseV1;
    },
    resetCampaignCommunications: (state, action: PayloadAction<string>) => {
      state.communicationsCampaignId = action.payload;
      state.campaignCommunications = initialState.campaignCommunications;
      state.communicationFilters = initialCommunicationFilters;
      state.communicationsPagination = initialCommunicationsPagination;
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
      const { page, size, iunMatch, recipientId, status, viewed, delivered } = action.meta.arg;
      const hasSizeChanged = state.communicationsPagination.size !== size;
      state.campaignCommunications = action.payload;
      // set pagination
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
      // set filters
      state.communicationFilters.iunMatch = iunMatch ?? '';
      state.communicationFilters.recipientId = recipientId ?? '';
      state.communicationFilters.status = status ?? [];
      if (viewed) {
        state.communicationFilters.outcome = 'viewed';
      } else if (delivered) {
        state.communicationFilters.outcome = 'delivered';
      } else {
        state.communicationFilters.outcome = '';
      }
    });
  },
});

export const { resetCampaignDetail, resetCampaignCommunications } = campaignSlice.actions;

export default campaignSlice;
