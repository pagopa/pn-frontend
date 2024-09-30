import { parseError } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import { PublicKeysApiFactory } from '../../generated-client/pg-apikeys';
import {
  GetPublicKeysParams,
  NewApiKeyRequest,
  PublicKeyBaseParams,
  PublicKeys,
  UpdateApiKeyStatusRequest,
} from '../../models/ApiKeys';

export enum APIKEYS_ACTIONS {
  GET_PUBLIC_KEYS = 'getPublicKeys',
  CREATE_PUBLIC_KEY = 'createPublicKey',
  DELETE_PUBLIC_KEY = 'deletePublicKey',
  UPDATE_PUBLIC_KEY = 'updatePublicKey',
}

export const getPublicKeys = createAsyncThunk<PublicKeys, GetPublicKeysParams>(
  APIKEYS_ACTIONS.GET_PUBLIC_KEYS,
  async (params, { rejectWithValue }) => {
    try {
      const apiKeysFactory = PublicKeysApiFactory(undefined, undefined, apiClient);
      const response = await apiKeysFactory.getPublicKeysV1(
        params.limit,
        params.lastkey,
        params.createdAte,
        params.showPublicKey
      );

      return response.data as PublicKeys;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const createPublicKey = createAsyncThunk<PublicKeyBaseParams, NewApiKeyRequest>(
  APIKEYS_ACTIONS.CREATE_PUBLIC_KEY,
  async (params, { rejectWithValue }) => {
    try {
      const apiKeysFactory = PublicKeysApiFactory(undefined, undefined, apiClient);
      const response = await apiKeysFactory.newPublicKeyV1(params);

      return response.data;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const deletePublicKey = createAsyncThunk<void, string>(
  APIKEYS_ACTIONS.DELETE_PUBLIC_KEY,
  async (params, { rejectWithValue }) => {
    try {
      const apiKeysFactory = PublicKeysApiFactory(undefined, undefined, apiClient);
      const response = await apiKeysFactory.deletePublicKeyV1(params);

      return response.data;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const updatePublicKeyStatus = createAsyncThunk<void, UpdateApiKeyStatusRequest>(
  APIKEYS_ACTIONS.UPDATE_PUBLIC_KEY,
  async (params, { rejectWithValue }) => {
    try {
      const apiKeysFactory = PublicKeysApiFactory(undefined, undefined, apiClient);
      const response = await apiKeysFactory.changeStatusPublicKeyV1(params.kid, params.status);

      return response.data;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);
