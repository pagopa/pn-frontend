import { performThunkAction } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiKeysApi } from '../../api/apiKeys/ApiKeys.api';
import { ApiKey, ApiKeyStatusBE } from '../../models/ApiKeys';
import { GroupStatus, UserGroup } from '../../models/user';
import { NotificationsApi } from '../../api/notifications/Notifications.api';

export enum API_KEYS_ACTIONS {
  GET_API_KEYS = 'getApiKeys',
  SET_API_KEY_STATUS = 'setApiKeyStatus',
  DELETE_API_KEY = 'deleteApiKey',
  GET_USER_GROUPS = 'getApiKeyUserGroups',
};

export const getApiKeys = createAsyncThunk<Array<ApiKey>>(
  API_KEYS_ACTIONS.GET_API_KEYS,
  performThunkAction(() => ApiKeysApi.getApiKeys())
);

export const setApiKeyStatus = createAsyncThunk<string, ApiKeyStatusBE>(
  API_KEYS_ACTIONS.SET_API_KEY_STATUS,
  performThunkAction((apiKey: ApiKeyStatusBE) => ApiKeysApi.setApiKeyStatus(apiKey))
);

export const deleteApiKey = createAsyncThunk<string, string>(
  API_KEYS_ACTIONS.DELETE_API_KEY,
  performThunkAction((apiKey: string) => ApiKeysApi.deleteApiKey(apiKey))
);

export const getApiKeyUserGroups = createAsyncThunk<Array<UserGroup>, GroupStatus | undefined>(
  API_KEYS_ACTIONS.GET_USER_GROUPS,
  performThunkAction((status: GroupStatus | undefined) => NotificationsApi.getUserGroups(status))
);
