import {
  PartyEntityWithUrl,
  TosPrivacyConsent,
  parseError,
  performThunkAction,
} from '@pagopa-pn/pn-commons';
import { ProductEntity } from '@pagopa/mui-italia';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import { AuthApi } from '../../api/auth/Auth.api';
import { InstitutionAndProductApiFactory } from '../../generated-client/institution-and-product';
import { BffTosPrivacyBody, UserConsentsApiFactory } from '../../generated-client/tos-privacy';
import { PNRole, PartyRole } from '../../models/user';
import { User } from './types';

export enum AUTH_ACTIONS {
  GET_TOS_PRIVACY_APPROVAL = 'getTosPrivacyApproval',
  ACCEPT_TOS_PRIVACY = 'acceptTosPrivacy',
}

/**
 * Exchange token action between selfcare and pn.
 * If token is valid, user info are set in sessionStorage
 */
export const exchangeToken = createAsyncThunk<User, string>(
  'exchangeToken',
  performThunkAction((selfCareToken: string) => AuthApi.exchangeToken(selfCareToken))
);

/**
 * Get the list of institutions
 */
export const getInstitutions = createAsyncThunk(
  'getInstitutions',
  async (_, { rejectWithValue }) => {
    try {
      const institutionAndProductFactory = InstitutionAndProductApiFactory(
        undefined,
        undefined,
        apiClient
      );
      const response = await institutionAndProductFactory.getInstitutionsV1();
      return response.data as Array<PartyEntityWithUrl>;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);

/**
 * Get the list of products of the institution
 */
export const getProductsOfInstitution = createAsyncThunk(
  'getProductsOfInstitution',
  async (_, { rejectWithValue }) => {
    try {
      const institutionAndProductFactory = InstitutionAndProductApiFactory(
        undefined,
        undefined,
        apiClient
      );
      const response = await institutionAndProductFactory.getInstitutionProductsV1();
      return response.data.map((d) => ({ ...d, linkType: 'external' })) as Array<ProductEntity>;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
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
    uid: '',
    organization: {
      id: '',
      roles: [
        {
          partyRole: PartyRole.MANAGER,
          role: PNRole.ADMIN,
        },
      ],
      fiscal_code: '',
    },
  } as User;
});

/**
 * Retrieves if the terms of service are already approved
 */
export const getTosPrivacyApproval = createAsyncThunk(
  AUTH_ACTIONS.GET_TOS_PRIVACY_APPROVAL,
  async (_, { rejectWithValue }) => {
    try {
      const tosPrivacyFactory = UserConsentsApiFactory(undefined, undefined, apiClient);
      const response = await tosPrivacyFactory.getTosPrivacyV1();

      return response.data as TosPrivacyConsent;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);

/**
 * Accepts the terms of service
 */
export const acceptTosPrivacy = createAsyncThunk<void, BffTosPrivacyBody>(
  AUTH_ACTIONS.ACCEPT_TOS_PRIVACY,
  async (body: BffTosPrivacyBody, { rejectWithValue }) => {
    try {
      const tosPrivacyFactory = UserConsentsApiFactory(undefined, undefined, apiClient);
      const response = await tosPrivacyFactory.acceptTosPrivacyV1(body);

      return response.data;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);
