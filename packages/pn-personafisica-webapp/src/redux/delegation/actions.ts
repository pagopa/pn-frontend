import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { DelegatesApi } from '../../api/delegations/Delegations.api';
import { DelegationsList } from './types';

/**
 *
 */
export const delegations = createAsyncThunk<DelegationsList, string>(
  'delegations',
  async () =>
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

export const openRevocationModal = createAction<string>('openRevocationModal');

export const closeRevocationModal = createAction<void>('closeRevocationModal');
