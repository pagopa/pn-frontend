import { createSlice } from '@reduxjs/toolkit';
import { Party } from '../../models/party';
import { createDelegation, getAllEntities, resetNewDelegation } from './actions';
import { newDelegation } from './types';

/* eslint-disable functional/immutable-data */
const newDelegationSlice = createSlice({
  name: 'newDelegationSlice',
  initialState: {
    created: false,
    error: false,
    entities: [] as Array<Party>,
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
    builder.addCase(getAllEntities.fulfilled, (state, action) => {
      state.entities = action.payload;
    });
  },
});

export default newDelegationSlice;
