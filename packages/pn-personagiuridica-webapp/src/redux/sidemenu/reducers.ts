import { createSlice, isAnyOf } from '@reduxjs/toolkit';

import { DigitalAddress } from '../../models/contacts';
import { removeAddress, updateAddressesList } from '../../utility/contacts.utility';
import { createOrUpdateAddress, deleteAddress, getDigitalAddresses } from '../contact/actions';
import { acceptMandate, rejectMandate } from '../delegation/actions';
import { getSidemenuInformation } from './actions';

/* eslint-disable functional/immutable-data */
const generalInfoSlice = createSlice({
  name: 'generalInfoSlice',
  initialState: {
    pendingDelegators: 0,
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
      state.pendingDelegators = action.payload;
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
    builder.addMatcher(isAnyOf(acceptMandate.fulfilled, rejectMandate.fulfilled), (state) => {
      if (state.pendingDelegators > 0) {
        state.pendingDelegators--;
      }
    });
  },
});

export const { closeDomicileBanner } = generalInfoSlice.actions;

export default generalInfoSlice;
