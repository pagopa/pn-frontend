import { PaymentTpp } from '@pagopa-pn/pn-commons/src/models/NotificationDetail';
import { createSlice } from '@reduxjs/toolkit';

import { AddressType, ChannelType, DigitalAddress, IOAllowedValues } from '../../models/contacts';
import { removeAddress, updateAddressesList } from '../../utility/contacts.utility';
import {
  createOrUpdateAddress,
  deleteAddress,
  disableIOAddress,
  enableIOAddress,
} from '../contact/actions';
import { acceptMandate, rejectMandate } from '../delegation/actions';
import { Delegator } from '../delegation/types';
import {
  exchangeNotificationRetrievalId,
  getDomicileInfo,
  getSidemenuInformation,
} from './actions';

/* eslint-disable functional/immutable-data */
const generalInfoSlice = createSlice({
  name: 'generalInfoSlice',
  initialState: {
    pendingDelegators: 0,
    delegators: [] as Array<Delegator>,
    digitalAddresses: [] as Array<DigitalAddress>,
    domicileBannerOpened: true,
    paymentTpp: {} as PaymentTpp,
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
    builder.addCase(getDomicileInfo.fulfilled, (state, action) => {
      // this action is needed for mixpanel tracking
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
    builder.addCase(exchangeNotificationRetrievalId.fulfilled, (state, action) => {
      state.paymentTpp = {
        retrievalId: action.payload.retrievalId,
        paymentButton: action.payload.paymentButton || '',
        iun: action.payload.originId || '',
      };
    });
  },
});

export const { closeDomicileBanner } = generalInfoSlice.actions;

export default generalInfoSlice;
