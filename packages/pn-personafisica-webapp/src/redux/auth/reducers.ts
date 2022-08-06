import { dataRegex, fiscalCodeRegex } from '@pagopa-pn/pn-commons';
import { createSlice } from '@reduxjs/toolkit';
import * as yup from 'yup';
import { acceptToS, exchangeToken, getToSApproval, logout } from './actions';
import { User } from './types';

const userDataMatcher = yup.object({
  family_name: yup.string().matches(dataRegex.name),
  fiscal_number: yup.string().matches(fiscalCodeRegex),
  name: yup.string().matches(dataRegex.name),
  from_aa: yup.boolean(),
  uid: yup.string().uuid(),
  level: yup.string().matches(dataRegex.lettersAndNumbers),
  iat: yup.number(),
  exp: yup.number(),
  aud: yup.string().matches(dataRegex.simpleServer),
  iss: yup.string().url(),
  jti: yup.string().matches(dataRegex.lettersAndNumbers),
  sessionToken: yup.string().matches(dataRegex.token),
});

const noLoggedUserData = {
  sessionToken: '',
  name: '',
  family_name: '',
  fiscal_number: '',
  email: '',
  mobile_phone: '',
  from_aa: false,
  uid: '',
  level: '',
  iat: 0,
  exp: 0,
  iss: '',
  jti: '',
  aud: '',
} as User;

function initialUserData(): User {
  const rawDataFromStorage = sessionStorage.getItem('user');
  if (rawDataFromStorage) {
    /* eslint-disable functional/no-let */
    let userInfoFromSessionStorage = null;
    try {
      userInfoFromSessionStorage = JSON.parse(rawDataFromStorage);
      userDataMatcher.validateSync(userInfoFromSessionStorage);
    } catch (e) {
      // discard the malformed JSON in session storage
      sessionStorage.clear();
      // and clear the eventually parsed JSON since it's not valid
      userInfoFromSessionStorage = null;
    }
    return userInfoFromSessionStorage || noLoggedUserData;
  } else {
    return noLoggedUserData;
  }
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
