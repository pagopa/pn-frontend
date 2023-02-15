import * as yup from 'yup';
import { createSlice } from '@reduxjs/toolkit';
import {
  adaptedTokenExchangeError,
  basicInitialUserData,
  basicNoLoggedUserData,
  basicUserDataMatcherContents,
  dataRegex,
} from '@pagopa-pn/pn-commons';
import { Party } from '../../models/party';

import { PartyRole, PNRole } from '../../models/user';
import { exchangeToken, logout, getOrganizationParty, acceptToS, getToSApproval } from './actions';
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
  name: yup.string(),
  hasGroups: yup.boolean(),
});

const userDataMatcher = yup
  .object({
    ...basicUserDataMatcherContents,
    organization: organizationMatcher,
    desired_exp: yup.number(),
  })
  .noUnknown(true);

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

/* eslint-disable functional/immutable-data */
const userSlice = createSlice({
  name: 'userSlice',
  initialState: {
    loading: false,
    user: basicInitialUserData(userDataMatcher, noLoggedUserData),
    tos: false,
    isFirstAccept: true,
    consentVersion: '',
    fetchedTos: false,
    organizationParty: {
      id: '',
      name: '',
    } as Party,
    isUnauthorizedUser: false,
    messageUnauthorizedUser: emptyUnauthorizedMessage,
    isClosedSession: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(exchangeToken.fulfilled, (state, action) => {
      const user = action.payload;
      // validate user from api before setting it in the sessionStorage
      try {
        userDataMatcher.validateSync(user, { stripUnknown: false });
        sessionStorage.setItem('user', JSON.stringify(user));
        state.user = action.payload;
      } catch (e) {
        state.isUnauthorizedUser = true;
        state.messageUnauthorizedUser = emptyUnauthorizedMessage;
        console.debug(e);
      }
      state.isClosedSession = false;
    });
    builder.addCase(exchangeToken.rejected, (state, action) => {
      const adaptedError = adaptedTokenExchangeError(action.payload);
      state.isUnauthorizedUser = adaptedError.isUnauthorizedUser;
      state.messageUnauthorizedUser = adaptedError.isUnauthorizedUser
        ? adaptedError.response.customMessage
        : emptyUnauthorizedMessage;
      state.isClosedSession = false;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isClosedSession = true;
    });
    builder.addCase(getOrganizationParty.fulfilled, (state, action) => {
      state.organizationParty = action.payload;
    });
    builder.addCase(getToSApproval.fulfilled, (state, action) => {
      state.tos = action.payload.accepted;
      state.isFirstAccept = action.payload.isFirstAccept;
      state.consentVersion = action.payload.consentVersion;
      state.fetchedTos = true;
    });
    builder.addCase(getToSApproval.rejected, (state) => {
      state.tos = false;
      state.isFirstAccept = true;
      state.fetchedTos = true;
    });
    builder.addCase(acceptToS.fulfilled, (state) => {
      state.tos = true;
    });
    builder.addCase(acceptToS.rejected, (state) => {
      state.tos = false;
    });
  },
});

export default userSlice;
