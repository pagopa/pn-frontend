import { performThunkAction } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthApi } from '../../api/auth/Auth.api';
import { ConsentsApi } from '../../api/consents/Consents.api';
import { Consent, ConsentActionType, ConsentType } from '../../models/consents';
import { PartyRole, PNRole, User } from './types';

export enum AUTH_ACTIONS {
  GET_TOS_APPROVAL = 'getToSApproval',
  GET_PRIVACY_APPROVAL = 'getPrivacyApproval',
}

/**
 * Exchange token action between selfcare and pn.
 * If token is valid, user info are set in sessionStorage
 */
export const exchangeToken = createAsyncThunk<User, string>(
  'exchangeToken',
  async (spidToken: string, { rejectWithValue }) => {
    try {
      return await AuthApi.exchangeToken(spidToken);
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
    from_aa: false,
    uid: '',
    level: '',
    iat: 0,
    exp: 0,
    iss: '',
    jti: '',
    aud: '',
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
    desired_exp: 0,
  } as User;
});

/**
 * Retrieves if the terms of service are already approved
 */
export const getToSApproval = createAsyncThunk<Consent>(
  AUTH_ACTIONS.GET_TOS_APPROVAL,
  performThunkAction(() => ConsentsApi.getConsentByType(ConsentType.TOS))
);

export const getPrivacyApproval = createAsyncThunk<Consent>(
  AUTH_ACTIONS.GET_PRIVACY_APPROVAL,
  performThunkAction(() => ConsentsApi.getConsentByType(ConsentType.DATAPRIVACY))
);

export const acceptToS = createAsyncThunk<string, string>(
  'acceptToS',
  performThunkAction((consentVersion: string) => {
    const body = {
      action: ConsentActionType.ACCEPT,
    };
    return ConsentsApi.setConsentByType(ConsentType.TOS, consentVersion, body);
  })
);

export const acceptPrivacy = createAsyncThunk<string, string>(
  'acceptPrivacy',
  performThunkAction((consentVersion: string) => {
    const body = {
      action: ConsentActionType.ACCEPT,
    };
    return ConsentsApi.setConsentByType(ConsentType.DATAPRIVACY, consentVersion, body);
  })
);
