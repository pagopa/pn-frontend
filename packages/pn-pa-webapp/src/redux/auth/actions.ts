import {
  ConsentType,
  PartyEntityWithUrl,
  TosPrivacyConsent,
  parseError,
} from '@pagopa-pn/pn-commons';
import { ProductEntity } from '@pagopa/mui-italia';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import { AuthApi } from '../../api/auth/Auth.api';
import { InfoPaApiFactory } from '../../generated-client/info-pa';
import {
  BffTosPrivacyActionBody,
  UserConsentsApiFactory,
} from '../../generated-client/tos-privacy';
import { User } from '../../models/user';
import { RootState } from '../store';

export enum AUTH_ACTIONS {
  GET_TOS_PRIVACY_APPROVAL = 'getTosPrivacyApproval',
  ACCEPT_TOS_PRIVACY = 'acceptTosPrivacy',
  GET_ADDITIONAL_LANGUAGES = 'getAdditionalLanguages',
  SET_ADDITIONAL_LANGUAGES = 'setAdditionalLanguages',
}

/**
 * Exchange token action between selfcare and pn.
 * If token is valid, user info are set in sessionStorage
 */
export const exchangeToken = createAsyncThunk<User, string>(
  'exchangeToken',
  async (selfCareToken, { rejectWithValue }) => {
    try {
      return await AuthApi.exchangeToken(selfCareToken);
    } catch (e: any) {
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
 * Get the list of institutions
 */
export const getInstitutions = createAsyncThunk<
  Array<PartyEntityWithUrl>,
  void,
  { state: RootState }
>('getInstitutions', async (_, { rejectWithValue, getState }) => {
  try {
    const institutionAndProductFactory = InfoPaApiFactory(undefined, undefined, apiClient);
    const response = await institutionAndProductFactory.getInstitutionsV1();
    const institutions = response.data;
    const { userState } = getState();
    const currentOrganization = userState.user.organization;
    const currentInstitution = {
      id: currentOrganization.id,
      name: currentOrganization.name,
      productRole: currentOrganization?.roles[0].role,
      parentName: currentOrganization?.rootParent?.description,
    } as PartyEntityWithUrl;

    if (
      !institutions.some((institution: { id: string }) => institution.id === currentInstitution.id)
    ) {
      return [...institutions, currentInstitution] as Array<PartyEntityWithUrl>;
    }
    return institutions as Array<PartyEntityWithUrl>;
  } catch (e: any) {
    return rejectWithValue(parseError(e));
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

/** Retrieves user additional language */
export const getAdditionalLanguages = createAsyncThunk(
  AUTH_ACTIONS.GET_ADDITIONAL_LANGUAGES,
  async (_, { rejectWithValue }) => {
    try {
      const infoPaFactory = InfoPaApiFactory(undefined, undefined, apiClient);
      const { data } = await infoPaFactory.getAdditionalLang();
      return {
        additionalLanguages: data.additionalLanguages.map((lang) => lang.toLowerCase()),
      };
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);

/** Update user additional language */
export const setAdditionalLanguages = createAsyncThunk(
  AUTH_ACTIONS.SET_ADDITIONAL_LANGUAGES,
  async (additionalLanguages: Array<string>, { rejectWithValue }) => {
    try {
      const infoPaFactory = InfoPaApiFactory(undefined, undefined, apiClient);
      await infoPaFactory.changeAdditionalLang({
        additionalLanguages: additionalLanguages.map((lang) => lang.toUpperCase()),
      });
      return { additionalLanguages };
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);
