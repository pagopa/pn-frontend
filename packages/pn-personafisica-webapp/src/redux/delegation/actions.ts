import { createAsyncThunk } from '@reduxjs/toolkit';
import {DelegationsList} from "./types";


/**
 *
 */
export const delegations = createAsyncThunk<DelegationsList, string>(
    'delegations',
    async (selfCareToken: string) => ({
            delegators:[],
            delegations: [],
            isCompany: false
        } as DelegationsList)
);