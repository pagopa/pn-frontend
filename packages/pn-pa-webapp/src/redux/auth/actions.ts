import { createAsyncThunk } from '@reduxjs/toolkit';
import { performThunkAction } from '@pagopa-pn/pn-commons';
import { AuthApi } from '../../api/auth/Auth.api';
import { ConsentsApi } from '../../api/consents/Consents.api';
import { ExternalRegistriesAPI } from '../../api/external-registries/External-registries.api';
import { Consent, ConsentActionType, ConsentType } from '../../models/consents';
import { Party } from '../../models/party';
import { PartyRole, PNRole } from '../../models/user';
import { User } from './types';

export enum AUTH_ACTIONS {
  GET_ORGANIZATION_PARTY = 'getOrganizationParty',
  GET_TOS_APPROVAL = 'getToSApproval',
  GET_PRIVACY_APPROVAL = 'getPrivacyApproval',
}

/**
 * Exchange token action between selfcare and pn.
 * If token is valid, user info are set in sessionStorage
 */
export const exchangeToken = createAsyncThunk<User, string>(
  'exchangeToken',
  async (selfCareToken: string, { rejectWithValue }) => {
    // use selfcare token to get autenticated user
    try {
      return await AuthApi.exchangeToken(selfCareToken);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

/**
 * Obtain the organization party for the given organization id.
 * NB: in fact, when the corresponding reducer is to be called, the value of the organization id
 *     is already in the state of this slice. But given the way the reducer/action pair is defined,
 *     I could not find to have the state accesible to the code of the thunk.
 *     Hence the organizationId is expected as a parameter, whose value will be taken from this very slice.
 *     ------------------------------
 *     Carlos Lombardi, 2022.07.27
 */
/**
 @deprecated since PN-5881
 */
export const getOrganizationParty = createAsyncThunk<Party, string>(
  AUTH_ACTIONS.GET_ORGANIZATION_PARTY,
  performThunkAction(async (organizationId: string) => {
    const partyFromApi = await ExternalRegistriesAPI.getOrganizationParty(organizationId);
    return partyFromApi || { id: '', name: 'Ente sconosciuto' };
  })
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