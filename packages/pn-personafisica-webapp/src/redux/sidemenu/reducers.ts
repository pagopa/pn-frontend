import { PaymentTpp } from '@pagopa-pn/pn-commons';
import { createSlice } from '@reduxjs/toolkit';

import { acceptMandate, rejectMandate } from '../delegation/actions';
import { Delegator } from '../delegation/types';
import { exchangeNotificationRetrievalId, getSidemenuInformation } from './actions';

/* eslint-disable functional/immutable-data */
const generalInfoSlice = createSlice({
  name: 'generalInfoSlice',
  initialState: {
    pendingDelegators: 0,
    delegators: [] as Array<Delegator>,
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
        pspDenomination: action.payload.pspDenomination || '',
        iun: action.payload.originId || '',
        isPaymentEnabled: action.payload.isPaymentEnabled || false,
      };
    });
  },
});

export const { closeDomicileBanner } = generalInfoSlice.actions;

export default generalInfoSlice;
