import { createSlice } from '@reduxjs/toolkit';

import {
  BffPublicKeysCheckIssuerResponse,
  BffPublicKeysResponse,
  BffVirtualKeysResponse,
  PublicKeyStatus,
  PublicKeysIssuerResponseIssuerStatusEnum,
} from '../../generated-client/pg-apikeys';
import { checkPublicKeyIssuer, getPublicKeys, getTosPrivacy, getVirtualApiKeys } from './actions';

type initialStateType = {
  loading: boolean;
  publicKeys: BffPublicKeysResponse;
  virtualKeys: BffVirtualKeysResponse;
  issuerState: BffPublicKeysCheckIssuerResponse;
};

const initialState: initialStateType = {
  loading: false,
  publicKeys: {
    items: [],
    total: 0,
  },
  virtualKeys: {
    items: [],
    total: 0,
  },
  issuerState: {
    tosAccepted: false,
    issuer: {
      isPresent: false,
      issuerStatus: PublicKeysIssuerResponseIssuerStatusEnum.Inactive,
    },
  },
};

/* eslint-disable functional/immutable-data */
const apiKeysSlice = createSlice({
  name: 'apiKeysSlice',
  initialState,
  reducers: {
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getPublicKeys.fulfilled, (state, action) => {
      state.publicKeys = action.payload;
      // update also the issuer state
      // isPresent is true if publicKeys.length > 0
      // issuerStatus is active if we have at least one Active or Rotated key
      state.issuerState.issuer.isPresent = action.payload.items.length > 0;
      state.issuerState.issuer.issuerStatus = action.payload.items.some(
        (el) => el.status === PublicKeyStatus.Active || el.status === PublicKeyStatus.Rotated
      )
        ? PublicKeysIssuerResponseIssuerStatusEnum.Active
        : PublicKeysIssuerResponseIssuerStatusEnum.Inactive;
    });
    builder.addCase(getTosPrivacy.fulfilled, (state, action) => {
      state.issuerState.tosAccepted = action.payload.every((el) => el.accepted);
    });
    builder.addCase(checkPublicKeyIssuer.fulfilled, (state, action) => {
      state.issuerState = action.payload;
    });
    builder.addCase(getVirtualApiKeys.fulfilled, (state, action) => {
      state.virtualKeys = action.payload;
    });
  },
});

export default apiKeysSlice;
