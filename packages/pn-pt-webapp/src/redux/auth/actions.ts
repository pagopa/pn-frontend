import { parseError } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { AuthApi } from '../../api/auth/Auth.api';
import { User } from '../../models/user';
import { userDataMatcher } from '../../utility/user.utility';

/**
 * Exchange token action between selfcare and pn.
 * If token is valid, user info are set in sessionStorage
 */
export const exchangeToken = createAsyncThunk<User, string>(
  'exchangeToken',
  async (selfCareToken, { rejectWithValue }) => {
    try {
      const result = await AuthApi.exchangeToken(selfCareToken);
      userDataMatcher.validateSync(result, { stripUnknown: false });
      return result;
    } catch (e: any) {
      if (e?.name === 'ValidationError') {
        return rejectWithValue({
          code: 'USER_VALIDATION_FAILED',
          message: e.message,
        });
      }
      return rejectWithValue(parseError(e));
    }
  }
);

/**
 * Call api logout to invalidate access token.
 */
export const apiLogout = createAsyncThunk<void, string>('apiLogout', async (token) => {
  try {
    return await AuthApi.logout(token);
  } catch (e: any) {
    console.log('Error during logout', e);
  }
});
