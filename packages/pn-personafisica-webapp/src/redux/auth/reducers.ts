import * as yup from 'yup';

import {
  ConsentType,
  adaptedTokenExchangeError,
  basicInitialUserData,
  basicNoLoggedUserData,
  basicUserDataMatcherContents,
  dataRegex,
} from '@pagopa-pn/pn-commons';
import { createSlice } from '@reduxjs/toolkit';

import { acceptTosPrivacy, exchangeToken, getTosPrivacyApproval, logout } from './actions';
import { User } from './types';

const userDataMatcher = yup
  .object({
    ...basicUserDataMatcherContents,
    from_aa: yup.boolean(),
    level: yup.string().matches(dataRegex.lettersAndNumbers),
    iat: yup.number(),
    exp: yup.number(),
    aud: yup.string().matches(dataRegex.simpleServer),
    iss: yup.string().url(),
    jti: yup.string().matches(dataRegex.lettersNumbersAndDashs),
    source: yup.object({
      channel: yup.string(),
      details: yup.string(),
    }).optional(),
  })
  .noUnknown(true);

const noLoggedUserData = {
  ...basicNoLoggedUserData,
  from_aa: false,
  level: '',
  iat: 0,
  exp: 0,
  iss: '',
  jti: '',
  aud: '',
} as User;

const emptyUnauthorizedMessage = { title: '', message: '' };

/* eslint-disable functional/immutable-data */
const userSlice = createSlice({
  name: 'userSlice',
  initialState: {
    loading: false,
    user: basicInitialUserData(userDataMatcher, noLoggedUserData),
    fetchedTos: false,
    fetchedPrivacy: false,
    isUnauthorizedUser: false,
    messageUnauthorizedUser: emptyUnauthorizedMessage,
    isClosedSession: false,
    isForbiddenUser: false,
    tosConsent: {
      accepted: false,
      isFirstAccept: false,
      consentVersion: '',
    },
    privacyConsent: {
      accepted: false,
      isFirstAccept: false,
      consentVersion: '',
    },
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
      state.isForbiddenUser = false;
    });
    builder.addCase(exchangeToken.rejected, (state, action) => {
      const adaptedError = adaptedTokenExchangeError(action.payload);
      state.isUnauthorizedUser = adaptedError.isUnauthorizedUser;
      state.messageUnauthorizedUser = adaptedError.isUnauthorizedUser
        ? adaptedError.response.customMessage
        : emptyUnauthorizedMessage;
      state.isClosedSession = false;
      state.isForbiddenUser = adaptedError.response?.status === 451;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isUnauthorizedUser = false;
      state.isClosedSession = true;
    });
    builder.addCase(getTosPrivacyApproval.fulfilled, (state, action) => {
      const [tosConsent, privacyConsent] = action.payload.filter(
        (consent) =>
          consent.consentType === ConsentType.TOS || consent.consentType === ConsentType.DATAPRIVACY
      );
      if (tosConsent) {
        state.tosConsent = tosConsent;
      }
      if (privacyConsent) {
        state.privacyConsent = privacyConsent;
      }
      state.fetchedTos = true;
      state.fetchedPrivacy = true;
    });
    builder.addCase(getTosPrivacyApproval.rejected, (state) => {
      state.tosConsent.accepted = false;
      state.tosConsent.isFirstAccept = true;
      state.privacyConsent.accepted = false;
      state.privacyConsent.isFirstAccept = true;
      state.fetchedTos = true;
      state.fetchedPrivacy = true;
    });
    builder.addCase(acceptTosPrivacy.fulfilled, (state) => {
      state.tosConsent.accepted = true;
      state.privacyConsent.accepted = true;
    });
    builder.addCase(acceptTosPrivacy.rejected, (state) => {
      state.tosConsent.accepted = false;
      state.privacyConsent.accepted = false;
    });
  },
});

export default userSlice;
