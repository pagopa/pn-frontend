import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Delegation, DelegationStatus, DelegatorsFormFilters } from '../../models/Deleghe';
import { Groups } from '../../models/groups';
import {
  getDelegatesByCompany,
  getDelegators,
  acceptDelegation,
  rejectDelegation,
  revokeDelegation,
  getGroups,
  updateDelegation,
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
  filters: {
    size: 10,
    page: 0,
  } as DelegatorsFormFilters,
};

/* eslint-disable functional/immutable-data */
const delegationsSlice = createSlice({
  name: 'delegationsSlice',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<DelegatorsFormFilters>) => {
      state.filters = action.payload;
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
          ? { ...delegator, status: DelegationStatus.ACTIVE, groups: action.payload.groups }
          : delegator
      );
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
      // because a PG can delegate itself, we must check if the rejected delegation is in delegates object and remove it
      state.delegations.delegates = state.delegations.delegates.filter(
        (delegate) => delegate.mandateId !== action.payload.id
      );
    });
    builder.addCase(getGroups.fulfilled, (state, action) => {
      state.groups = action.payload;
    });
    builder.addCase(updateDelegation.fulfilled, (state, action) => {
      state.delegations.delegators = state.delegations.delegators.map((delegator: Delegation) =>
        delegator.mandateId === action.payload.id
          ? { ...delegator, groups: action.payload.groups }
          : delegator
      );
    });
  },
});

export const { resetState, setFilters } = delegationsSlice.actions;

export default delegationsSlice;
