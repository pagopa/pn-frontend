import { createSlice } from '@reduxjs/toolkit';
import { DelegationStatus } from '../../utils/status.utility';
import {
  getDelegates,
  getDelegators,
  acceptDelegation,
  closeRevocationModal,
  openRevocationModal,
  rejectDelegation,
  revokeDelegation,
} from './actions';
import { RevocationModalProps, Delegation } from './types';

/* eslint-disable functional/immutable-data */
const delegationsSlice = createSlice({
  name: 'delegationsSlice',
  initialState: {
    error: false,
    delegations: {
      delegators: [] as Array<Delegation>,
      delegates: [] as Array<Delegation>,
      isCompany: false,
    },
    modalState: {
      open: false,
      id: '',
      type: '',
    } as RevocationModalProps,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDelegates.fulfilled, (state, action) => {
      state.delegations.delegates = action.payload;
    });
    builder.addCase(getDelegators.fulfilled, (state, action) => {
      state.delegations.delegators = action.payload;
    });
    builder.addCase(getDelegates.rejected, (state) => {
      state.error = true;
    });
    builder.addCase(getDelegators.rejected, (state) => {
      state.error = true;
    });
    builder.addCase(acceptDelegation.fulfilled, (state, action) => {
      state.delegations.delegators = state.delegations.delegators.map((e: any) =>
        e.mandateId === action.payload.id ? { ...e, status: DelegationStatus.ACTIVE } : e
      );
    });
    builder.addCase(openRevocationModal, (state, action) => {
      state.modalState.id = action.payload.id;
      state.modalState.open = true;
      state.modalState.type = action.payload.type;
    });
    builder.addCase(closeRevocationModal, (state) => {
      state.modalState.id = '';
      state.modalState.open = false;
    });
    builder.addCase(revokeDelegation.fulfilled, (state, action) => {
      state.modalState.open = false;
      state.delegations.delegates = state.delegations.delegates.filter(
        (e: any) => e.mandateId !== action.payload.id
      );
    });
    builder.addCase(rejectDelegation.fulfilled, (state, action) => {
      state.modalState.open = false;
      state.delegations.delegators = state.delegations.delegators.filter(
        (e: any) => e.mandateId !== action.payload.id
      );
    });
  },
});

export default delegationsSlice;
