import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { InstitutionsResponse } from '../../models/Institutions';
import { getInstitutions } from './actions';

const initialState = {
  institutions: {
    items: [],
  } as InstitutionsResponse,
  search: '',
  pagination: {
    // nextPagesKey[i] is the lastKey to read the page i + 1
    nextPagesKey: [] as Array<string>,
    size: 10,
    page: 0,
  },
};

/* eslint-disable functional/immutable-data */
const institutionsSlice = createSlice({
  name: 'institutionsSlice',
  initialState,
  reducers: {
    resetState: () => initialState,
    setPagination: (state, action: PayloadAction<{ page: number; size: number }>) => {
      if (state.pagination.size !== action.payload.size) {
        state.pagination.nextPagesKey = [];
      }
      state.pagination.size = action.payload.size;
      state.pagination.page = action.payload.page;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      // no request would run to restore the cursors, so they must be kept
      if (state.search === action.payload && state.pagination.page === 0) {
        return;
      }
      state.search = action.payload;
      state.pagination.page = 0;
      state.pagination.nextPagesKey = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getInstitutions.fulfilled, (state, action) => {
      state.institutions = action.payload;
      const { lastKey } = action.payload;
      if (lastKey && !state.pagination.nextPagesKey.includes(lastKey)) {
        state.pagination.nextPagesKey.push(lastKey);
      }
    });
  },
});

export const { resetState, setPagination, setSearch } = institutionsSlice.actions;

export default institutionsSlice;
