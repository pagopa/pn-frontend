import { createSlice } from '@reduxjs/toolkit';
import { DigitalAddress } from '../../models/contacts';
import { acceptDelegation, rejectDelegation } from '../delegation/actions';
import { Delegator } from '../delegation/types';
import { getDomicileInfo, getSidemenuInformation, closeDomicileBanner } from './actions';

/* eslint-disable functional/immutable-data */
const generalInfoSlice = createSlice({
  name: 'generalInfoSlice',
  initialState: {
    pendingDelegators: 0,
    delegators: [] as Array<Delegator>,
    legalDomicile: [] as Array<DigitalAddress>,
    domicileBannerOpened: true
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSidemenuInformation.fulfilled, (state, action) => {
      state.pendingDelegators = action.payload.filter(
        (delegator) => delegator.status === 'pending'
      ).length;
      state.delegators = action.payload.filter((delegator) => delegator.status !== 'pending');
    });
    builder.addCase(getDomicileInfo.fulfilled, (state, action) => {
      state.legalDomicile = action.payload;
    });
    builder.addCase(closeDomicileBanner, (state) => {
      state.domicileBannerOpened = false;
    });
    builder.addCase(acceptDelegation.fulfilled, (state) => {
      state.pendingDelegators--;
    });
    builder.addCase(rejectDelegation.fulfilled, (state, action) => {
      const startingDelegatorsNum = state.delegators.length;
      state.delegators = state.delegators.filter((delegator) => delegator.mandateId !== action.meta.arg);
      // delegation was still in 'pending' state if no delegator has been removed
      if(startingDelegatorsNum === state.delegators.length) {
        state.pendingDelegators--;// so we also need to update pendingDelegators state
      }
    });
  },
});

export default generalInfoSlice;
