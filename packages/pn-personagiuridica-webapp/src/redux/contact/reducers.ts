import { createSlice } from '@reduxjs/toolkit';
import { Party } from '../../models/party';

import {
  DigitalAddresses,
  DigitalAddress,
  CourtesyChannelType,
  IOAllowedValues,
} from '../../models/contacts';
import {
  createOrUpdateCourtesyAddress,
  createOrUpdateLegalAddress,
  deleteCourtesyAddress,
  deleteLegalAddress,
  disableIOAddress,
  enableIOAddress,
  getAllActivatedParties,
  getDigitalAddresses,
} from './actions';

const initialState = {
  loading: false,
  digitalAddresses: {
    legal: [],
    courtesy: [],
  } as DigitalAddresses,
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
    resetPecValidation: (state) => {
      state.digitalAddresses.legal = state
        .digitalAddresses.legal.filter((address) => address.senderId !== 'default');
    },
  },
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
          // update if found
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
    builder.addCase(deleteCourtesyAddress.fulfilled, (state, action) => {
      // remove digital address
      if (action.payload) {
        state.digitalAddresses.courtesy = state.digitalAddresses.courtesy.filter(
          (address) =>
            address.senderId !== action.payload ||
            address.channelType !== action.meta.arg.channelType
        );
      }
    });
    builder.addCase(enableIOAddress.fulfilled, (state) => {
      const addressIndex = state.digitalAddresses.courtesy.findIndex(
        (address) => address.channelType === CourtesyChannelType.IOMSG
      );
      if (addressIndex > 0) {
        state.digitalAddresses.courtesy[addressIndex].value = IOAllowedValues.ENABLED;
      }
    });
    builder.addCase(disableIOAddress.fulfilled, (state) => {
      const addressIndex = state.digitalAddresses.courtesy.findIndex(
        (address) => address.channelType === CourtesyChannelType.IOMSG
      );
      if (addressIndex > 0) {
        state.digitalAddresses.courtesy[addressIndex].value = IOAllowedValues.DISABLED;
      }
    });
    builder.addCase(getAllActivatedParties.fulfilled, (state, action) => {
      state.parties = action.payload;
    });
  },
});

export const { resetState, resetPecValidation } = contactsSlice.actions;

export default contactsSlice;
