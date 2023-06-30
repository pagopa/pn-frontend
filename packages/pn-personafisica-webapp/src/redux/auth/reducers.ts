import {
  basicInitialUserData,
  basicNoLoggedUserData,
  basicUserDataMatcherContents,
  dataRegex,
  adaptedTokenExchangeError,
} from '@pagopa-pn/pn-commons';
import { createSlice } from '@reduxjs/toolkit';
import * as yup from 'yup';
import {
  acceptPrivacy,
  acceptToS,
  exchangeToken,
  getPrivacyApproval,
  getToSApproval,
  logout,
} from './actions';
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
    mobile_phone: yup.string().matches(dataRegex.phoneNumber),
  })
  .noUnknown(true);

const noLoggedUserData = {
  ...basicNoLoggedUserData,
  mobile_phone: '',
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
    builder.addCase(getToSApproval.fulfilled, (state, action) => {
      state.tosConsent = action.payload;
      state.fetchedTos = true;
    });
    builder.addCase(getToSApproval.rejected, (state) => {
      state.tosConsent.accepted = false;
      state.tosConsent.isFirstAccept = true;
      state.fetchedTos = true;
    });
    builder.addCase(getPrivacyApproval.fulfilled, (state, action) => {
      state.privacyConsent = action.payload;
      state.fetchedPrivacy = true;
    });
    builder.addCase(getPrivacyApproval.rejected, (state) => {
      state.privacyConsent.accepted = false;
      state.privacyConsent.isFirstAccept = true;
      state.fetchedPrivacy = true;
    });
    builder.addCase(acceptToS.fulfilled, (state) => {
      state.tosConsent.accepted = true;
    });
    builder.addCase(acceptToS.rejected, (state) => {
      state.tosConsent.accepted = false;
    });
    builder.addCase(acceptPrivacy.fulfilled, (state) => {
      state.privacyConsent.accepted = true;
    });
    builder.addCase(acceptPrivacy.rejected, (state) => {
      state.privacyConsent.accepted = false;
    });
  },
});

export default userSlice;
