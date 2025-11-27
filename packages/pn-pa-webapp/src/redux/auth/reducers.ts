import { ConsentType, basicInitialUserData, basicNoLoggedUserData } from '@pagopa-pn/pn-commons';
import { PartyEntity, ProductEntity } from '@pagopa/mui-italia';
import { createSlice } from '@reduxjs/toolkit';

import { PNRole, PartyRole, User } from '../../models/user';
import { userDataMatcher } from '../../utility/user.utility';
import {
  acceptTosPrivacy,
  exchangeToken,
  getAdditionalLanguages,
  getInstitutions,
  getProductsOfInstitution,
  getTosPrivacyApproval,
  setAdditionalLanguages,
} from './actions';

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
  institutions: [] as Array<PartyEntity>,
  productsOfInstitution: [] as Array<ProductEntity>,
  additionalLanguages: [] as Array<string>,
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

      sessionStorage.setItem('user', JSON.stringify(user));
      state.user = user;

      state.loading = false;
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
    builder.addCase(getInstitutions.fulfilled, (state, action) => {
      state.institutions = action.payload;
    });
    builder.addCase(getProductsOfInstitution.fulfilled, (state, action) => {
      state.productsOfInstitution = action.payload;
    });
    builder.addCase(getAdditionalLanguages.fulfilled, (state, action) => {
      state.additionalLanguages = action.payload.additionalLanguages;
    });
    builder.addCase(setAdditionalLanguages.fulfilled, (state, action) => {
      state.additionalLanguages = action.payload.additionalLanguages;
    });
  },
});

export const { resetState } = userSlice.actions;
export default userSlice;
