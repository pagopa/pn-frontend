import { PayloadAction, createSlice, isAnyOf } from '@reduxjs/toolkit';

import { acceptMandate, rejectMandate } from '../delegation/actions';
import { getHasNewNotifications, getSidemenuInformation } from './actions';

/* eslint-disable functional/immutable-data */
const generalInfoSlice = createSlice({
  name: 'generalInfoSlice',
  initialState: {
    pendingDelegators: 0,
    domicileBannerOpened: true,
    hasNewNotifications: false,
  },
  reducers: {
    closeDomicileBanner: (state) => {
      state.domicileBannerOpened = false;
    },
    setHasNewNotifications: (state, action: PayloadAction<boolean>) => {
      state.hasNewNotifications = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSidemenuInformation.fulfilled, (state, action) => {
      state.pendingDelegators = action.payload;
    });
    builder.addCase(getHasNewNotifications.fulfilled, (state, action) => {
      state.hasNewNotifications = action.payload;
    });
    builder.addMatcher(isAnyOf(acceptMandate.fulfilled, rejectMandate.fulfilled), (state) => {
      if (state.pendingDelegators > 0) {
        state.pendingDelegators--;
      }
    });
  },
});

export const { closeDomicileBanner, setHasNewNotifications } = generalInfoSlice.actions;

export default generalInfoSlice;
