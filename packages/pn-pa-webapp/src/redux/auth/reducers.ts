import * as yup from 'yup';

import {
  ConsentType,
  basicInitialUserData,
  basicNoLoggedUserData,
  basicUserDataMatcherContents,
  dataRegex,
} from '@pagopa-pn/pn-commons';
import { PartyEntity, ProductEntity } from '@pagopa/mui-italia';
import { createSlice } from '@reduxjs/toolkit';

import { Organization, PNRole, PartyRole, Role, User } from '../../models/user';
import {
  acceptTosPrivacy,
  exchangeToken,
  getAdditionalLanguages,
  getInstitutions,
  getProductsOfInstitution,
  getTosPrivacyApproval,
  setAdditionalLanguages,
} from './actions';

const roleMatcher: yup.SchemaOf<Role> = yup.object({
  role: yup.mixed<PNRole>().required(),
  partyRole: yup.mixed<PartyRole>().required(),
});

const organizationMatcher: yup.SchemaOf<Organization> = yup.object({
  id: yup.string().required(),
  roles: yup.array().of(roleMatcher).required(),
  fiscal_code: yup.string().matches(dataRegex.pIva).required(),
  groups: yup.array().of(yup.string()).notRequired(),
  name: yup.string().required(),
  hasGroups: yup.boolean(),
  aooParent: yup.string().notRequired(),
  subUnitCode: yup.string().notRequired(),
  subUnitType: yup.string().notRequired(),
  rootParent: yup
    .object({
      id: yup.string().notRequired(),
      description: yup.string().notRequired(),
    })
    .notRequired(),
  ipaCode: yup.string().notRequired(),
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
