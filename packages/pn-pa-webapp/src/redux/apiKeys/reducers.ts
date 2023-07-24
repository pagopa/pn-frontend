import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ApiKeys } from '../../models/ApiKeys';
import { UserGroup } from '../../models/user';
import { getApiKeys } from './actions';

const initialState = {
  loading: false,
  apiKeys: {
    items: [],
    total: 0,
  } as ApiKeys<UserGroup>,
  pagination: {
    nextPagesKey: [] as Array<{
      lastKey: string;
      lastUpdate: string;
    }>,
    size: 10,
    page: 0,
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
      }
      state.pagination.size = action.payload.size;
      state.pagination.page = action.payload.page;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getApiKeys.fulfilled, (state, action) => {
      state.apiKeys = action.payload;
      if (action.payload.lastKey && action.payload.lastUpdate) {
        const pageKey = {
          lastKey: action.payload.lastKey,
          lastUpdate: action.payload.lastUpdate,
        };
        if (
          state.pagination.nextPagesKey.findIndex(
            (el) => el.lastKey !== pageKey.lastKey && el.lastUpdate !== pageKey.lastUpdate
          ) === -1
        ) {
          state.pagination.nextPagesKey.push(pageKey);
        }
      }
    });
  },
});

export const { resetState, setPagination } = apiKeysSlice.actions;

export default apiKeysSlice;
