import { createSlice } from '@reduxjs/toolkit';
import {delegations} from './actions';
import { DelegationsList } from './types';

/* eslint-disable functional/immutable-data */
const delegationsSlice = createSlice({
    name: 'delegationsSlice',
    initialState: {
        loading: false,
        error: false,
        delegations: {
            delegators: [],
            delegations: [],
            isCompany: false,
            } as DelegationsList,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(delegations.fulfilled, (state, action) => {
            state.delegations = action.payload;
            state.error = false;
        });
        builder.addCase(delegations.rejected, (state) => {
            state.error = true;
        });
    },
});

export default delegationsSlice;