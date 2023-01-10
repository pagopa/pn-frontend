import { performThunkAction } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthApi } from '../../api/auth/Auth.api';
import { ConsentsApi } from '../../api/consents/Consents.api';
import { Consent, ConsentActionType, ConsentType } from '../../models/consents';
import { User } from './types';

export enum AUTH_ACTIONS {
  GET_TOS_APPROVAL = 'getToSApproval',
}

/**
 * Exchange token action between selfcare and pn.
 * If token is valid, user info are set in sessionStorage
 */
export const exchangeToken = createAsyncThunk<User, string>(
  'exchangeToken',
  async (spidToken: string, { rejectWithValue }) => {
    try {
      const user = await AuthApi.exchangeToken(spidToken);
      sessionStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

/**
 * Logout action
 * Clears sessionStorage, clears state
 */
export const logout = createAsyncThunk<User>('logout', async () => {
  sessionStorage.clear();
  return {
    sessionToken: '',
    name: '',
    family_name: '',
    fiscal_number: '',
    email: '',
    mobile_phone: '',
    from_aa: false,
    uid: '',
    level: '',
    iat: 0,
    exp: 0,
    iss: '',
    jti: '',
    aud: '',
  } as User;
});

/**
 * Retrieves if the terms of service are already approved
 */
export const getToSApproval = createAsyncThunk<Consent>(
  AUTH_ACTIONS.GET_TOS_APPROVAL,
  performThunkAction(() => ConsentsApi.getConsentByType(ConsentType.TOS))
);

export const acceptToS = createAsyncThunk<string>('acceptToS', async (_, { rejectWithValue }) => {
  const body = {
    action: ConsentActionType.ACCEPT,
  };
  try {
    return await ConsentsApi.setConsentByType(ConsentType.TOS, body);
  } catch (e) {
    return rejectWithValue(e);
  }
});
