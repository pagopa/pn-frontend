import { parseError } from '@pagopa-pn/pn-commons';
import { ProductEntity } from '@pagopa/mui-italia';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import { AuthApi } from '../../api/auth/Auth.api';
import { InfoPaApiFactory } from '../../generated-client/info-pa';
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

/**
 * Get the list of products of the institution
 */
export const getProductsOfInstitution = createAsyncThunk(
  'getProductsOfInstitution',
  async (_, { rejectWithValue }) => {
    try {
      const institutionAndProductFactory = InfoPaApiFactory(undefined, undefined, apiClient);
      const response = await institutionAndProductFactory.getInstitutionProductsV1();
      return response.data.map((d) => ({ ...d, linkType: 'external' })) as Array<ProductEntity>;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);
