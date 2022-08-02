import { createSlice } from '@reduxjs/toolkit';

import {
    setRecipients,
    setAttachments
} from './actions';

const initialState = {
  notification: {
    recipients: [] as any,
    documents: [] as any,
  },
};

/* eslint-disable functional/immutable-data */
const newNotificationTempSlice = createSlice({
  name: 'newNotificationTempSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setRecipients, (state, action) => {
      state.notification = {
        ...state.notification,
        recipients: action.payload.recipients,
      };
    });
    builder.addCase(setAttachments, (state, action) => {
      state.notification = {
        ...state.notification,
        documents: action.payload.documents,
      };
    });
  },
});

export default newNotificationTempSlice;