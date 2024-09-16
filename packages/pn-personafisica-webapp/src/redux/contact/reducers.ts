import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';

import { AddressType, ChannelType, DigitalAddress, IOAllowedValues } from '../../models/contacts';
import { Party } from '../../models/party';
import { RootState } from '../store';
import {
  createOrUpdateAddress,
  deleteAddress,
  disableIOAddress,
  enableIOAddress,
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
    builder.addCase(enableIOAddress.fulfilled, (state) => {
      const addressIndex = state.digitalAddresses.findIndex(
        (address) =>
          address.channelType === ChannelType.IOMSG && address.addressType === AddressType.COURTESY
      );
      if (addressIndex > -1) {
        state.digitalAddresses[addressIndex].value = IOAllowedValues.ENABLED;
      }
    });
    builder.addCase(disableIOAddress.fulfilled, (state) => {
      const addressIndex = state.digitalAddresses.findIndex(
        (address) =>
          address.channelType === ChannelType.IOMSG && address.addressType === AddressType.COURTESY
      );
      if (addressIndex > -1) {
        state.digitalAddresses[addressIndex].value = IOAllowedValues.DISABLED;
      }
    });
    builder.addCase(getAllActivatedParties.fulfilled, (state, action) => {
      state.parties = action.payload;
    });
  },
});

export const { resetState, resetPecValidation } = contactsSlice.actions;

// START: SELECTORS
const contactState = (state: RootState) => state.contactsState;

const digitalAddresses = createSelector(
  [contactState],
  (contactsState) => contactsState.digitalAddresses
);

export type SelectedAddresses = {
  addresses: Array<DigitalAddress>;
  legalAddresses: Array<DigitalAddress>;
  courtesyAddresses: Array<DigitalAddress>;
  specialAddresses: Array<DigitalAddress>;
} & { [key in `default${ChannelType}Address`]: DigitalAddress | undefined } & {
  [key in `special${ChannelType}Addresses`]: Array<DigitalAddress>;
};

const memoizedSelectAddresses = createSelector([digitalAddresses], (digitalAddresses) => {
  const initialValue = {
    addresses: digitalAddresses,
    legalAddresses: [] as Array<DigitalAddress>,
    courtesyAddresses: [] as Array<DigitalAddress>,
    specialAddresses: [] as Array<DigitalAddress>,
  } as SelectedAddresses;
  for (const channelType of Object.values(ChannelType)) {
    initialValue[`default${channelType}Address`] = undefined;
    initialValue[`special${channelType}Addresses`] = [];
  }
  return digitalAddresses.reduce((obj, addr) => {
    if (addr.addressType === AddressType.LEGAL) {
      obj.legalAddresses.push(addr);
    }
    if (addr.addressType === AddressType.COURTESY) {
      obj.courtesyAddresses.push(addr);
    }
    if (addr.senderId === 'default') {
      obj[`default${addr.channelType}Address`] = addr;
    }
    if (addr.senderId !== 'default') {
      obj[`special${addr.channelType}Addresses`].push(addr);
      obj.specialAddresses.push(addr);
    }
    return obj;
  }, initialValue);
});

export const contactsSelectors = {
  selectAddresses: memoizedSelectAddresses,
};
// END: SELECTORS

export default contactsSlice;
