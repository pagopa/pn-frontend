import {
  InstitutionType,
  basicInitialUserData,
  basicNoLoggedUserData,
} from '@pagopa-pn/pn-commons';
import { createSelector, createSlice } from '@reduxjs/toolkit';

import { PNRole, PartyRole, User } from '../../models/user';
import { userDataMatcher } from '../../utility/user.utility';
import { RootState } from '../store';
import { exchangeToken } from './actions';

const noLoggedUserData: User = {
  ...basicNoLoggedUserData,
  organization: {
    id: '',
    name: '',
    roles: [
      {
        role: PNRole.ADMIN,
        partyRole: PartyRole.MANAGER,
      },
    ],
    fiscal_code: '',
    institutionType: InstitutionType.PT,
  },
  desired_exp: 0,
};

const initialState = {
  loading: false,
  user: basicInitialUserData<User>(userDataMatcher, noLoggedUserData),
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
  },
});

export const { resetState } = userSlice.actions;
export default userSlice;

// SELECTORS
const selectUserState = (state: RootState) => state.userState;

const selectUser = createSelector([selectUserState], (userState) => userState.user);

const selectUserRole = createSelector([selectUser], (user) => user.organization.roles[0]?.role);

export const authSelectors = {
  selectUser,
  selectUserRole,
};
