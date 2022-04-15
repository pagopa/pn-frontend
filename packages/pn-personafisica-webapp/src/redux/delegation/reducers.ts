import { createSlice } from '@reduxjs/toolkit';
import { sortDelegations } from '../../utils/delegation.utility';
import {
  getDelegates,
  getDelegators,
  acceptDelegation,
  closeRevocationModal,
  openRevocationModal,
  rejectDelegation,
  revokeDelegation,
  setDelegatorsSorting,
  setDelegatesSorting,
  openAcceptModal,
  closeAcceptModal,
  resetDelegationsState,
} from './actions';
import { Delegation } from './types';

const initialState = {
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
    error: false,
  },
  sortDelegators: {
    orderBy: '',
    order: 'asc' as 'asc' | 'desc',
  },
  sortDelegates: {
    orderBy: '',
    order: 'asc' as 'asc' | 'desc',
  },
};

/* eslint-disable functional/immutable-data */
const delegationsSlice = createSlice({
  name: 'delegationsSlice',
  initialState,
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
        delegator.mandateId === action.payload.id ? { ...delegator, status: 'active' } : delegator
      );
      state.acceptModalState.open = false;
      state.acceptModalState.error = false;
    });
    builder.addCase(acceptDelegation.rejected, (state) => {
      state.acceptModalState.error = true;
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
      state.acceptModalState.error = false;
    });
    builder.addCase(closeAcceptModal, (state) => {
      state.acceptModalState.open = false;
      state.acceptModalState.name = '';
      state.acceptModalState.id = '';
    });
    builder.addCase(setDelegatesSorting, (state, action) => {
      state.sortDelegates = action.payload;
      state.delegations.delegates = sortDelegations(
        action.payload.order,
        action.payload.orderBy,
        state.delegations.delegates,
      );
    });
    builder.addCase(setDelegatorsSorting, (state, action) => {
      state.sortDelegators = action.payload;
      state.delegations.delegators = sortDelegations(
        action.payload.order,
        action.payload.orderBy,
        state.delegations.delegators,
      );
    });
    builder.addCase(resetDelegationsState, () => initialState);
  },
});

export default delegationsSlice;
