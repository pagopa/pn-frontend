import * as yup from 'yup';

import {
  adaptedTokenExchangeError,
  basicInitialUserData,
  basicNoLoggedUserData,
  basicUserDataMatcherContents,
  dataRegex,
} from '@pagopa-pn/pn-commons';
import { PartyEntity, ProductEntity } from '@pagopa/mui-italia';
import { createSlice } from '@reduxjs/toolkit';

import { PNRole, PartyRole, Role } from '../../models/user';
import {
  acceptPrivacy,
  acceptToS,
  exchangeToken,
  getInstitutions,
  getPrivacyApproval,
  getProductsOfInstitution,
  getToSApproval,
  logout,
} from './actions';
import { Organization, User } from './types';

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
  parentDescription: yup.string().notRequired(),
  aooParent: yup.string().notRequired(),
  subUnitCode: yup.string().notRequired(),
  subUnitType: yup.string().notRequired(),
  rootParent: yup
    .object({
      id: yup.string().notRequired(),
      description: yup.string().notRequired(),
    })
    .notRequired(),
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
    institutions: [] as Array<PartyEntity>,
    productsOfInstitution: [] as Array<ProductEntity>,
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
        if (process.env.NODE_ENV === 'development') {
          console.debug(e);
        }
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
    builder.addCase(getInstitutions.fulfilled, (state, action) => {
      state.institutions = action.payload;
      const currentInstitutionParentName = state.institutions.find(
        (e) => e.id === state.user.organization.id
      )?.parentName;
      state.user.organization.parentDescription = currentInstitutionParentName;
    });
    builder.addCase(getProductsOfInstitution.fulfilled, (state, action) => {
      state.productsOfInstitution = action.payload;
    });
  },
});

export default userSlice;
