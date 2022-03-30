import { createAction, createAsyncThunk } from '@reduxjs/toolkit';

import { DelegationsApi } from '../../api/delegations/Delegations.api';
import { Person } from '../delegation/types';

export interface CreateDelegationProps {
  delegate: Person;
  visibilityIds: Array<{
    name: string;
    uniqueIdentifier: string;
  }>;
  verificationCode: string;
  dateto: string;
}

export const createDelegation = createAsyncThunk<string, CreateDelegationProps>(
  'delegation',
  async (data, { rejectWithValue }) => {
    try {
      return await DelegationsApi.createDelegation(data);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const resetNewDelegation = createAction<void>('resetNewDelegation');
