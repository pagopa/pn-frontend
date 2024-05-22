import { parseError } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import { ApiKeysApiFactory } from '../../generated-client/api-keys';
import {
  ApiKeys,
  ChangeApiKeyStatusRequest,
  GetApiKeysRequest,
  NewApiKeyRequest,
  NewApiKeyResponse,
} from '../../models/ApiKeys';
import { GroupStatus, UserGroup } from '../../models/user';
import { InfoPaApiFactory } from '../../generated-client/info-pa';

export enum API_KEYS_ACTIONS {
  GET_API_KEYS = 'getApiKeys',
  NEW_API_KEY = 'newApiKey',
  CHANGE_API_KEY_STATUS = 'changeApiKeyStatus',
  DELETE_API_KEY = 'deleteApiKey',
  GET_API_KEY_USER_GROUPS = 'getApiKeyUserGroups',
}

export const getApiKeys = createAsyncThunk<ApiKeys, GetApiKeysRequest | undefined>(
  API_KEYS_ACTIONS.GET_API_KEYS,
  async (params: GetApiKeysRequest | undefined, { rejectWithValue }) => {
    try {
      const apiKeysApiFactory = ApiKeysApiFactory(undefined, undefined, apiClient);
      const response = await apiKeysApiFactory.getApiKeysV1(
        params?.limit,
        params?.lastKey,
        params?.lastUpdate,
        true
      );
      return response.data as ApiKeys;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const newApiKey = createAsyncThunk<NewApiKeyResponse, NewApiKeyRequest>(
  API_KEYS_ACTIONS.NEW_API_KEY,
  async (params: NewApiKeyRequest, { rejectWithValue }) => {
    try {
      const apiKeysApiFactory = ApiKeysApiFactory(undefined, undefined, apiClient);
      const response = await apiKeysApiFactory.newApiKeyV1(params);
      return response.data;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const getApiKeyUserGroups = createAsyncThunk<Array<UserGroup>, GroupStatus | undefined>(
  API_KEYS_ACTIONS.GET_API_KEY_USER_GROUPS,
  async (params: GroupStatus | undefined, { rejectWithValue }) => {
    try {
      const infoPaFactory = InfoPaApiFactory(undefined, undefined, apiClient);
      const response = await infoPaFactory.getPAGroupsV1(params);
      return response.data as Array<UserGroup>;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const changeApiKeyStatus = createAsyncThunk<void, ChangeApiKeyStatusRequest>(
  API_KEYS_ACTIONS.CHANGE_API_KEY_STATUS,
  async (params: ChangeApiKeyStatusRequest, { rejectWithValue }) => {
    try {
      const apiKeysApiFactory = ApiKeysApiFactory(undefined, undefined, apiClient);
      const response = await apiKeysApiFactory.changeStatusApiKeyV1(params.apiKey, {
        status: params.status,
      });
      return response.data;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const deleteApiKey = createAsyncThunk<void, string>(
  API_KEYS_ACTIONS.DELETE_API_KEY,
  async (params: string, { rejectWithValue }) => {
    try {
      const apiKeysApiFactory = ApiKeysApiFactory(undefined, undefined, apiClient);
      const response = await apiKeysApiFactory.deleteApiKeyV1(params);
      return response.data;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);
