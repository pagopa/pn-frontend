import { ConsentType, TosPrivacyConsent, parseError } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import { AuthApi } from '../../api/auth/Auth.api';
import {
  BffTosPrivacyActionBody,
  UserConsentsApiFactory,
} from '../../generated-client/tos-privacy';
import { TokenExchangeRequest, User } from '../../models/User';

export enum AUTH_ACTIONS {
  GET_TOS_PRIVACY_APPROVAL = 'getTosPrivacyApproval',
  ACCEPT_TOS_PRIVACY = 'acceptTosPrivacy',
}

/**
 * Exchange token action between selfcare and pn.
 * If token is valid, user info are set in sessionStorage
 */
export const exchangeToken = createAsyncThunk<User, TokenExchangeRequest>(
  'exchangeToken',
  async (request: TokenExchangeRequest, { rejectWithValue }) => {
    try {
      return await AuthApi.exchangeToken(request);
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);

/**
 * Call api logout to invalidate access token.
 */
export const apiLogout = createAsyncThunk<void, string>(
  'apiLogout',
  async (token) => {
    try {
      return await AuthApi.logout(token);
    } catch (e: any) {
      console.log('Error during logout', e);
    }
  }
);

/**
 * Retrieves if the terms of service are already approved
 */
export const getTosPrivacyApproval = createAsyncThunk(
  AUTH_ACTIONS.GET_TOS_PRIVACY_APPROVAL,
  async (_, { rejectWithValue }) => {
    try {
      const tosPrivacyFactory = UserConsentsApiFactory(undefined, undefined, apiClient);
      const response = await tosPrivacyFactory.getTosPrivacyV2([
        ConsentType.TOS,
        ConsentType.DATAPRIVACY,
      ]);

      return response.data as Array<TosPrivacyConsent>;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);

/**
 * Accepts the terms of service
 */
export const acceptTosPrivacy = createAsyncThunk<void, Array<BffTosPrivacyActionBody>>(
  AUTH_ACTIONS.ACCEPT_TOS_PRIVACY,
  async (body: Array<BffTosPrivacyActionBody>, { rejectWithValue }) => {
    try {
      const tosPrivacyFactory = UserConsentsApiFactory(undefined, undefined, apiClient);
      const response = await tosPrivacyFactory.acceptTosPrivacyV2(body);

      return response.data;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);
