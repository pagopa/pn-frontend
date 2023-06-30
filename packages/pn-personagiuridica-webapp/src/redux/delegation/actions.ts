import { performThunkAction } from '@pagopa-pn/pn-commons';
import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { DelegationsApi } from '../../api/delegations/Delegations.api';
import { ExternalRegistriesAPI } from '../../api/external-registries/External-registries.api';
import {
  AcceptDelegationResponse,
  Delegation,
  GetDelegatorsFilters,
  GetDelegatorsResponse,
} from '../../models/Deleghe';
import { Groups } from '../../models/groups';

export enum DELEGATION_ACTIONS {
  GET_DELEGATES_BY_COMPANY = 'getDelegatesByCompany',
  GET_DELEGATORS = 'getDelegators',
}

export const getDelegatesByCompany = createAsyncThunk<Array<Delegation>>(
  DELEGATION_ACTIONS.GET_DELEGATES_BY_COMPANY,
  performThunkAction(() => DelegationsApi.getDelegatesByCompany())
);

export const getDelegators = createAsyncThunk<GetDelegatorsResponse, GetDelegatorsFilters>(
  DELEGATION_ACTIONS.GET_DELEGATORS,
  performThunkAction((params: GetDelegatorsFilters) => DelegationsApi.getDelegators(params))
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
  { id: string; code: string; groups: Array<{ id: string; name: string }> }
>(
  'acceptDelegation',
  performThunkAction(({ id, code, groups }) => {
    const data = {
      verificationCode: code,
      groups,
    };
    return DelegationsApi.acceptDelegation(id, data);
  })
);

export const getGroups = createAsyncThunk<Array<Groups>>(
  'getGroups',
  performThunkAction(() => ExternalRegistriesAPI.getGroups())
);

export const updateDelegation = createAsyncThunk<
  AcceptDelegationResponse,
  { id: string; groups: Array<{ id: string; name: string }> }
>(
  'updateDelegation',
  performThunkAction(({ id, groups }) => DelegationsApi.updateDelegation(id, groups))
);

export const resetDelegationsState = createAction<void>('resetDelegationsState');
