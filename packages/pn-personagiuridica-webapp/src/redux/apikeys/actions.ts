import { parseError } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import { PublicKeysApiFactory, VirtualKeysApiFactory } from '../../generated-client/pg-apikeys';
import {
  CheckIssuerStatus,
  GetApiKeysParams,
  NewPublicApiKeyRequest,
  NewVirtualApiKeyRequest,
  PublicKeyBaseParams,
  PublicKeys,
  RotateApiKeyRequest,
  UpdateApiKeyStatusRequest,
  VirtualKeyBaseParams,
  VirtualKeys,
} from '../../models/ApiKeys';

export enum PUBLIC_APIKEYS_ACTIONS {
  GET_PUBLIC_APIKEYS = 'getPublicApiKeys',
  CREATE_PUBLIC_APIKEY = 'createPublicApiKey',
  DELETE_PUBLIC_APIKEY = 'deletePublicApiKey',
  UPDATE_PUBLIC_APIKEY_STATUS = 'updatePublicApiKeyStatus',
  ROTATE_PUBLIC_APIKEY = 'rotatePublicApiKey',
  CHECK_PUBLIC_APIKEY_ISSUER = 'checkPublicApiKeyIssuer',
}

export enum VIRTUAL_APIKEYS_ACTIONS {
  GET_VIRTUAL_APIKEYS = 'getVirtualApiKeys',
  CREATE_VIRTUAL_APIKEY = 'createVirtualApiKey',
  DELETE_VIRTUAL_APIKEY = 'deleteVirtualApiKey',
  UPDATE_VIRTUAL_APIKEY_STATUS = 'updateVirtualApiKeyStatus',
}

export const getPublicKeys = createAsyncThunk<PublicKeys, GetApiKeysParams | undefined>(
  PUBLIC_APIKEYS_ACTIONS.GET_PUBLIC_APIKEYS,
  async (params, { rejectWithValue }) => {
    try {
      const apiKeysFactory = PublicKeysApiFactory(undefined, undefined, apiClient);
      const response = await apiKeysFactory.getPublicKeysV1(
        params?.limit,
        params?.lastKey,
        params?.createdAt,
        params?.showPublicKey
      );

      return response.data as PublicKeys;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const createPublicKey = createAsyncThunk<PublicKeyBaseParams, NewPublicApiKeyRequest>(
  PUBLIC_APIKEYS_ACTIONS.CREATE_PUBLIC_APIKEY,
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
  PUBLIC_APIKEYS_ACTIONS.DELETE_PUBLIC_APIKEY,
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
  PUBLIC_APIKEYS_ACTIONS.UPDATE_PUBLIC_APIKEY_STATUS,
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

export const rotatePublicKey = createAsyncThunk<PublicKeyBaseParams, RotateApiKeyRequest>(
  PUBLIC_APIKEYS_ACTIONS.ROTATE_PUBLIC_APIKEY,
  async (params, { rejectWithValue }) => {
    try {
      const apiKeysFactory = PublicKeysApiFactory(undefined, undefined, apiClient);
      const response = await apiKeysFactory.rotatePublicKeyV1(params.kid, {
        name: params.name,
        publicKey: params.publicKey,
        exponent: params.exponent,
        algorithm: params.algorithm,
      });

      return response.data;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const checkPublicKeyIssuer = createAsyncThunk<CheckIssuerStatus>(
  PUBLIC_APIKEYS_ACTIONS.CHECK_PUBLIC_APIKEY_ISSUER,
  async (_, { rejectWithValue }) => {
    try {
      const apiKeysFactory = PublicKeysApiFactory(undefined, undefined, apiClient);
      const response = await apiKeysFactory.getIssuerStatusPublicKeyV1();

      return response.data as CheckIssuerStatus;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);

// -- VIRTUAL API KEYS
export const getVirtualApiKeys = createAsyncThunk<VirtualKeys, GetApiKeysParams | undefined>(
  VIRTUAL_APIKEYS_ACTIONS.GET_VIRTUAL_APIKEYS,
  async (params, { rejectWithValue }) => {
    try {
      const apiKeysFactory = VirtualKeysApiFactory(undefined, undefined, apiClient);
      const response = await apiKeysFactory.getVirtualKeysV1(
        params?.limit,
        params?.lastKey,
        params?.createdAt,
        params?.showPublicKey
      );

      return response.data as VirtualKeys;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const createVirtualApiKey = createAsyncThunk<VirtualKeyBaseParams, NewVirtualApiKeyRequest>(
  VIRTUAL_APIKEYS_ACTIONS.CREATE_VIRTUAL_APIKEY,
  async (params, { rejectWithValue }) => {
    try {
      const apiKeysFactory = VirtualKeysApiFactory(undefined, undefined, apiClient);
      const response = await apiKeysFactory.newVirtualKeyV1(params);

      return response.data;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const deleteVirtualApiKey = createAsyncThunk<void, string>(
  VIRTUAL_APIKEYS_ACTIONS.DELETE_VIRTUAL_APIKEY,
  async (params, { rejectWithValue }) => {
    try {
      const apiKeysFactory = VirtualKeysApiFactory(undefined, undefined, apiClient);
      const response = await apiKeysFactory.deleteVirtualKeyV1(params);

      return response.data;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const updateVirtualApiKeyStatus = createAsyncThunk<void, UpdateApiKeyStatusRequest>(
  VIRTUAL_APIKEYS_ACTIONS.UPDATE_VIRTUAL_APIKEY_STATUS,
  async (params, { rejectWithValue }) => {
    try {
      const apiKeysFactory = VirtualKeysApiFactory(undefined, undefined, apiClient);
      const response = await apiKeysFactory.changeStatusVirtualKeysV1(params.kid, {
        status: params.status,
      });

      return response.data;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);
