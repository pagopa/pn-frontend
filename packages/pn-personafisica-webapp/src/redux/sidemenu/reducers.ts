import { createSlice } from '@reduxjs/toolkit';
import { Delegation } from '../delegation/types';
import { getSidemenuInformation } from './actions';

/* eslint-disable functional/immutable-data */
const sidemenuSlice = createSlice({
  name: 'sidemenuSlice',
  initialState: {
    pendingDelegators: 0,
    delegators: [] as Array<Delegation>,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSidemenuInformation.fulfilled, (state, action) => {
      state.pendingDelegators = action.payload.filter(
        (delegator) => delegator.status === 'pending'
      ).length;
      state.delegators = action.payload.filter((delegator) => delegator.status !== 'pending');
    }); 
  },
});

export default sidemenuSlice;