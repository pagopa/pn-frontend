import { createAsyncThunk } from '@reduxjs/toolkit';
import { DelegationsApi } from '../../api/delegations/Delegations.api';
import { Delegator } from '../delegation/types';

export const getSidemenuInformation = createAsyncThunk<Array<Delegator>>(
  'getDelegator',
  async () => {
    try {
      return await DelegationsApi.getDelegators();
    } catch {
      return [];
    }
  }
);
