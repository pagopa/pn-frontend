import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import { Sort } from '@pagopa-pn/pn-commons';

import { sortDelegations } from '../../utils/delegation.utility';
import { DelegatorsColumn, DelegatesColumn } from '../../models/Deleghe';
import {
  getDelegates,
  getDelegators,
  acceptDelegation,
  rejectDelegation,
  revokeDelegation,
} from './actions';
import { Delegation } from './types';

const initialState = {
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
    order: 'asc',
  } as Sort<DelegatorsColumn>,
  sortDelegates: {
    orderBy: '',
    order: 'asc' as 'asc' | 'desc',
  } as Sort<DelegatesColumn>,
};

/* eslint-disable functional/immutable-data */
const delegationsSlice = createSlice({
  name: 'delegationsSlice',
  initialState,
  reducers: {
    openRevocationModal: (state, action: PayloadAction<{ id: string; type: string }>) => {
      state.modalState.id = action.payload.id;
      state.modalState.open = true;
      state.modalState.type = action.payload.type;
    },
    closeRevocationModal: (state) => {
      state.modalState.id = '';
      state.modalState.open = false;
    },
    openAcceptModal: (state, action: PayloadAction<{ id: string; name: string }>) => {
      state.acceptModalState.id = action.payload.id;
      state.acceptModalState.name = action.payload.name;
      state.acceptModalState.open = true;
      state.acceptModalState.error = false;
    },
    closeAcceptModal: (state) => {
      state.acceptModalState.open = false;
      state.acceptModalState.id = '';
    },
    setDelegatesSorting: (state, action: PayloadAction<Sort<DelegatesColumn>>) => {
      state.sortDelegates = action.payload;
      state.delegations.delegates = sortDelegations(
        action.payload.order,
        action.payload.orderBy,
        state.delegations.delegates
      );
    },
    setDelegatorsSorting: (state, action: PayloadAction<Sort<DelegatorsColumn>>) => {
      state.sortDelegators = action.payload;
      state.delegations.delegators = sortDelegations(
        action.payload.order,
        action.payload.orderBy,
        state.delegations.delegators
      );
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getDelegates.fulfilled, (state, action) => {
      state.delegations.delegates = action.payload;
    });
    builder.addCase(getDelegators.fulfilled, (state, action) => {
      state.delegations.delegators = action.payload;
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
    builder.addCase(revokeDelegation.fulfilled, (state, action) => {
      state.modalState.open = false;
      state.delegations.delegates = state.delegations.delegates.filter(
        (delegate: Delegation) => delegate.mandateId !== action.payload.id
      );
    });
    builder.addCase(rejectDelegation.fulfilled, (state, action) => {
      state.modalState.open = false;
      state.delegations.delegators = state.delegations.delegators.filter(
        (delegator: Delegation) => delegator.mandateId !== action.meta.arg
      );
    });
    builder.addMatcher(isAnyOf(rejectDelegation.rejected, revokeDelegation.rejected), (state) => {
      state.modalState.open = false;
    });
  },
});

export const {
  setDelegatorsSorting,
  setDelegatesSorting,
  openAcceptModal,
  closeAcceptModal,
  resetState,
  closeRevocationModal,
  openRevocationModal,
} = delegationsSlice.actions;

export default delegationsSlice;
