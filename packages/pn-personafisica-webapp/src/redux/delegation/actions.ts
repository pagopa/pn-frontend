import { Sort, parseError } from '@pagopa-pn/pn-commons';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import { MandateApiFactory } from '../../generated-client/mandate';
import { DelegationData } from '../../models/Deleghe';
import { Delegate, Delegator } from './types';

export enum DELEGATION_ACTIONS {
  GET_MANDATES_BY_DELEGATOR = 'getMandatesByDelegator',
  GET_MANDATES_BY_DELEGATE = 'getMandatesByDelegate',
  REVOKE_MANDATE = 'revokeMandate',
  REJECT_MANDATE = 'rejectMandate',
  ACCEPT_MANDATE = 'acceptMandate',
}

export const getMandatesByDelegator = createAsyncThunk<Array<Delegate>>(
  DELEGATION_ACTIONS.GET_MANDATES_BY_DELEGATOR,
  async (_params, { rejectWithValue }) => {
    try {
      const mandateApiFactory = MandateApiFactory(undefined, undefined, apiClient);
      const response = await mandateApiFactory.getMandatesByDelegatorV1();
      return response.data as Array<Delegate>;
    } catch (e) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const getMandatesByDelegate = createAsyncThunk<Array<Delegator>>(
  DELEGATION_ACTIONS.GET_MANDATES_BY_DELEGATE,
  async (_params, { rejectWithValue }) => {
    try {
      const mandateApiFactory = MandateApiFactory(undefined, undefined, apiClient);
      const response = await mandateApiFactory.getMandatesByDelegateV1();
      return response.data as Array<Delegator>;
    } catch (e) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const revokeMandate = createAsyncThunk<void, string>(
  DELEGATION_ACTIONS.REVOKE_MANDATE,
  async (params, { rejectWithValue }) => {
    try {
      const mandateApiFactory = MandateApiFactory(undefined, undefined, apiClient);
      const response = await mandateApiFactory.revokeMandateV1(params);
      return response.data;
    } catch (e) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const rejectMandate = createAsyncThunk<void, string>(
  DELEGATION_ACTIONS.REJECT_MANDATE,
  async (params, { rejectWithValue }) => {
    try {
      const mandateApiFactory = MandateApiFactory(undefined, undefined, apiClient);
      const response = await mandateApiFactory.rejectMandateV1(params);
      return response.data;
    } catch (e) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const acceptMandate = createAsyncThunk<void, { id: string; code: string }>(
  DELEGATION_ACTIONS.ACCEPT_MANDATE,
  async (params, { rejectWithValue }) => {
    try {
      const mandateApiFactory = MandateApiFactory(undefined, undefined, apiClient);
      const response = await mandateApiFactory.acceptMandateV1(params.id, {
        verificationCode: params.code,
      });
      return response.data;
    } catch (e) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const openRevocationModal =
  createAction<{ id: string; type: string }>('openRevocationModal');

export const closeRevocationModal = createAction<void>('closeRevocationModal');

export const openAcceptModal = createAction<{ id: string; name: string }>('openAcceptModal');

export const closeAcceptModal = createAction<void>('closeAcceptModal');

export const setDelegatorsSorting = createAction<Sort<DelegationData>>('setDelegatorsSorting');

export const setDelegatesSorting = createAction<Sort<DelegationData>>('setDelegatesSorting');

export const resetDelegationsState = createAction<void>('resetDelegationsState');
