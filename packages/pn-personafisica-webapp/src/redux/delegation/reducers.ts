import { createSlice } from '@reduxjs/toolkit';
import {
  getDelegates,
  getDelegators,
  openRevocationModal,
  rejectDelegation,
  revokeDelegation,
  closeRevocationModal,
} from './actions';
import { RevocationModalProps } from './types';

/* eslint-disable functional/immutable-data */
const delegationsSlice = createSlice({
  name: 'delegationsSlice',
  initialState: {
    loading: false,
    error: false,
    delegations: {
      delegators: [],
      delegates: [],
      isCompany: false,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDelegates.fulfilled, (state, action) => {
      state.delegations.delegates = action.payload;
      state.loading = false;
    });
    builder.addCase(getDelegators.fulfilled, (state, action) => {
      state.delegations.delegators = action.payload;
      state.loading = false;
    });
    builder.addCase(getDelegates.rejected, (state) => {
      state.error = true;
    });
    builder.addCase(getDelegators.rejected, (state) => {
      state.error = true;
    });
    builder.addCase(getDelegates.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getDelegators.pending, (state) => {
      state.loading = true;
    });
  },
});

export const revocationModalSlice = createSlice({
  name: 'revocationModalSlice',
  initialState: {
    open: false,
    id: '',
    type: '',
  } as RevocationModalProps,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(openRevocationModal, (state, action) => {
      state.id = action.payload.id;
      state.open = true;
      state.type = action.payload.type;
    });
    builder.addCase(closeRevocationModal, (state) => {
      state.id = '';
      state.open = false;
    });
    builder.addCase(revokeDelegation.fulfilled, (state) => {
      state.open = false;
    });
    builder.addCase(rejectDelegation.fulfilled, (state) => {
      state.open = false;
    });
  },
});

export default delegationsSlice;
