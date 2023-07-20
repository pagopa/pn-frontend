import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ApiKey, ApiKeyFull } from '../../models/ApiKeys';
import { getApiKeys } from './actions';

const initialState = {
  loading: false,
  apiKeys: {
    items: [] as Array<ApiKey>,
    total: 0 as number,
  } as ApiKeyFull<ApiKey>,
  pagination: {
    nextPagesKey: [] as Array<string>,
    size: 10 as number,
    page: 0 as number,
    moreResult: false,
  }
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
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getApiKeys.fulfilled, (state, action) => {
      state.apiKeys = action.payload; 
      state.pagination.size = action.payload.limit || 10;
    });
  },
});

export const { resetState, setPagination } = apiKeysSlice.actions;

export default apiKeysSlice;