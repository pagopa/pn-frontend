import { createSlice } from '@reduxjs/toolkit';
import { createDelegation, resetNewDelegation } from './actions';
import { newDelegation } from './types';

/* eslint-disable functional/immutable-data */
const newDelegationSlice = createSlice({
  name: 'newDelegationSlice',
  initialState: {
    created: false,
    error: false,
  } as newDelegation,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createDelegation.fulfilled, (state) => {
      state.created = true;
    });
    builder.addCase(resetNewDelegation, (state) => {
      state.created = false;
      state.error = false;
    });
  },
});

export default newDelegationSlice;
