import { createSlice } from '@reduxjs/toolkit';
import { ApiKey } from '../../models/ApiKeys';
import { getApiKeys } from './actions';

const initialState = {
  loading: false,
  apiKeys: [] as Array<ApiKey>,
};

/* eslint-disable functional/immutable-data */
const apiKeysSlice = createSlice({
  name: 'apiKeysSlice',
  initialState,
  reducers: {
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getApiKeys.fulfilled, (state, action) => {
      state.apiKeys = action.payload;
    });
  },
});

export const { resetState } = apiKeysSlice.actions;

export default apiKeysSlice;