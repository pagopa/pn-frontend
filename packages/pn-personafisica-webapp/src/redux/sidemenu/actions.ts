import { createAsyncThunk } from '@reduxjs/toolkit';
import { ContactsApi } from '../../api/contacts/Contacts.api';
import { DelegationsApi } from '../../api/delegations/Delegations.api';
import { DigitalAddress } from '../../models/contacts';
import { Delegator } from '../delegation/types';

export enum SIDEMENU_ACTIONS  {
  GET_SIDEMENU_INFORMATION = 'getSidemenuInformation',
}

export const getSidemenuInformation = createAsyncThunk<Array<Delegator>>(
  SIDEMENU_ACTIONS.GET_SIDEMENU_INFORMATION,
  async (_, { rejectWithValue }) => {
    try {
      return await DelegationsApi.getDelegators();
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const getDomicileInfo = createAsyncThunk<Array<DigitalAddress>>(
  'getDomicileInfo',
  async () => {
    try {
      return (await ContactsApi.getDigitalAddresses()).legal;
    } catch {
      return [];
    }
  }
);