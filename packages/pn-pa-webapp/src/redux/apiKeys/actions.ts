import { createAsyncThunk } from "@reduxjs/toolkit";
import { ApiKeysApi } from "../../api/apiKeys/ApiKeys.api";
import { ApiKey } from "../../models/ApiKeys";
import { ApiKeyStatusBE } from "./types";

export const getApiKeys = createAsyncThunk<Array<ApiKey>>('getApiKeys', async (_, { rejectWithValue }) => {
  try {
    return await ApiKeysApi.getApiKeys();
  } catch(e) {
    return rejectWithValue(e);
  }
});

export const setApiKeyStatus = createAsyncThunk<string, ApiKeyStatusBE>('setApiKeyStatus', async (apiKey: ApiKeyStatusBE, { rejectWithValue }) => {
  try {
    return await ApiKeysApi.setApiKeyStatus(apiKey);
  } catch(e) {
    return rejectWithValue(e);
  }
});

export const deleteApiKey = createAsyncThunk<string, string>('deleteApiKey', async (apiKey: string, { rejectWithValue }) => {
  try {
    return await ApiKeysApi.deleteApiKey(apiKey);
  } catch(e) {
    return rejectWithValue(e);
  }
});
