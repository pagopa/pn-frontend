import { createSlice } from '@reduxjs/toolkit';
import { Delegation } from '../delegation/types';
import { exchangeToken, getNumberDelegator, logout } from './actions';
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
        }) as User,
    pendingDelegators: 0,
    delegators: [] as Array<Delegation>,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(exchangeToken.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(getNumberDelegator.fulfilled, (state, action) => {
      state.pendingDelegators = action.payload.filter(
        (delegator) => delegator.status === 'pending'
      ).length;
      state.delegators = action.payload.filter((delegator) => delegator.status !== 'pending');
    });
  },
});

export default userSlice;
