import { createSlice } from '@reduxjs/toolkit';
import { createDelegation } from './actions';
import { newDelegation } from './types';

/* eslint-disable functional/immutable-data */
const newDelegationSlice = createSlice({
  name: 'newDelegationSlice',
  initialState: {
    loaded: false,
    error: false,
  } as newDelegation,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createDelegation.fulfilled, (state) => {
      state.loaded = true;
    });
  },
});

export default newDelegationSlice;
