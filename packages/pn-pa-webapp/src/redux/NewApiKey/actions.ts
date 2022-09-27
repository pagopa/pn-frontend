/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable @typescript-eslint/no-unused-vars */


/*
  Funzioni mock in attesa del BE
  Rimuovere tutti i commenti eslint quando pronto.
*/
import { createAsyncThunk } from "@reduxjs/toolkit";
import { NewApiKeyType, ApiKeysGroupType } from "./types";

export const saveNewApiKey = createAsyncThunk<string, NewApiKeyType>('saveNewApiKey', async (param: NewApiKeyType, { rejectWithValue }) => {
  try {
    console.log(param);
    return '0000002340000011234000000077781546453728';
  } catch(e) {
    return rejectWithValue(e);
  }
});

export const getApiKeyGroups = createAsyncThunk<Array<ApiKeysGroupType>>('getApiKeyGroups', async (_param: any, { rejectWithValue }) => {
  try {
    return [
      { id: 1, title: 'Gruppo 1' },
      { id: 2, title: 'Gruppo 2' },
      { id: 3, title: 'Gruppo 3' },
      { id: 4, title: 'Gruppo 4' },
    ];
  } catch(e) {
    return rejectWithValue(e);
  }
});