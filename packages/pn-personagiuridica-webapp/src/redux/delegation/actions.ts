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
  GET_DELEGATORS_NAMES = 'getDelegatorsNames',
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
  { id: string; code: string }
>(
  'acceptDelegation',
  performThunkAction(async ({ id, code }: { id: string; code: string }) => {
    const data = {
      verificationCode: code,
    };
    return await DelegationsApi.acceptDelegation(id, data);
  })
);

export const getGroups = createAsyncThunk<Array<Groups>>(
  'getGroups',
  performThunkAction(() => ExternalRegistriesAPI.getGroups())
);

export const getDelegatorsNames = createAsyncThunk<Array<{ id: string; name: string }>>(
  DELEGATION_ACTIONS.GET_DELEGATORS_NAMES,
  performThunkAction(() => DelegationsApi.getDelegatorsNames())
);

export const openRevocationModal =
  createAction<{ id: string; type: string }>('openRevocationModal');

export const closeRevocationModal = createAction<void>('closeRevocationModal');

export const openAcceptModal = createAction<{ id: string; name: string }>('openAcceptModal');

export const closeAcceptModal = createAction<void>('closeAcceptModal');

export const resetDelegationsState = createAction<void>('resetDelegationsState');
