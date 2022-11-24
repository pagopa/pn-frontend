import { createAsyncThunk } from "@reduxjs/toolkit";
import { ApiKeysApi } from "../../api/apiKeys/ApiKeys.api";
import { NotificationsApi } from "../../api/notifications/Notifications.api";
import { UserGroup, GroupStatus } from "../../models/user";
import { NewApiKeyType } from "./types";

export const saveNewApiKey = createAsyncThunk<string, NewApiKeyType>('saveNewApiKey', async (param: NewApiKeyType, { rejectWithValue }) => {
  try {
    return await ApiKeysApi.createNewApiKey(param);
  } catch(e) {
    return rejectWithValue(e);
  }
});

export const getApiKeyUserGroups = createAsyncThunk<Array<UserGroup>, GroupStatus | undefined>(
  'getApiKeyUserGroups',
  async (status: GroupStatus | undefined, { rejectWithValue }) => {
    try {
      return await NotificationsApi.getUserGroups(status);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);
