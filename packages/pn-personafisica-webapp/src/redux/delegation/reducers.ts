import { Sort } from '@pagopa-pn/pn-commons';
import { PayloadAction, createSlice, isAnyOf } from '@reduxjs/toolkit';

import { DelegationColumnData } from '../../models/Deleghe';
import { sortDelegations } from '../../utility/delegation.utility';
import {
  acceptMandate,
  getMandatesByDelegate,
  getMandatesByDelegator,
  rejectMandate,
  revokeMandate,
} from './actions';
import { Delegate, Delegator } from './types';

const initialState = {
  delegations: {
    delegators: [] as Array<Delegator>,
    delegates: [] as Array<Delegate>,
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
  } as Sort<DelegationColumnData>,
  sortDelegates: {
    orderBy: '',
    order: 'asc' as 'asc' | 'desc',
  } as Sort<DelegationColumnData>,
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
    setDelegatesSorting: (state, action: PayloadAction<Sort<DelegationColumnData>>) => {
      state.sortDelegates = action.payload;
      state.delegations.delegates = sortDelegations(
        action.payload.order,
        action.payload.orderBy,
        state.delegations.delegates
      );
    },
    setDelegatorsSorting: (state, action: PayloadAction<Sort<DelegationColumnData>>) => {
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
    builder.addCase(getMandatesByDelegator.fulfilled, (state, action) => {
      state.delegations.delegates = action.payload;
    });
    builder.addCase(getMandatesByDelegate.fulfilled, (state, action) => {
      state.delegations.delegators = action.payload;
    });
    builder.addCase(acceptMandate.fulfilled, (state, action) => {
      state.delegations.delegators = state.delegations.delegators.map((delegator) =>
        delegator.mandateId === action.meta.arg.id ? { ...delegator, status: 'active' } : delegator
      );
      state.acceptModalState.open = false;
      state.acceptModalState.error = false;
    });
    builder.addCase(acceptMandate.rejected, (state) => {
      state.acceptModalState.error = true;
    });
    builder.addCase(revokeMandate.fulfilled, (state, action) => {
      state.modalState.open = false;
      state.delegations.delegates = state.delegations.delegates.filter(
        (delegate) => delegate.mandateId !== action.meta.arg
      );
    });
    builder.addCase(rejectMandate.fulfilled, (state, action) => {
      state.modalState.open = false;
      state.delegations.delegators = state.delegations.delegators.filter(
        (delegator) => delegator.mandateId !== action.meta.arg
      );
    });
    builder.addMatcher(isAnyOf(rejectMandate.rejected, revokeMandate.rejected), (state) => {
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
