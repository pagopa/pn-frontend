import { createAsyncThunk } from '@reduxjs/toolkit';
import {DelegationsList} from "./types";


/**
 *
 */
export const delegations = createAsyncThunk<DelegationsList>(
    'delegations',
    async () => ({
            delegators:[],
            delegations: [],
            isCompany: false
        } as DelegationsList)
);