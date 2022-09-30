import { createSlice } from '@reduxjs/toolkit';
import { UserGroup } from '../../models/user';
import { saveNewApiKey, getUserGroups } from './actions';

const initialState = {
  loading: false,
  apiKey: '',
  groups: [] as Array<UserGroup>,
};

/* eslint-disable functional/immutable-data */
const NewApiKeySlice = createSlice({
  name: 'apiKeysSlice',
  initialState,
  reducers: {
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(saveNewApiKey.fulfilled, (state, action) => {
      state.apiKey = action.payload;
    });
    builder.addCase(getUserGroups.fulfilled, (state, action) => {
      state.groups = action.payload;
    });
  }
});

export default NewApiKeySlice;