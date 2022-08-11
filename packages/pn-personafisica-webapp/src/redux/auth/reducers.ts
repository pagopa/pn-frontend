import { basicInitialUserData, basicNoLoggedUserData, basicUserDataMatcherContents, dataRegex } from '@pagopa-pn/pn-commons';
import { createSlice } from '@reduxjs/toolkit';
import * as yup from 'yup';
import { acceptToS, exchangeToken, getToSApproval, logout } from './actions';
import { User } from './types';

const userDataMatcher = yup.object({
  ...basicUserDataMatcherContents,
  from_aa: yup.boolean(),
  level: yup.string().matches(dataRegex.lettersAndNumbers),
  iat: yup.number(),
  exp: yup.number(),
  aud: yup.string().matches(dataRegex.simpleServer),
  iss: yup.string().url(),
  jti: yup.string().matches(dataRegex.lettersAndNumbers),
});

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

function initialUserData(): User {
  return basicInitialUserData(userDataMatcher, noLoggedUserData);
}

/* eslint-disable functional/immutable-data */
const userSlice = createSlice({
  name: 'userSlice',
  initialState: {
    loading: false,
    user: initialUserData(),
    tos: false,
    fetchedTos: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(exchangeToken.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(getToSApproval.fulfilled, (state, action) => {
      state.tos = action.payload.accepted;
      state.fetchedTos = true;
    });
    builder.addCase(getToSApproval.rejected, (state) => {
      state.tos = false;
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
