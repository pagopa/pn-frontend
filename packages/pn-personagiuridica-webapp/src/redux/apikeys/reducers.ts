import { createSlice } from '@reduxjs/toolkit';

import {
  CheckIssuerStatus,
  PublicKeyBaseParams,
  PublicKeys,
  VirtualKeyBaseParams,
  VirtualKeys,
} from '../../models/ApiKeys';
import {
  checkPublicKeyIssuer,
  createPublicKey,
  createVirtualApiKey,
  getPublicKeys,
  getVirtualApiKeys,
} from './actions';

type initialStateType = {
  loading: boolean;
  publicKeys: PublicKeys;
  virtualKeys: VirtualKeys;
  publicKey: PublicKeyBaseParams;
  virtualKey: VirtualKeyBaseParams;
  issuerStatus: CheckIssuerStatus | null;
};

const initialState: initialStateType = {
  loading: false,
  publicKeys: {
    items: [],
    total: 0,
    createdAt: '',
    lastKey: '',
  } as PublicKeys,
  virtualKeys: {
    items: [],
    total: 0,
    createdAt: '',
    lastKey: '',
  } as VirtualKeys,
  publicKey: {} as PublicKeyBaseParams,
  virtualKey: {} as VirtualKeyBaseParams,
  issuerStatus: null,
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
    builder.addCase(createPublicKey.fulfilled, (state, action) => {
      state.publicKey = action.payload;
    });
    builder.addCase(checkPublicKeyIssuer.fulfilled, (state, action) => {
      state.issuerStatus = action.payload;
    });
    builder.addCase(getVirtualApiKeys.fulfilled, (state, action) => {
      state.virtualKeys = action.payload;
    });
    builder.addCase(createVirtualApiKey.fulfilled, (state, action) => {
      state.virtualKey = action.payload;
    });
  },
});

export default apiKeysSlice;
