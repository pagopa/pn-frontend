import { createSlice } from '@reduxjs/toolkit';

import { DigitalAddresses, DigitalAddress } from './../../models/contacts';
import {
  createOrUpdateCourtesyAddress,
  createOrUpdateLegalAddress,
  deleteLegalAddress,
  getDigitalAddresses,
  resetContactsState,
} from './actions';

const initialState = {
  loading: false,
  digitalAddresses: {
    legal: [],
    courtesy: [],
  } as DigitalAddresses,
};

/* eslint-disable functional/immutable-data */
const contactsSlice = createSlice({
  name: 'contactsSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDigitalAddresses.fulfilled, (state, action) => {
      state.digitalAddresses = action.payload;
    });
    builder.addCase(createOrUpdateLegalAddress.fulfilled, (state, action) => {
      // update or add digital address
      if (action.payload && action.payload.senderId) {
        const addressIndex = state.digitalAddresses.legal.findIndex(
          (l) => l.senderId === (action.payload as DigitalAddress).senderId
        );
        if (addressIndex > -1) {
          state.digitalAddresses.legal[addressIndex] = action.payload;
        } else {
          state.digitalAddresses.legal.push(action.payload);
        }
      }
    });
    builder.addCase(createOrUpdateCourtesyAddress.fulfilled, (state, action) => {
      // update or add courtesy address
      if (action.payload && action.payload.senderId) {
        const addressIndex = state.digitalAddresses.courtesy.findIndex(
          (address) =>
            address.senderId === (action.payload as DigitalAddress).senderId &&
            address.channelType === (action.payload as DigitalAddress).channelType
        );
        if (addressIndex > -1) {
          // update if found
          state.digitalAddresses.courtesy[addressIndex] = action.payload;
        } else {
          state.digitalAddresses.courtesy.push(action.payload);
        }
      }
    });
    builder.addCase(deleteLegalAddress.fulfilled, (state, action) => {
      // remove digital address
      if (action.payload) {
        state.digitalAddresses.legal = state.digitalAddresses.legal.filter(
          (l) => l.senderId !== action.payload
        );
      }
    });
    builder.addCase(resetContactsState, () => initialState);
  },
});

export default contactsSlice;
