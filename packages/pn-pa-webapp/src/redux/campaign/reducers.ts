import { createSlice } from '@reduxjs/toolkit';

import { BffCampaignDetailResponseV1 } from '../../generated-client/sender-informal-notifications';
import { getCampaignDetail } from './actions';

const initialState = {
  campaignDetail: {} as BffCampaignDetailResponseV1,
};

/* eslint-disable functional/immutable-data */
const campaignSlice = createSlice({
  name: 'campaignSlice',
  initialState,
  reducers: {
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getCampaignDetail.fulfilled, (state, action) => {
      state.campaignDetail = action.payload;
    });
  },
});

export const { resetState } = campaignSlice.actions;

export default campaignSlice;
