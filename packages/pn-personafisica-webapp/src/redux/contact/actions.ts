import { createAction, createAsyncThunk } from '@reduxjs/toolkit';

import { ContactsApi } from '../../api/contacts/Contacts.api';
import {
  CourtesyChannelType,
  DigitalAddress,
  DigitalAddresses,
  SaveDigitalAddressParams,
  LegalChannelType,
} from '../../models/contacts';

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

export const createOrUpdateLegalAddress = createAsyncThunk<
  DigitalAddress | void,
  SaveDigitalAddressParams
>('createOrUpdateLegalAddress', async (params: SaveDigitalAddressParams, { rejectWithValue }) => {
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
});

export const deleteLegalAddress = createAsyncThunk<
  string,
  { recipientId: string; senderId: string; channelType: LegalChannelType }
>(
  'deleteLegalAddress',
  async (
    params: { recipientId: string; senderId: string; channelType: LegalChannelType },
    { rejectWithValue }
  ) => {
    try {
      return await ContactsApi.deleteLegalAddress(
        params.recipientId,
        params.senderId,
        params.channelType
      );
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const createOrUpdateCourtesyAddress = createAsyncThunk<
  DigitalAddress | void,
  SaveDigitalAddressParams
>(
  'createOrUpdateCourtesyAddress',
  async (params: SaveDigitalAddressParams, { rejectWithValue }) => {
    try {
      return await ContactsApi.createOrUpdateCourtesyAddress(
        params.recipientId,
        params.senderId,
        params.channelType as CourtesyChannelType,
        { value: params.value, verificationCode: params.code }
      );
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const deleteCourtesyAddress = createAsyncThunk<
  string,
  { recipientId: string; senderId: string; channelType: CourtesyChannelType }
>(
  'deleteCourtesyAddress',
  async (
    params: { recipientId: string; senderId: string; channelType: CourtesyChannelType },
    { rejectWithValue }
  ) => {
    try {
      return await ContactsApi.deleteCourtesyAddress(
        params.recipientId,
        params.senderId,
        params.channelType
      );
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const resetContactsState = createAction<void>('resetContactsState');
