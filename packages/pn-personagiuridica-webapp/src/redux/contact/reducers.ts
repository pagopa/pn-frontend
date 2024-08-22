import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';

import { AddressType, ChannelType, DigitalAddress } from '../../models/contacts';
import { Party } from '../../models/party';
import { RootState } from '../store';
import {
  createOrUpdateAddress,
  deleteAddress,
  getAllActivatedParties,
  getDigitalAddresses,
} from './actions';

const initialState = {
  loading: false,
  digitalAddresses: [] as Array<DigitalAddress>,
  parties: [] as Array<Party>,
};

/* eslint-disable functional/immutable-data */
const contactsSlice = createSlice({
  name: 'contactsSlice',
  initialState,
  reducers: {
    resetState: () => initialState,
    // we remove the default legal address only interface side, with the goal of letting the user know that needs to add
    // a new email to modify the verifying pec address
    resetPecValidation: (state, action: PayloadAction<string>) => {
      state.digitalAddresses = state.digitalAddresses.filter(
        (address) =>
          (address.senderId !== action.payload && address.addressType === AddressType.LEGAL) ||
          address.addressType === AddressType.COURTESY
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getDigitalAddresses.fulfilled, (state, action) => {
      state.digitalAddresses = action.payload;
    });
    builder.addCase(createOrUpdateAddress.fulfilled, (state, action) => {
      if (action.payload) {
        const addressIndex = state.digitalAddresses.findIndex(
          (l) =>
            l.senderId === action.meta.arg.senderId &&
            l.addressType === action.meta.arg.addressType &&
            l.channelType === action.meta.arg.channelType
        );
        if (addressIndex > -1) {
          state.digitalAddresses[addressIndex] = action.payload;
        } else {
          state.digitalAddresses.push(action.payload);
        }
      }
    });
    builder.addCase(deleteAddress.fulfilled, (state, action) => {
      state.digitalAddresses = state.digitalAddresses.filter(
        (address) =>
          address.senderId !== action.meta.arg.senderId ||
          address.addressType !== action.meta.arg.addressType ||
          address.channelType !== action.meta.arg.channelType
      );
    });
    builder.addCase(getAllActivatedParties.fulfilled, (state, action) => {
      state.parties = action.payload;
    });
  },
});

export const { resetState, resetPecValidation } = contactsSlice.actions;

// START: SELECTORS
const memoizedSelectAddresses = createSelector(
  [
    (state: RootState) => state.contactsState.digitalAddresses,
    (_, channel: ChannelType) => channel,
  ],
  (digitalAddresses, channel) => ({
    addresses: digitalAddresses,
    defaultAddress: digitalAddresses.find(
      (address) => address.senderId === 'default' && address.channelType === channel
    ),
    specialAddresses: digitalAddresses.filter(
      (address) => address.senderId !== 'default' && address.channelType === channel
    ),
  })
);

const memoizedSelectAddressesByType = createSelector(
  [(state: RootState) => state.contactsState.digitalAddresses, (_, type: AddressType) => type],
  (digitalAddresses, type) => digitalAddresses.filter((address) => address.addressType === type)
);

const memoizedSelectDefaultAddress = createSelector(
  [
    (state: RootState) => state.contactsState.digitalAddresses,
    (_, channel: ChannelType) => channel,
  ],
  (digitalAddresses, channel) =>
    digitalAddresses.find(
      (address) => address.senderId === 'default' && address.channelType === channel
    )
);

const memoizedSelectSpecialAddresses = createSelector(
  [
    (state: RootState) => state.contactsState.digitalAddresses,
    (_, channel: ChannelType) => channel,
  ],
  (digitalAddresses, channel) =>
    digitalAddresses.filter(
      (address) => address.senderId !== 'default' && address.channelType === channel
    )
);

export const contactsSelectors = {
  selectAddresses: memoizedSelectAddresses,
  selectAddressesByType: memoizedSelectAddressesByType,
  selectDefaultAddress: memoizedSelectDefaultAddress,
  selectSpecialAddresses: memoizedSelectSpecialAddresses,
};
// END: SELECTORS

export default contactsSlice;
