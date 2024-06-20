import { parseError } from '@pagopa-pn/pn-commons';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import { MandateApiFactory } from '../../generated-client/mandate';
import { Delegate, GetDelegatorsFilters, GetDelegatorsResponse } from '../../models/Deleghe';
import { GroupStatus, Groups } from '../../models/groups';
import { InfoRecipientApiFactory } from '../../generated-client/recipient-info';

export enum DELEGATION_ACTIONS {
  GET_MANDATES_BY_DELEGATOR = 'getMandatesByDelegator',
  GET_GROUPS = 'getGroups',
  SEARCH_MANDATES_BY_DELEGATE = 'searchMandatesByDelegate',
  REVOKE_MANDATE = 'revokeMandate',
  REJECT_MANDATE = 'rejectMandate',
  ACCEPT_MANDATE = 'acceptMandate',
  UPDATE_MANDATE = 'updateMandate',
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

export const searchMandatesByDelegate = createAsyncThunk<
  GetDelegatorsResponse,
  GetDelegatorsFilters
>(DELEGATION_ACTIONS.SEARCH_MANDATES_BY_DELEGATE, async (params, { rejectWithValue }) => {
  try {
    const mandateApiFactory = MandateApiFactory(undefined, undefined, apiClient);
    const response = await mandateApiFactory.searchMandatesByDelegateV1(
      params.size,
      { taxId: params.taxId, groups: params.groups, status: params.status },
      params.nextPageKey
    );
    return response.data as GetDelegatorsResponse;
  } catch (e) {
    return rejectWithValue(parseError(e));
  }
});

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

export const acceptMandate = createAsyncThunk<
  void,
  { id: string; code: string; groups: Array<{ id: string; name: string }> }
>(DELEGATION_ACTIONS.ACCEPT_MANDATE, async (params, { rejectWithValue }) => {
  try {
    const mandateApiFactory = MandateApiFactory(undefined, undefined, apiClient);
    const response = await mandateApiFactory.acceptMandateV1(params.id, {
      verificationCode: params.code,
      groups: params.groups.map((g) => g.id),
    });
    return response.data;
  } catch (e) {
    return rejectWithValue(parseError(e));
  }
});

/**
 * Get groups of pg
 */
export const getGroups = createAsyncThunk(
  DELEGATION_ACTIONS.GET_GROUPS, async (params: GroupStatus | undefined, { rejectWithValue }) => {
    try {
      const infoRecipientFactory = InfoRecipientApiFactory(undefined, undefined, apiClient);
      const response = await infoRecipientFactory.getPGGroupsV1(params);
      return response.data as Array<Groups>;
    } catch (e) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const updateMandate = createAsyncThunk<
  void,
  { id: string; groups: Array<{ id: string; name: string }> }
>(DELEGATION_ACTIONS.UPDATE_MANDATE, async (params, { rejectWithValue }) => {
  try {
    const mandateApiFactory = MandateApiFactory(undefined, undefined, apiClient);
    const response = await mandateApiFactory.updateMandateV1(params.id, {
      groups: params.groups.map((g) => g.id),
    });
    return response.data;
  } catch (e) {
    return rejectWithValue(parseError(e));
  }
});

export const resetDelegationsState = createAction<void>('resetDelegationsState');
