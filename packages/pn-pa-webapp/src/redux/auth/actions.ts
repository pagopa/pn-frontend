import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthApi } from '../../api/auth/Auth.api';
import { ConsentsApi } from '../../api/consents/Consents.api';
import { ExternalRegistriesAPI } from '../../api/external-registries/External-registries.api';
import { Consent, ConsentActionType, ConsentType } from '../../models/consents';
import { Party } from '../../models/party';
import { PartyRole, PNRole } from '../../models/user';
import { User } from './types';

/**
 * Exchange token action between selfcare and pn.
 * If token is valid, user info are set in sessionStorage
 */
export const exchangeToken = createAsyncThunk<User, string>(
  'exchangeToken',
  async (selfCareToken: string, { rejectWithValue }) => {
    // use selfcare token to get autenticated user
    try {
      const user = await AuthApi.exchangeToken(selfCareToken);
      sessionStorage.setItem('user', JSON.stringify(user));
      return user;
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
export const getOrganizationParty = createAsyncThunk<Party, string>(
  'getOrganizationParty',
  async (params: string, { rejectWithValue }) => {
    try {
      const partyFromApi = await ExternalRegistriesAPI.getOrganizationParty(params);
      return partyFromApi || { id: '', name: 'Ente sconosciuto' };
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
