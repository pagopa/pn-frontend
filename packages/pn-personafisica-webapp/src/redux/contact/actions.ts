import { createAction, createAsyncThunk } from '@reduxjs/toolkit';

import { ContactsApi } from '../../api/contacts/Contacts.api';
import { DigitalAddress, DigitalAddresses, SaveDigitalAddressParams, LegalChannelType } from '../../models/contacts';

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

export const createOrUpdateLegalAddress = createAsyncThunk<DigitalAddress | void, SaveDigitalAddressParams>(
  'createOrUpdateLegalAddress',
  async (params: SaveDigitalAddressParams, { rejectWithValue }) => {
    try {
      return await ContactsApi.createOrUpdateLegalAddress(
        params.recipientId,
        params.senderId,
        params.channelType as LegalChannelType,
        { value: params.value, verificationCode: params.code }
      );
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const resetContactsState = createAction<void>('resetContactsState');
