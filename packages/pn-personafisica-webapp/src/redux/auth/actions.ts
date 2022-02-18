import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthApi } from '../../api/auth/Auth.api';
import { User } from './types';

/**
 * Exchange token action between spid-hub and pn.
 * If token is valid, user info are set in sessionStorage
 */
export const exchangeToken = createAsyncThunk<User, string>(
  'exchangeToken',
  async (spidToken: string) => {
    // use spid token to get autenticated user
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
  } as User;
});
