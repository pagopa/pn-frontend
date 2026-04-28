import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';

import {
  AddressType,
  ChannelType,
  DigitalAddress,
  ExternalEvent,
  IOAllowedValues,
} from '../../models/contacts';
import { Party } from '../../models/party';
import {
  groupDigitalAddresses,
  removeAddress,
  updateAddressesList,
} from '../../utility/contacts.utility';
import { RootState } from '../store';
import {
  createOrUpdateAddress,
  deleteAddress,
  disableIOAddress,
  enableIOAddress,
  getAllActivatedParties,
  getDigitalAddresses,
} from './actions';

const initialState: {
  loading: boolean;
  digitalAddresses: Array<DigitalAddress>;
  parties: Array<Party>;
  event: ExternalEvent | null;
} = {
  loading: false,
  digitalAddresses: [],
  parties: [],
  event: null,
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
    setExternalEvent: (state, action: PayloadAction<ExternalEvent>) => {
      state.event = action.payload;
    },
    resetExternalEvent: (state) => {
      state.event = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getDigitalAddresses.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getDigitalAddresses.fulfilled, (state, action) => {
      state.digitalAddresses = action.payload;
      state.loading = false;
    });
    builder.addCase(getDigitalAddresses.rejected, (state) => {
      state.loading = false;
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

export const { resetState, resetPecValidation, setExternalEvent, resetExternalEvent } =
  contactsSlice.actions;

// START: SELECTORS
const contactState = (state: RootState) => state.contactsState;

const digitalAddresses = createSelector(
  [contactState],
  (contactsState) => contactsState.digitalAddresses
);

const loading = createSelector([contactState], (contactsState) => contactsState.loading);

export type SelectedAddresses = {
  addresses: Array<DigitalAddress>;
  legalAddresses: Array<DigitalAddress>;
  courtesyAddresses: Array<DigitalAddress>;
  specialAddresses: Array<DigitalAddress>;
} & { [key in `default${ChannelType}Address`]: DigitalAddress | undefined } & {
  [key in `special${ChannelType}Addresses`]: Array<DigitalAddress>;
};

const memoizedSelectAddresses = createSelector([digitalAddresses], (digitalAddresses) =>
  groupDigitalAddresses(digitalAddresses)
);

export const contactsSelectors = {
  selectAddresses: memoizedSelectAddresses,
  selectLoading: loading,
};
// END: SELECTORS

export default contactsSlice;
