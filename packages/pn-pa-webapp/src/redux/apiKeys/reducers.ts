import { createSlice } from '@reduxjs/toolkit';
import { ApiKey } from '../../models/ApiKeys';
import { UserGroup } from '../../models/user';
import { getApiKeyUserGroups, getApiKeys } from './actions';

const initialState = {
  loading: false,
  apiKeys: [] as Array<ApiKey>,
  groups: [] as Array<UserGroup>,
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
    builder.addCase(getApiKeyUserGroups.fulfilled, (state, action) => {
      state.groups = action.payload;
    });
  },
});

export const { resetState } = apiKeysSlice.actions;

export default apiKeysSlice;