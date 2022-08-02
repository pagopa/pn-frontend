import { createSlice } from '@reduxjs/toolkit';
import { acceptToS, exchangeToken, getToSApproval, logout } from './actions';
import { User } from './types';

/* eslint-disable functional/immutable-data */
const userSlice = createSlice({
  name: 'userSlice',
  initialState: {
    loading: false,
    user: (sessionStorage.getItem('user')
      ? JSON.parse(sessionStorage.getItem('user') || '')
      : {
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
          desired_exp: 0,
        }) as User,
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
