import { parseError, performThunkAction } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import { ApiKeysApi } from '../../api/apiKeys/ApiKeys.api';
import { NotificationsApi } from '../../api/notifications/Notifications.api';
import { ApiKeysApiFactory } from '../../generated-client/api-keys';
import { ApiKeyParam, ApiKeyStatusBE, ApiKeys, NewApiKeyRequest } from '../../models/ApiKeys';
import { GroupStatus, UserGroup } from '../../models/user';

export enum API_KEYS_ACTIONS {
  GET_API_KEYS = 'getApiKeys',
  NEW_API_KEY = 'newApiKey',
  SET_API_KEY_STATUS = 'setApiKeyStatus',
  DELETE_API_KEY = 'deleteApiKey',
  GET_API_KEY_USER_GROUPS = 'getApiKeyUserGroups',
}

export const getApiKeys = createAsyncThunk<ApiKeys, ApiKeyParam | undefined>(
  API_KEYS_ACTIONS.GET_API_KEYS,
  async (params: ApiKeyParam | undefined, { rejectWithValue }) => {
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
  /*
  performThunkAction(async (param?: ApiKeyParam) => {
    const apikeys = await ApiKeysApi.getApiKeys(param);
    const groups = await NotificationsApi.getUserGroups();
    return { ...apikeys, items: apikeysMapper(apikeys.items, groups) };
  })
  */
);

export const newApiKey = createAsyncThunk<string, NewApiKeyRequest>(
  API_KEYS_ACTIONS.NEW_API_KEY,
  performThunkAction((param: NewApiKeyRequest) => ApiKeysApi.createNewApiKey(param))
);

export const getApiKeyUserGroups = createAsyncThunk<Array<UserGroup>, GroupStatus | undefined>(
  API_KEYS_ACTIONS.GET_API_KEY_USER_GROUPS,
  performThunkAction((status: GroupStatus | undefined) => NotificationsApi.getUserGroups(status))
);

export const setApiKeyStatus = createAsyncThunk<string, ApiKeyStatusBE>(
  API_KEYS_ACTIONS.SET_API_KEY_STATUS,
  performThunkAction((apiKey: ApiKeyStatusBE) => ApiKeysApi.setApiKeyStatus(apiKey))
);

export const deleteApiKey = createAsyncThunk<string, string>(
  API_KEYS_ACTIONS.DELETE_API_KEY,
  performThunkAction((apiKey: string) => ApiKeysApi.deleteApiKey(apiKey))
);
