import { createSlice } from '@reduxjs/toolkit';

import { DigitalAddress } from '../../models/contacts';
import { removeAddress, updateAddressesList } from '../../utility/contacts.utility';
import { createOrUpdateAddress, deleteAddress, getDigitalAddresses } from '../contact/actions';
import { acceptMandate, rejectMandate } from '../delegation/actions';
import { Delegator } from '../delegation/types';
import { getSidemenuInformation } from './actions';

/* eslint-disable functional/immutable-data */
const generalInfoSlice = createSlice({
  name: 'generalInfoSlice',
  initialState: {
    pendingDelegators: 0,
    delegators: [] as Array<Delegator>,
    digitalAddresses: [] as Array<DigitalAddress>,
    domicileBannerOpened: true,
  },
  reducers: {
    closeDomicileBanner: (state) => {
      state.domicileBannerOpened = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSidemenuInformation.fulfilled, (state, action) => {
      state.pendingDelegators = action.payload.filter(
        (delegator) => delegator.status === 'pending'
      ).length;
      state.delegators = action.payload.filter((delegator) => delegator.status !== 'pending');
    });
    builder.addCase(getDigitalAddresses.fulfilled, (state, action) => {
      state.digitalAddresses = action.payload;
    });
    builder.addCase(createOrUpdateAddress.fulfilled, (state, action) => {
      if (action.payload) {
        updateAddressesList(
          action.meta.arg.addressType,
          action.meta.arg.channelType,
          action.meta.arg.senderId,
          state.digitalAddresses,
          action.payload
        );
      }
    });
    builder.addCase(deleteAddress.fulfilled, (state, action) => {
      state.digitalAddresses = removeAddress(
        action.meta.arg.addressType,
        action.meta.arg.channelType,
        action.meta.arg.senderId,
        state.digitalAddresses
      );
    });
    builder.addCase(acceptMandate.fulfilled, (state) => {
      if (state.pendingDelegators > 0) {
        state.pendingDelegators--;
      }
    });
    builder.addCase(rejectMandate.fulfilled, (state, action) => {
      const startingDelegatorsNum = state.delegators.length;
      state.delegators = state.delegators.filter(
        (delegator) => delegator.mandateId !== action.meta.arg
      );
      // delegation was still in 'pending' state if no delegator has been removed
      if (startingDelegatorsNum === state.delegators.length && state.pendingDelegators > 0) {
        state.pendingDelegators--; // so we also need to update pendingDelegators state
      }
    });
  },
});

export const { closeDomicileBanner } = generalInfoSlice.actions;

export default generalInfoSlice;
