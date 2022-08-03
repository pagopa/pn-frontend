import { createAsyncThunk } from '@reduxjs/toolkit';
import { ContactsApi } from '../../api/contacts/Contacts.api';
import { DelegationsApi } from '../../api/delegations/Delegations.api';
import { DigitalAddress } from '../../models/contacts';
import { Delegator } from '../delegation/types';

export const getSidemenuInformation = createAsyncThunk<Array<Delegator>>(
  'getSidemenuInformation',
  async () => {
    try {
      return await DelegationsApi.getDelegators();
    } catch {
      return [];
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