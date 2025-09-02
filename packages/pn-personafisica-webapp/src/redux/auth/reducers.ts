import * as yup from 'yup';

import {
  ConsentType,
  basicInitialUserData,
  basicNoLoggedUserData,
  basicUserDataMatcherContents,
  dataRegex,
} from '@pagopa-pn/pn-commons';
import { createSlice } from '@reduxjs/toolkit';

import { SourceChannel, User } from '../../models/User';
import { acceptTosPrivacy, exchangeToken, getTosPrivacyApproval } from './actions';

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
    source: yup
      .object({
        channel: yup.string().oneOf(Object.values(SourceChannel)), // UserSource.channel
        details: yup.string(),
        retrievalId: yup.string().matches(/^[ -~]{1,50}$/),
      })
      .optional(),
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

const initialState = {
  loading: false,
  user: basicInitialUserData(userDataMatcher, noLoggedUserData),
  fetchedTos: false,
  fetchedPrivacy: false,
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
  tosPrivacyApiError: false,
};

/* eslint-disable functional/immutable-data */
const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    resetState: () => {
      sessionStorage.clear();
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(exchangeToken.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(exchangeToken.fulfilled, (state, action) => {
      const user = action.payload;
      // validate user from api before setting it in the sessionStorage
      try {
        userDataMatcher.validateSync(user, { stripUnknown: false });
        sessionStorage.setItem('user', JSON.stringify(user));
        state.user = action.payload;
      } catch (e) {
        console.debug(e);
      } finally {
        state.loading = false;
      }
    });
    builder.addCase(exchangeToken.rejected, (state) => {
      state.loading = false;
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
      state.tosPrivacyApiError = false;
      state.fetchedTos = true;
      state.fetchedPrivacy = true;
    });
    builder.addCase(getTosPrivacyApproval.rejected, (state) => {
      state.tosPrivacyApiError = true;
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

export const { resetState } = userSlice.actions;
export default userSlice;
