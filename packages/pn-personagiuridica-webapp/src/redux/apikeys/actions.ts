import { parseError } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import {
  BffNewVirtualKeyRequest,
  BffNewVirtualKeyResponse,
  BffPublicKeyRequest,
  BffPublicKeyResponse,
  BffPublicKeysCheckIssuerResponse,
  BffPublicKeysResponse,
  BffVirtualKeyStatusRequest,
  BffVirtualKeysResponse,
  ChangeStatusPublicKeyV1StatusEnum,
  PublicKeysApiFactory,
  VirtualKeysApiFactory,
} from '../../generated-client/pg-apikeys';
import { GetApiKeysParams } from '../../models/ApiKeys';
import { BffTosPrivacyActionBody, UserConsentsApiFactory } from '../../generated-client/tos-privacy';

export enum PUBLIC_APIKEYS_ACTIONS {
  GET_PUBLIC_APIKEYS = 'getPublicApiKeys',
  CREATE_PUBLIC_APIKEY = 'createPublicApiKey',
  DELETE_PUBLIC_APIKEY = 'deletePublicApiKey',
  CHANGE_PUBLIC_APIKEY_STATUS = 'changePublicApiKeyStatus',
  ROTATE_PUBLIC_APIKEY = 'rotatePublicApiKey',
  CHECK_PUBLIC_APIKEY_ISSUER = 'checkPublicApiKeyIssuer',
  ACCEPT_TOS_PRIVACY = 'acceptTosPrivacy'
}

export enum VIRTUAL_APIKEYS_ACTIONS {
  GET_VIRTUAL_APIKEYS = 'getVirtualApiKeys',
  CREATE_VIRTUAL_APIKEY = 'createVirtualApiKey',
  DELETE_VIRTUAL_APIKEY = 'deleteVirtualApiKey',
  CHANGE_VIRTUAL_APIKEY_STATUS = 'changeVirtualApiKeyStatus',
}

export const getPublicKeys = createAsyncThunk<BffPublicKeysResponse, GetApiKeysParams | undefined>(
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

      return response.data;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const createPublicKey = createAsyncThunk<BffPublicKeyResponse, BffPublicKeyRequest>(
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

export const changePublicKeyStatus = createAsyncThunk<
  void,
  {
    kid: string;
    status: ChangeStatusPublicKeyV1StatusEnum;
  }
>(PUBLIC_APIKEYS_ACTIONS.CHANGE_PUBLIC_APIKEY_STATUS, async (params, { rejectWithValue }) => {
  try {
    const apiKeysFactory = PublicKeysApiFactory(undefined, undefined, apiClient);
    const response = await apiKeysFactory.changeStatusPublicKeyV1(params.kid, params.status);

    return response.data;
  } catch (e: any) {
    return rejectWithValue(parseError(e));
  }
});

export const rotatePublicKey = createAsyncThunk<
  BffPublicKeyResponse,
  {
    kid: string;
    body: BffPublicKeyRequest;
  }
>(PUBLIC_APIKEYS_ACTIONS.ROTATE_PUBLIC_APIKEY, async (params, { rejectWithValue }) => {
  try {
    const apiKeysFactory = PublicKeysApiFactory(undefined, undefined, apiClient);
    const response = await apiKeysFactory.rotatePublicKeyV1(params.kid, params.body);

    return response.data;
  } catch (e: any) {
    return rejectWithValue(parseError(e));
  }
});

export const checkPublicKeyIssuer = createAsyncThunk<BffPublicKeysCheckIssuerResponse>(
  PUBLIC_APIKEYS_ACTIONS.CHECK_PUBLIC_APIKEY_ISSUER,
  async (_, { rejectWithValue }) => {
    try {
      const apiKeysFactory = PublicKeysApiFactory(undefined, undefined, apiClient);
      const response = await apiKeysFactory.checkIssuerPublicKeyV1();

      return response.data;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);

/**
 * Accepts the terms of service
 */
export const acceptTosPrivacy = createAsyncThunk<void, Array<BffTosPrivacyActionBody>>(
  PUBLIC_APIKEYS_ACTIONS.ACCEPT_TOS_PRIVACY,
  async (body: Array<BffTosPrivacyActionBody>, { rejectWithValue }) => {
    try {
      const tosPrivacyFactory = UserConsentsApiFactory(undefined, undefined, apiClient);
      const response = await tosPrivacyFactory.acceptTosPrivacyV2(body);
      // const response = await tosPrivacyFactory.acceptPgTosPrivacyV1(body);

      return response.data;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);

// -- VIRTUAL API KEYS
export const getVirtualApiKeys = createAsyncThunk<
  BffVirtualKeysResponse,
  GetApiKeysParams | undefined
>(VIRTUAL_APIKEYS_ACTIONS.GET_VIRTUAL_APIKEYS, async (params, { rejectWithValue }) => {
  try {
    const apiKeysFactory = VirtualKeysApiFactory(undefined, undefined, apiClient);
    const response = await apiKeysFactory.getVirtualKeysV1(
      params?.limit,
      params?.lastKey,
      params?.createdAt,
      params?.showPublicKey
    );

    return response.data;
  } catch (e: any) {
    return rejectWithValue(parseError(e));
  }
});

export const createVirtualApiKey = createAsyncThunk<
  BffNewVirtualKeyResponse,
  BffNewVirtualKeyRequest
>(VIRTUAL_APIKEYS_ACTIONS.CREATE_VIRTUAL_APIKEY, async (params, { rejectWithValue }) => {
  try {
    const apiKeysFactory = VirtualKeysApiFactory(undefined, undefined, apiClient);
    const response = await apiKeysFactory.newVirtualKeyV1(params);

    return response.data;
  } catch (e: any) {
    return rejectWithValue(parseError(e));
  }
});

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

export const changeVirtualApiKeyStatus = createAsyncThunk<
  void,
  {
    kid: string;
    body: BffVirtualKeyStatusRequest;
  }
>(VIRTUAL_APIKEYS_ACTIONS.CHANGE_VIRTUAL_APIKEY_STATUS, async (params, { rejectWithValue }) => {
  try {
    const apiKeysFactory = VirtualKeysApiFactory(undefined, undefined, apiClient);
    const response = await apiKeysFactory.changeStatusVirtualKeysV1(params.kid, params.body);

    return response.data;
  } catch (e: any) {
    return rejectWithValue(parseError(e));
  }
});
