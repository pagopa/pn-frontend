import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ApiKey } from '../../models/ApiKeys';
import { getApiKeys } from './actions';

const initialState = {
  loading: false,
  apiKeys: [] as Array<ApiKey>,
  pagination: {
    nextPagesKey: [] as Array<string>,
    size: 10,
    page: 0,
    moreResult: false,
  },
};

/* eslint-disable functional/immutable-data */
const apiKeysSlice = createSlice({
  name: 'apiKeysSlice',
  initialState,
  reducers: {
    resetState: () => initialState,
    setPagination: (state, action: PayloadAction<{ page: number; size: number }>) => {
      if (state.pagination.size !== action.payload.size) {
        // reset pagination
        state.pagination.nextPagesKey = [];
        state.pagination.moreResult = false;
      }
      state.pagination.size = action.payload.size;
      state.pagination.page = action.payload.page;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getApiKeys.fulfilled, (state, action) => {
      state.apiKeys = action.payload.items;
    });
  },
});

export const { resetState, setPagination } = apiKeysSlice.actions;

export default apiKeysSlice;
