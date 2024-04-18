import { parseError, performThunkAction } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import { ApiKeysApi } from '../../api/apiKeys/ApiKeys.api';
import { NotificationsApi } from '../../api/notifications/Notifications.api';
import { ApiKeysApiFactory } from '../../generated-client/api-keys';
import {
  ApiKeys,
  ChangeApiKeyStatusRequest,
  GetApiKeysRequest,
  NewApiKeyRequest,
  NewApiKeyResponse,
} from '../../models/ApiKeys';
import { GroupStatus, UserGroup } from '../../models/user';

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
  performThunkAction((status: GroupStatus | undefined) => NotificationsApi.getUserGroups(status))
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

export const deleteApiKey = createAsyncThunk<string, string>(
  API_KEYS_ACTIONS.DELETE_API_KEY,
  performThunkAction((apiKey: string) => ApiKeysApi.deleteApiKey(apiKey))
);
