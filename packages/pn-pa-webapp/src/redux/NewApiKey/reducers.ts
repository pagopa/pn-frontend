import { createSlice } from '@reduxjs/toolkit';
import { saveNewApiKey, getApiKeyGroups } from './actions';
import { ApiKeysGroupType } from "./types";

const initialState = {
  loading: false,
  apiKey: '',
  groups: [] as Array<ApiKeysGroupType>,
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
    builder.addCase(getApiKeyGroups.fulfilled, (state, action) => {
      state.groups = action.payload;
    });
  }
});

export default NewApiKeySlice;