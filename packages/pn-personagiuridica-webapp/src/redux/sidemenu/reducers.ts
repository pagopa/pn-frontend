import { createSlice, isAnyOf } from '@reduxjs/toolkit';

import { acceptMandate, rejectMandate } from '../delegation/actions';
import { getSidemenuInformation } from './actions';

/* eslint-disable functional/immutable-data */
const generalInfoSlice = createSlice({
  name: 'generalInfoSlice',
  initialState: {
    pendingDelegators: 0,
    domicileBannerOpened: true,
  },
  reducers: {
    closeDomicileBanner: (state) => {
      state.domicileBannerOpened = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSidemenuInformation.fulfilled, (state, action) => {
      state.pendingDelegators = action.payload;
    });
    builder.addMatcher(isAnyOf(acceptMandate.fulfilled, rejectMandate.fulfilled), (state) => {
      if (state.pendingDelegators > 0) {
        state.pendingDelegators--;
      }
    });
  },
});

export const { closeDomicileBanner } = generalInfoSlice.actions;

export default generalInfoSlice;
