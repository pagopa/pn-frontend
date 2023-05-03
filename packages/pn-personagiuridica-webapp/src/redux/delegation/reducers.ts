import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Delegation, DelegationStatus } from '../../models/Deleghe';
import { Groups } from '../../models/groups';
import {
  getDelegatesByCompany,
  getDelegators,
  acceptDelegation,
  rejectDelegation,
  revokeDelegation,
  getGroups,
  getDelegatorsNames,
} from './actions';

const initialState = {
  delegations: {
    delegators: [] as Array<Delegation>,
    delegates: [] as Array<Delegation>,
  },
  pagination: {
    nextPagesKey: [] as Array<string>,
    moreResult: false,
  },
  groups: [] as Array<Groups>,
  delegatorsNames: [] as Array<{ id: string; name: string }>,
  acceptModalState: {
    open: false,
    id: '',
    name: '',
    error: false,
  },
};

/* eslint-disable functional/immutable-data */
const delegationsSlice = createSlice({
  name: 'delegationsSlice',
  initialState,
  reducers: {
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
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getDelegatesByCompany.fulfilled, (state, action) => {
      state.delegations.delegates = action.payload;
    });
    builder.addCase(getDelegators.fulfilled, (state, action) => {
      state.delegations.delegators = action.payload.resultsPage;
      state.pagination.nextPagesKey = action.payload.nextPagesKey;
      state.pagination.moreResult = action.payload.moreResult;
    });
    builder.addCase(acceptDelegation.fulfilled, (state, action) => {
      state.delegations.delegators = state.delegations.delegators.map((delegator: Delegation) =>
        delegator.mandateId === action.payload.id
          ? { ...delegator, status: DelegationStatus.ACTIVE }
          : delegator
      );
      state.acceptModalState.open = false;
      state.acceptModalState.error = false;
    });
    builder.addCase(acceptDelegation.rejected, (state) => {
      state.acceptModalState.error = true;
    });
    builder.addCase(revokeDelegation.fulfilled, (state, action) => {
      state.delegations.delegates = state.delegations.delegates.filter(
        (delegate: Delegation) => delegate.mandateId !== action.payload.id
      );
    });
    builder.addCase(rejectDelegation.fulfilled, (state, action) => {
      state.delegations.delegators = state.delegations.delegators.filter(
        (delegator: Delegation) => delegator.mandateId !== action.meta.arg
      );
    });
    builder.addCase(getGroups.fulfilled, (state, action) => {
      state.groups = action.payload;
    });
    builder.addCase(getDelegatorsNames.fulfilled, (state, action) => {
      state.delegatorsNames = action.payload;
    });
  },
});

export const { resetState, openAcceptModal, closeAcceptModal } = delegationsSlice.actions;

export default delegationsSlice;
