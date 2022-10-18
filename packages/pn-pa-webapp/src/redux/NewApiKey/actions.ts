/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable @typescript-eslint/no-unused-vars */


/*
  Funzioni mock in attesa del BE
  Rimuovere tutti i commenti eslint quando pronto.
*/
import { createAsyncThunk } from "@reduxjs/toolkit";
import { NotificationsApi } from "../../api/notifications/Notifications.api";
import { UserGroup, GroupStatus } from "../../models/user";
import { NewApiKeyType } from "./types";

export const saveNewApiKey = createAsyncThunk<string, NewApiKeyType>('saveNewApiKey', async (param: NewApiKeyType, { rejectWithValue }) => {
  try {
    console.log(param);
    return '0000002340000011234000000077781546453728';
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
