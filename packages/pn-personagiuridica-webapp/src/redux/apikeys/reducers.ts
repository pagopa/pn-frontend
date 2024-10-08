import { createSlice } from '@reduxjs/toolkit';

import { BffPublicKeysResponse, BffVirtualKeysResponse } from '../../generated-client/pg-apikeys';
import { getPublicKeys, getVirtualApiKeys } from './actions';

type initialStateType = {
  loading: boolean;
  publicKeys: BffPublicKeysResponse;
  virtualKeys: BffVirtualKeysResponse;
};

const initialState: initialStateType = {
  loading: false,
  publicKeys: {
    items: [],
    total: 0,
  },
  virtualKeys: {
    items: [],
    total: 0,
  },
};

/* eslint-disable functional/immutable-data */
const apiKeysSlice = createSlice({
  name: 'apiKeysSlice',
  initialState,
  reducers: {
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getPublicKeys.fulfilled, (state, action) => {
      state.publicKeys = action.payload;
    });
    builder.addCase(getVirtualApiKeys.fulfilled, (state, action) => {
      state.virtualKeys = action.payload;
    });
  },
});

export default apiKeysSlice;
