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
  async (_params: string, { rejectWithValue }) => {
    try {
      return await ContactsApi.getDigitalAddresses();
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
  } catch (e: any) {
    if (e.response === 406) {
      // { response: { status: 406 }, blockNotification: true }
      return rejectWithValue({ response: e.response, blockNotification: true });
    } else {
      return rejectWithValue({ response: e.response });
    }
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
      return await ContactsApi.deleteLegalAddress(params.senderId, params.channelType);
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
    } catch (e: any) {
      if (e.response === 406) {
        // { response: { status: 406 }, blockNotification: true }
        return rejectWithValue({ response: e.response, blockNotification: true });
      } else {
        return rejectWithValue({ response: e.response });
      }
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
      return await ContactsApi.deleteCourtesyAddress(params.senderId, params.channelType);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const resetContactsState = createAction<void>('resetContactsState');
