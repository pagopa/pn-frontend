import { createAsyncThunk } from '@reduxjs/toolkit';

import { ContactsApi } from '../../api/contacts/Contacts.api';
import { DigitalAddress, DigitalAddresses, SaveLegalAddressParams } from '../../models/contacts';

export const getDigitalAddresses = createAsyncThunk<DigitalAddresses, string>(
  'getDigitalAddresses',
  async (params: string, { rejectWithValue }) => {
    try {
      return await ContactsApi.getDigitalAddresses(params);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const createOrUpdateLegalAddress = createAsyncThunk<DigitalAddress | void, SaveLegalAddressParams>(
  'createOrUpdateLegalAddress',
  async (params: SaveLegalAddressParams, { rejectWithValue }) => {
    try {
      return await ContactsApi.createOrUpdateLegalAddress(
        params.recipientId,
        params.senderId,
        params.channelType,
        { value: params.value, verificationCode: params.code }
      );
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);
