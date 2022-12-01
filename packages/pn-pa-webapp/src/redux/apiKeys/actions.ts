import { performThunkAction } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiKeysApi } from '../../api/apiKeys/ApiKeys.api';
import { ApiKey, ApiKeyStatusBE } from '../../models/ApiKeys';

export enum API_KEYS_ACTIONS {
  GET_API_KEYS = 'getApiKeys',
  SET_API_KEY_STATUS = 'setApiKeyStatus',
  DELETE_API_KEY = 'deleteApiKey'
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
