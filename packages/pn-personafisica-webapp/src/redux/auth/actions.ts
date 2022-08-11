import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthApi } from '../../api/auth/Auth.api';
import { ConsentsApi } from '../../api/consents/Consents.api';
import { Consent, ConsentActionType, ConsentType } from '../../models/consents';
import { User } from './types';

/**
 * Exchange token action between selfcare and pn.
 * If token is valid, user info are set in sessionStorage
 */
export const exchangeToken = createAsyncThunk<User, string>(
  'exchangeToken',
  async (spidToken: string, { rejectWithValue }) => {
    // use selfcare token to get autenticated user
    if (spidToken && spidToken !== '') {
      try {
        const user = await AuthApi.exchangeToken(spidToken);
        sessionStorage.setItem('user', JSON.stringify(user));
        return user;
      } catch (e: any) {
        const rejectParameter = e.response.status === 403 ? {
          ...e, 
          response: {...e.response, customMessage: {
            title: "Non sei autorizzato ad accedere", 
            message: "Stai uscendo da Piattaforma Notifiche",
          }}
        } : e;
        return rejectWithValue(rejectParameter);
      }
    } else {
      // I prefer to launch an error than return rejectWithValue, since in this way 
      // the navigation proceeds immediately to the login page.
      // --------------
      // Carlos Lombardi, 2022.08.05
      throw new Error("spidToken must be provided to exchangeToken action");
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
  'getToSApproval',
  async (_, { rejectWithValue }) => {
    try {
      return await ConsentsApi.getConsentByType(ConsentType.TOS);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
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
