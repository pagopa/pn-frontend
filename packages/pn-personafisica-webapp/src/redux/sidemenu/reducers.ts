import { createSlice } from '@reduxjs/toolkit';
import { DigitalAddress } from '../../models/contacts';
import { Delegator } from '../delegation/types';
import { getDomicileInfo, getSidemenuInformation } from './actions';

/* eslint-disable functional/immutable-data */
const generalInfoSlice = createSlice({
  name: 'generalInfoSlice',
  initialState: {
    pendingDelegators: 0,
    delegators: [] as Array<Delegator>,
    legalDomicile: [] as Array<DigitalAddress>,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSidemenuInformation.fulfilled, (state, action) => {
      state.pendingDelegators = action.payload.filter(
        (delegator) => delegator.status === 'pending'
      ).length;
      state.delegators = action.payload.filter((delegator) => delegator.status !== 'pending');
    });
    builder.addCase(getDomicileInfo.fulfilled, (state, action) => {
      state.legalDomicile = action.payload;
    });
  },
});

export default generalInfoSlice;
