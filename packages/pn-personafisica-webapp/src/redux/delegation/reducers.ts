import { createSlice } from '@reduxjs/toolkit';
import { getDelegates, getDelegators } from './actions';

/* eslint-disable functional/immutable-data */
const delegationsSlice = createSlice({
  name: 'delegationsSlice',
  initialState: {
    loading: false,
    error: false,
    delegations: {
      delegators: [],
      delegates: [],
      isCompany: false,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDelegates.fulfilled, (state, action) => {
      state.delegations.delegates = action.payload;
      state.loading = false;
    });
    builder.addCase(getDelegators.fulfilled, (state, action) => {
      state.delegations.delegators = action.payload;
      state.loading = false;
    });
    builder.addCase(getDelegates.rejected, (state) => {
      state.error = true;
    });
    builder.addCase(getDelegators.rejected, (state) => {
      state.error = true;
    });
    builder.addCase(getDelegates.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getDelegators.pending, (state) => {
      state.loading = true;
    });
  },
});

export default delegationsSlice;
