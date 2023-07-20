import { performThunkAction } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiKeysApi } from '../../api/apiKeys/ApiKeys.api';
import { ApiKeys, ApiKeyStatusBE } from '../../models/ApiKeys';
import { NotificationsApi } from '../../api/notifications/Notifications.api';
import { apikeysMapper } from '../../utils/apikeys.utility';

export enum API_KEYS_ACTIONS {
  GET_API_KEYS = 'getApiKeys',
  SET_API_KEY_STATUS = 'setApiKeyStatus',
  DELETE_API_KEY = 'deleteApiKey',
}

export const getApiKeys = createAsyncThunk<ApiKeys, { lastKey?: string; limit: number }>(
  API_KEYS_ACTIONS.GET_API_KEYS,
  performThunkAction(async (params: { limit: number; lastKey?: string }) => {
    const apikeys = await ApiKeysApi.getApiKeys(params.limit, params.lastKey);
    const groups = await NotificationsApi.getUserGroups();
    return apikeysMapper(apikeys, groups);
  })
);

export const setApiKeyStatus = createAsyncThunk<string, ApiKeyStatusBE>(
  API_KEYS_ACTIONS.SET_API_KEY_STATUS,
  performThunkAction((apiKey: ApiKeyStatusBE) => ApiKeysApi.setApiKeyStatus(apiKey))
);

export const deleteApiKey = createAsyncThunk<string, string>(
  API_KEYS_ACTIONS.DELETE_API_KEY,
  performThunkAction((apiKey: string) => ApiKeysApi.deleteApiKey(apiKey))
);
