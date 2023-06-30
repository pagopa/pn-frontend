import { createSlice } from '@reduxjs/toolkit';
import { UserGroup } from '../../models/user';
import { saveNewApiKey, getApiKeyUserGroups } from './actions';

const initialState = {
  loading: false,
  apiKey: '',
  groups: [] as Array<UserGroup>,
};

/* eslint-disable functional/immutable-data */
const newApiKeySlice = createSlice({
  name: 'newApiKeySlice',
  initialState,
  reducers: {
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(saveNewApiKey.fulfilled, (state, action) => {
      state.apiKey = action.payload;
    });
    builder.addCase(getApiKeyUserGroups.fulfilled, (state, action) => {
      state.groups = action.payload;
    });
  }
});
export const { resetState } = newApiKeySlice.actions;
export default newApiKeySlice;
