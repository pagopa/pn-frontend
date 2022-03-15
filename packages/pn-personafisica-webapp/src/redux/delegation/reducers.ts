import { createSlice } from '@reduxjs/toolkit';
import {
  closeRevocationModal,
  delegations,
  openRevocationModal,
  revokeDelegation,
} from './actions';
import { DelegationsList, RevocationModalProps } from './types';

/* eslint-disable functional/immutable-data */
const delegationsSlice = createSlice({
  name: 'delegationsSlice',
  initialState: {
    loading: false,
    delegations: {
      delegators: [],
      delegations: [],
      isCompany: false,
    } as DelegationsList,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(delegations.fulfilled, (state, action) => {
      state.delegations = action.payload;
    });
  },
});

export const revocationModalSlice = createSlice({
  name: 'revocationModalSlice',
  initialState: {
    open: false,
    id: '',
  } as RevocationModalProps,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(openRevocationModal, (state, action) => {
      state.id = action.payload;
      state.open = true;
    });
    builder.addCase(closeRevocationModal, (state) => {
      state.id = '';
      state.open = false;
    });
    builder.addCase(revokeDelegation.fulfilled, (state) => {
      state.open = false;
    });
  },
});

export default delegationsSlice;
