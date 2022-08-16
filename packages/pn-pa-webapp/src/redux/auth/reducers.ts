import * as yup from 'yup';
import { createSlice } from '@reduxjs/toolkit';
import { adaptedTokenExchangeError, basicInitialUserData, basicNoLoggedUserData, basicUserDataMatcherContents, dataRegex } from '@pagopa-pn/pn-commons';
import { Party } from '../../models/party';

import { PartyRole, PNRole } from '../../models/user';
import { exchangeToken, logout, getOrganizationParty } from './actions';
import { User } from './types';

const roleMatcher = yup.object({
  role: yup.string().oneOf(Object.values(PNRole)),
  partyRole: yup.string().oneOf(Object.values(PartyRole)),
});

const organizationMatcher = yup.object({
  id: yup.string(),
  roles: yup.array().of(roleMatcher),
  fiscal_code: yup.string().matches(dataRegex.pIva),
  groups: yup.array().of(yup.string()),

});

const userDataMatcher = yup.object({
  ...basicUserDataMatcherContents,
  organization: organizationMatcher,
  desiredExp: yup.number(),
});

const noLoggedUserData = {
  ...basicNoLoggedUserData,
  organization: {
    id: '',
    roles: [
      {
        role: PNRole.ADMIN,
        partyRole: PartyRole.MANAGER,
      },
    ],
    fiscal_code: '',
  },
  desired_exp: 0,
} as User;

const emptyUnauthorizedMessage = { title: '', message: '' };

function initialUserData(): User {
  return basicInitialUserData(userDataMatcher, noLoggedUserData);
}

/* eslint-disable functional/immutable-data */
const userSlice = createSlice({
  name: 'userSlice',
  initialState: {
    loading: false,
    user: initialUserData(),
    organizationParty: {
      id: '',
      name: '',
    } as Party,
    isUnauthorizedUser: false,
    messageUnauthorizedUser: emptyUnauthorizedMessage,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(exchangeToken.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(exchangeToken.rejected, (state, action) => {
      console.log('in exchangeToken.rejected');
      console.log(action.payload);
      const adaptedError = adaptedTokenExchangeError(action.payload, "SelfCare token");
      state.isUnauthorizedUser = adaptedError.isUnauthorizedUser;
      state.messageUnauthorizedUser = adaptedError.isUnauthorizedUser ? adaptedError.response.customMessage : emptyUnauthorizedMessage;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(getOrganizationParty.fulfilled, (state, action) => {
      state.organizationParty = action.payload;
    });
  },
});

export default userSlice;
