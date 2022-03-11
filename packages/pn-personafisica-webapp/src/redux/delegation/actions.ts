import { createAsyncThunk } from '@reduxjs/toolkit';
import { DelegatesApi } from '../../api/delegations/Delegations.api';
import { DelegationsList } from './types';

/**
 *
 */
export const delegations = createAsyncThunk<DelegationsList, string>(
  'delegations',
  async (selfCareToken: string) =>
    ({
      delegators: [],
      delegations: [],
      isCompany: false,
    } as DelegationsList)
);

export const revokeDelegation = createAsyncThunk<'success' | 'error', string>(
  'revokeDelegation',
  async (id: string, { rejectWithValue }) => {
    try {
      return await DelegatesApi.revokeDelegation(id);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);
