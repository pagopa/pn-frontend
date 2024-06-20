import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Delegate, DelegationStatus, Delegator, DelegatorsFormFilters } from '../../models/Deleghe';
import { Groups } from '../../models/groups';
import {
  acceptMandate,
  getGroups,
  getMandatesByDelegator,
  rejectMandate,
  revokeMandate,
  searchMandatesByDelegate,
  updateMandate,
} from './actions';

const initialState = {
  delegations: {
    delegators: [] as Array<Delegator>,
    delegates: [] as Array<Delegate>,
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
      // reset pagination data
      // pagination data must be resetted always except when user change page
      const filtersDif = (Object.keys(state.filters) as Array<keyof DelegatorsFormFilters>).reduce(
        (acc, elem) => {
          if (action.payload[elem] !== state.filters[elem]) {
            acc.push(elem);
          }
          return acc;
        },
        [] as Array<keyof DelegatorsFormFilters>
      );
      if (filtersDif.length !== 1 || !filtersDif.includes('page')) {
        state.pagination.moreResult = false;
        state.pagination.nextPagesKey = [];
      }
      state.filters = action.payload;
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getMandatesByDelegator.fulfilled, (state, action) => {
      state.delegations.delegates = action.payload;
    });
    builder.addCase(searchMandatesByDelegate.fulfilled, (state, action) => {
      state.delegations.delegators = action.payload.resultsPage;
      state.pagination.moreResult = action.payload.moreResult;
      // because we can jump from a page to another and nextPagesKey returns only the next three pages, we have to check if that pages already exists
      if (action.payload.nextPagesKey) {
        for (const pageKey of action.payload.nextPagesKey) {
          if (state.pagination.nextPagesKey.indexOf(pageKey) === -1) {
            state.pagination.nextPagesKey.push(pageKey);
          }
        }
      }
    });
    builder.addCase(acceptMandate.fulfilled, (state, action) => {
      state.delegations.delegators = state.delegations.delegators.map((delegator) =>
        delegator.mandateId === action.meta.arg.id
          ? { ...delegator, status: DelegationStatus.ACTIVE, groups: action.meta.arg.groups }
          : delegator
      );
    });
    builder.addCase(revokeMandate.fulfilled, (state, action) => {
      state.delegations.delegates = state.delegations.delegates.filter(
        (delegate) => delegate.mandateId !== action.meta.arg
      );
    });
    builder.addCase(rejectMandate.fulfilled, (state, action) => {
      state.delegations.delegators = state.delegations.delegators.filter(
        (delegator) => delegator.mandateId !== action.meta.arg
      );
      // because a PG can delegate itself, we must check if the rejected delegation is in delegates object and remove it
      state.delegations.delegates = state.delegations.delegates.filter(
        (delegate) => delegate.mandateId !== action.meta.arg
      );
    });
    builder.addCase(getGroups.fulfilled, (state, action) => {
      state.groups = action.payload;
    });
    builder.addCase(updateMandate.fulfilled, (state, action) => {
      state.delegations.delegators = state.delegations.delegators.map((delegator) =>
        delegator.mandateId === action.meta.arg.id
          ? { ...delegator, groups: action.meta.arg.groups }
          : delegator
      );
    });
  },
});

export const { resetState, setFilters } = delegationsSlice.actions;

export default delegationsSlice;
