import { PaymentTpp } from '@pagopa-pn/pn-commons';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { OnboardingSource } from '../../models/Onboarding';
import { acceptMandate, rejectMandate } from '../delegation/actions';
import { Delegator } from '../delegation/types';
import { exchangeNotificationRetrievalId, getSidemenuInformation } from './actions';

type OnboardingDataState = {
  hasBeenShown: boolean;
  hasSkippedOnboarding: boolean;
  exitReminderShown: boolean;
  source?: OnboardingSource;
};

type GeneralInfoState = {
  pendingDelegators: number;
  delegators: Array<Delegator>;
  domicileBannerOpened: boolean;
  paymentTpp: PaymentTpp;
  onboardingData: OnboardingDataState;
};

const initialState: GeneralInfoState = {
  pendingDelegators: 0,
  delegators: [],
  domicileBannerOpened: true,
  paymentTpp: {} as PaymentTpp,
  onboardingData: {
    hasBeenShown: false,
    hasSkippedOnboarding: false,
    exitReminderShown: false,
    source: undefined,
  },
};

/* eslint-disable functional/immutable-data */
const generalInfoSlice = createSlice({
  name: 'generalInfoSlice',
  initialState,
  reducers: {
    closeDomicileBanner: (state) => {
      state.domicileBannerOpened = false;
    },
    setOnboardingHasBeenShown: (state, action: PayloadAction<boolean>) => {
      state.onboardingData.hasBeenShown = action.payload;
    },
    setHasSkippedOnboarding: (state, action: PayloadAction<boolean>) => {
      state.onboardingData.hasSkippedOnboarding = action.payload;
    },
    setOnboardingExitReminderShown: (state, action: PayloadAction<boolean>) => {
      state.onboardingData.exitReminderShown = action.payload;
    },
    setOnboardingSource: (state, action: PayloadAction<OnboardingSource | undefined>) => {
      state.onboardingData.source = action.payload;
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

export const {
  closeDomicileBanner,
  setOnboardingHasBeenShown,
  setHasSkippedOnboarding,
  setOnboardingExitReminderShown,
  setOnboardingSource,
} = generalInfoSlice.actions;

export default generalInfoSlice;
