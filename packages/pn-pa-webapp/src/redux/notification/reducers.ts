import { createSlice } from '@reduxjs/toolkit';

import { NotificationDetail } from './types';
import { getSentNotification } from './actions';

/* eslint-disable functional/immutable-data */
const notificationSlice = createSlice({
  name: 'notificationSlice',
  initialState: {
    loading: false,
    notification: {} as NotificationDetail,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSentNotification.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getSentNotification.fulfilled, (state, action) => {
      state.notification = action.payload;
    });
  },
});

export default notificationSlice;
