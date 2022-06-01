import { createSlice } from '@reduxjs/toolkit';

import { PartyRole } from '../../models/user';
import { exchangeToken, logout } from './actions';
import { User } from './types';

/* eslint-disable functional/immutable-data */
const userSlice = createSlice({
  name: 'userSlice',
  initialState: {
    loading: false,
    user: (sessionStorage.getItem('user')
      ? JSON.parse(sessionStorage.getItem('user') || '')
      : {
          email: '',
          name: '',
          uid: '',
          sessionToken: '',
          family_name: '',
          fiscal_number: '',
          organization: {
            id: '',
            roles: [
              {
                role: '',
                partyRole: PartyRole.MANAGER,
              },
            ],
            fiscal_code: '',
          },
        }) as User,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(exchangeToken.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export default userSlice;
