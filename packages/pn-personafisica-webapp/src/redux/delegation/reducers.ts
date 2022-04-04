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
  openAcceptModal,
  closeAcceptModal,
} from './actions';
import { Delegation } from './types';

/* eslint-disable functional/immutable-data */
const delegationsSlice = createSlice({
  name: 'delegationsSlice',
  initialState: {
    delegatesError: false,
    delegatorsError: false,
    delegations: {
      delegators: [] as Array<Delegation>,
      delegates: [] as Array<Delegation>,
      isCompany: false,
    },
    modalState: {
      open: false,
      id: '',
      type: '',
    },
    acceptModalState: {
      open: false,
      id: '',
      name: '',
    },
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
      state.delegatesError = true;
    });
    builder.addCase(getDelegators.rejected, (state) => {
      state.delegatorsError = true;
    });
    builder.addCase(acceptDelegation.fulfilled, (state, action) => {
      state.delegations.delegators = state.delegations.delegators.map((delegator: Delegation) =>
        delegator.mandateId === action.payload.id
          ? { ...delegator, status: DelegationStatus.ACTIVE }
          : delegator
      );
      state.acceptModalState.open = false;
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
        (delegate: Delegation) => delegate.mandateId !== action.payload.id
      );
    });
    builder.addCase(rejectDelegation.fulfilled, (state, action) => {
      state.modalState.open = false;
      state.delegations.delegators = state.delegations.delegators.filter(
        (delegator: Delegation) => delegator.mandateId !== action.payload.id
      );
    });
    builder.addCase(openAcceptModal, (state, action) => {
      state.acceptModalState.id = action.payload.id;
      state.acceptModalState.name = action.payload.name;
      state.acceptModalState.open = true;
    });
    builder.addCase(closeAcceptModal, (state) => {
      state.acceptModalState.open = false;
      state.acceptModalState.name = '';
      state.acceptModalState.id = '';
    });
  },
});

export default delegationsSlice;
