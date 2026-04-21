import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';

import { RootState } from '../store';

type OnboardingState = {
  wasShown: boolean;
  wasSkipped: boolean;
  exitReminderShown: boolean;
};

const initialState: OnboardingState = {
  wasShown: false,
  wasSkipped: false,
  exitReminderShown: false,
};

/* eslint-disable functional/immutable-data */
const onboardingSlice = createSlice({
  name: 'onboardingSlice',
  initialState,
  reducers: {
    resetOnboardingState: () => initialState,
    setOnboardingShown: (state, action: PayloadAction<boolean>) => {
      state.wasShown = action.payload;
    },
    setOnboardingSkipped: (state, action: PayloadAction<boolean>) => {
      state.wasSkipped = action.payload;
    },
    setOnboardingExitReminderShown: (state, action: PayloadAction<boolean>) => {
      state.exitReminderShown = action.payload;
    },
  },
});

export const {
  resetOnboardingState,
  setOnboardingShown,
  setOnboardingSkipped,
  setOnboardingExitReminderShown,
} = onboardingSlice.actions;

// START: SELECTORS
const onboardingState = (state: RootState) => state.onboardingState;

const wasShown = createSelector([onboardingState], (state) => state.wasShown);
const wasSkipped = createSelector([onboardingState], (state) => state.wasSkipped);
const exitReminderShown = createSelector([onboardingState], (state) => state.exitReminderShown);

export const onboardingSelectors = {
  selectWasShown: wasShown,
  selectWasSkipped: wasSkipped,
  selectExitReminderShown: exitReminderShown,
};
// END: SELECTORS

export default onboardingSlice;
