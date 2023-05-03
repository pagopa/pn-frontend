import { createSlice, isAnyOf } from '@reduxjs/toolkit';

import { DigitalAddress } from '../../models/contacts';
import { acceptDelegation, rejectDelegation } from '../delegation/actions';
import { getDomicileInfo, getSidemenuInformation } from './actions';

/* eslint-disable functional/immutable-data */
const generalInfoSlice = createSlice({
  name: 'generalInfoSlice',
  initialState: {
    pendingDelegators: 0,
    legalDomicile: [] as Array<DigitalAddress>,
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
    builder.addCase(getDomicileInfo.fulfilled, (state, action) => {
      state.legalDomicile = action.payload;
    });
    builder.addMatcher(isAnyOf(acceptDelegation.fulfilled, rejectDelegation.fulfilled), (state) => {
      if (state.pendingDelegators > 0) {
        state.pendingDelegators--;
      }
    });
  },
});

export const { closeDomicileBanner } = generalInfoSlice.actions;

export default generalInfoSlice;
