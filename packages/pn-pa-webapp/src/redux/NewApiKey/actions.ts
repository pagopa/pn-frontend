/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable @typescript-eslint/no-unused-vars */


/*
  Funzioni mock in attesa del BE
  Rimuovere tutti i commenti eslint quando pronto.
*/
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ApiKeysApi } from "../../api/apiKeys/ApiKeys.api";
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

export const getUserGroups = createAsyncThunk<Array<UserGroup>, GroupStatus | undefined>(
  'getUserGroups',
  async (status: GroupStatus | undefined, { rejectWithValue }) => {
    try {
      return await ApiKeysApi.getUserGroups(status);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);
