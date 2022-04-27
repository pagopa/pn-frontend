import { createAsyncThunk } from '@reduxjs/toolkit';
import { DelegationsApi } from '../../api/delegations/Delegations.api';
import { Delegation } from '../delegation/types';

export const getSidemenuInformation = createAsyncThunk<Array<Delegation>>(
  'getDelegator',
  async () => {
    try {
      return await DelegationsApi.getDelegators();
    } catch {
      return [];
    }
  }
);
