import { performThunkAction, Sort } from '@pagopa-pn/pn-commons';
import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { DelegationsApi } from '../../api/delegations/Delegations.api';
import { DelegatorsColumn, DelegatesColumn } from '../../models/Deleghe';
import { AcceptDelegationResponse, Delegation } from './types';

export enum DELEGATION_ACTIONS {
  GET_DELEGATES = 'getDelegates',
  GET_DELEGATORS = 'getDelegators',
}

export const getDelegates = createAsyncThunk<Array<Delegation>>(
  DELEGATION_ACTIONS.GET_DELEGATES,
  performThunkAction(() => DelegationsApi.getDelegates())
);

export const getDelegators = createAsyncThunk<Array<Delegation>>(
  DELEGATION_ACTIONS.GET_DELEGATORS,
  performThunkAction(() => DelegationsApi.getDelegators())
);

export const revokeDelegation = createAsyncThunk<{ id: string }, string>(
  'revokeDelegation',
  performThunkAction((id) => DelegationsApi.revokeDelegation(id))
);

export const rejectDelegation = createAsyncThunk<{ id: string }, string>(
  'rejectDelegation',
  performThunkAction((id) => DelegationsApi.rejectDelegation(id))
);

export const acceptDelegation = createAsyncThunk<
  AcceptDelegationResponse,
  { id: string; code: string }
>('acceptDelegation', 
  performThunkAction(async ({id, code}: { id: string; code: string }) => {
    const data = {
      verificationCode: code,
    };
    return await DelegationsApi.acceptDelegation(id, data);
  })
);

export const openRevocationModal =
  createAction<{ id: string; type: string }>('openRevocationModal');

export const closeRevocationModal = createAction<void>('closeRevocationModal');

export const openAcceptModal = createAction<{ id: string; name: string }>('openAcceptModal');

export const closeAcceptModal = createAction<void>('closeAcceptModal');

export const setDelegatorsSorting = createAction<Sort<DelegatorsColumn>>('setDelegatorsSorting');

export const setDelegatesSorting = createAction<Sort<DelegatesColumn>>('setDelegatesSorting');

export const resetDelegationsState = createAction<void>('resetDelegationsState');
