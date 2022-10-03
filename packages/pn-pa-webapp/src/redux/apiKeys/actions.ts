/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable @typescript-eslint/no-unused-vars */


/*
  Funzioni mock in attesa del BE
  Rimuovere tutti i commenti eslint quando pronto.
*/

import { createAsyncThunk } from "@reduxjs/toolkit";
import { ApiKey, ApiKeyStatus } from "../../models/ApiKeys";
import { ApiKeyStatusBE } from "./types";

export const getApiKeys = createAsyncThunk<Array<ApiKey>>('getApiKeys', async (_param, { rejectWithValue }) => {
  try {
    return [{
      name: 'Rimborso e multe',
      apiKey: '2389230894230842038423084230984346213876',
      lastModify: '21/09/2022',
      groups: [ 'Gruppo1', 'Gruppo2', 'Gruppo3', 'Gruppo4', 'Gruppo5' ],
      status: ApiKeyStatus.ENABLED,
      statusHistory: [
        {
          status: ApiKeyStatus.CREATED,
          date: '13/09/2022',
          by: 'Maria Rossi',
        },
        {
          status: ApiKeyStatus.BLOCKED,
          date: '13/09/2022',
          by: 'Maria Rossi',
        },
        {
          status: ApiKeyStatus.ENABLED,
          date: '13/09/2022',
          by: 'Maria Rossi',
        },
      ],
    },
    {
      name: 'Cartelle esattoriali',
      apiKey: '5607829357421908347846434762348625342374',
      lastModify: '22/09/2022',
      groups: [ 'Gruppo1', 'Gruppo2', 'Gruppo3' ],
      status: ApiKeyStatus.BLOCKED,
      statusHistory: [
        {
          status: ApiKeyStatus.CREATED,
          date: '13/09/2022',
          by: 'Maria Rossi',
        },
        {
          status: ApiKeyStatus.BLOCKED,
          date: '13/09/2022',
          by: 'Maria Rossi',
        },
        {
          status: ApiKeyStatus.ENABLED,
          date: '13/09/2022',
          by: 'Maria Rossi',
        },
      ],
    },
    {
      name: 'Rimborsi',
      apiKey: '9985683485954867234873452349257596875496',
      lastModify: '22/09/2022',
      groups: [ 'Gruppo1', 'Gruppo2', 'Gruppo3' ],
      status: ApiKeyStatus.ROTATED,
      statusHistory: [
        {
          status: ApiKeyStatus.CREATED,
          date: '13/09/2022',
          by: 'Maria Rossi',
        },
        {
          status: ApiKeyStatus.BLOCKED,
          date: '13/09/2022',
          by: 'Maria Rossi',
        },
        {
          status: ApiKeyStatus.ENABLED,
          date: '13/09/2022',
          by: 'Maria Rossi',
        },
      ],
    }];
  } catch(e) {
    return rejectWithValue(e);
  }
});

export const setApiKeyStatus = createAsyncThunk<undefined, ApiKeyStatusBE>('setApiKeyStatus', async (apiKey: ApiKeyStatusBE, { rejectWithValue }) => {
  /*
    Rimuovere undefined e mettere il type appropriato in base alla risposta del BE
    Rimuovere console.log anche
  */
  console.log(apiKey);
  try {
    return undefined;
  } catch(e) {
    return rejectWithValue(e);
  }
});

export const setApiKeyDeleted = createAsyncThunk<undefined, string>('setApiKeyDeleted', async (apiKey: string, { rejectWithValue }) => {
  /*
    Rimuovere undefined e mettere il type appropriato in base alla risposta del BE
    Rimuovere console.log anche
  */
  console.log(apiKey);
  try {
    return undefined;
  } catch(e) {
    return rejectWithValue(e);
  }
});

export const addNewApiKey = createAsyncThunk('addNewApiKey', async (_param, { rejectWithValue }) => {
  try {
    return undefined;
  } catch(e) {
    return rejectWithValue(e);
  }
});