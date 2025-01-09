import { createSlice } from '@reduxjs/toolkit';

import { BffPublicKeysCheckIssuerResponse, BffPublicKeysResponse, BffVirtualKeysResponse, PublicKeysIssuerResponseIssuerStatusEnum } from '../../generated-client/pg-apikeys';
import { getPublicKeys, getVirtualApiKeys, checkPublicKeyIssuer } from './actions';

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
  issuerState:{
    tosAccepted: false,
    issuer: {
      isPresent: false,
      issuerStatus: PublicKeysIssuerResponseIssuerStatusEnum.Inactive,
    }
  }
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
