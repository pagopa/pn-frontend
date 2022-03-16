import { createAsyncThunk } from '@reduxjs/toolkit';

import { DelegatesApi } from '../../api/delegations/Delegations.api';
import { Delegation } from '../delegation/types';

export const createDelegation = createAsyncThunk<Delegation | 'error', string>(
  'delegation',
  async (data, { rejectWithValue }) => {
    try {
      return await DelegatesApi.createDelegation(data);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);
