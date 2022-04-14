import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthApi } from '../../api/auth/Auth.api';
import { DelegationsApi } from '../../api/delegations/Delegations.api';
import { Delegation } from '../delegation/types';
import { User } from './types';

/**
 * Exchange token action between selfcare and pn.
 * If token is valid, user info are set in sessionStorage
 */
export const exchangeToken = createAsyncThunk<User, string>(
  'exchangeToken',
  async (spidToken: string) => {
    // use selfcare token to get autenticated user
    if (spidToken && spidToken !== '') {
      const user = await AuthApi.exchangeToken(spidToken);
      sessionStorage.setItem('user', JSON.stringify(user));
      return user;
    } else {
      const user: User = JSON.parse(sessionStorage.getItem('user') || '');
      return user;
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
  } as User;
});

export const getNumberDelegator = createAsyncThunk<Array<Delegation>>(
  'getNumberDelegator',
  async () => {
    try {
      return await DelegationsApi.getDelegators();
    } catch {
      return [];
    }
  }
);
