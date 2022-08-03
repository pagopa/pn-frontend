import { createSlice } from '@reduxjs/toolkit';
import { Party } from '../../models/party';
import { createDelegation, getAllEntities } from './actions';
import { newDelegation } from './types';

/* eslint-disable functional/immutable-data */
const newDelegationSlice = createSlice({
  name: 'newDelegationSlice',
  initialState: {
    created: false,
    error: false,
    entities: [] as Array<Party>,
  } as newDelegation,
  reducers: {
    resetNewDelegation: (state) => {
      state.created = false;
      state.error = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createDelegation.fulfilled, (state) => {
      state.created = true;
    });
    builder.addCase(getAllEntities.fulfilled, (state, action) => {
      state.entities = action.payload;
    });
  },
});

export const { resetNewDelegation } = newDelegationSlice.actions;

export default newDelegationSlice;
