import { performThunkAction } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { ApiKeysApi } from '../../api/apiKeys/ApiKeys.api';
import { NotificationsApi } from '../../api/notifications/Notifications.api';
import { ApiKeyParam, ApiKeyStatusBE, ApiKeys } from '../../models/ApiKeys';
import { UserGroup } from '../../models/user';
import { apikeysMapper } from '../../utility/apikeys.utility';

export enum API_KEYS_ACTIONS {
  GET_API_KEYS = 'getApiKeys',
  SET_API_KEY_STATUS = 'setApiKeyStatus',
  DELETE_API_KEY = 'deleteApiKey',
}

export const getApiKeys = createAsyncThunk<ApiKeys<UserGroup>, ApiKeyParam | undefined>(
  API_KEYS_ACTIONS.GET_API_KEYS,
  performThunkAction(async (param?: ApiKeyParam) => {
    const apikeys = await ApiKeysApi.getApiKeys(param);
    const groups = await NotificationsApi.getUserGroups();
    return { ...apikeys, items: apikeysMapper(apikeys.items, groups) };
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
