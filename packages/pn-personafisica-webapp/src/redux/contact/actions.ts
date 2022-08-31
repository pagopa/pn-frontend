import { createAsyncThunk } from '@reduxjs/toolkit';

import { ContactsApi } from '../../api/contacts/Contacts.api';
import { ExternalRegistriesAPI } from '../../api/external-registries/External-registries.api';
import {
  CourtesyChannelType,
  DigitalAddress,
  DigitalAddresses,
  LegalChannelType,
} from '../../models/contacts';
import { DeleteDigitalAddressParams, SaveDigitalAddressParams } from './types';

export enum CONTACT_ACTIONS  {
  GET_DIGITAL_ADDRESSES = 'getDigitalAddresses',
}

export const getDigitalAddresses = createAsyncThunk<DigitalAddresses, string>(
  CONTACT_ACTIONS.GET_DIGITAL_ADDRESSES,
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
    if (e.response.status === 406) {
      // { response: { status: 406 }, blockNotification: true }
      return rejectWithValue({ response: e.response, blockNotification: true });
    } else {
      return rejectWithValue({ response: e.response });
    }
  }
});

export const deleteLegalAddress = createAsyncThunk<string, DeleteDigitalAddressParams>(
  'deleteLegalAddress',
  async (params: DeleteDigitalAddressParams, { rejectWithValue }) => {
    try {
      return await ContactsApi.deleteLegalAddress(
        params.senderId,
        params.channelType as LegalChannelType
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
    } catch (e: any) {
      if (e.response.status === 406) {
        // { response: { status: 406 }, blockNotification: true }
        return rejectWithValue({ response: e.response, blockNotification: true });
      } else {
        return rejectWithValue({ response: e.response });
      }
    }
  }
);

export const deleteCourtesyAddress = createAsyncThunk<string, DeleteDigitalAddressParams>(
  'deleteCourtesyAddress',
  async (params: DeleteDigitalAddressParams, { rejectWithValue }) => {
    try {
      return await ContactsApi.deleteCourtesyAddress(
        params.senderId,
        params.channelType as CourtesyChannelType
      );
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const enableIOAddress = createAsyncThunk<DigitalAddress | void, string>(
  'enableIOAddress',
  async (recipientId: string, { rejectWithValue }) => {
    try {
      return await ContactsApi.createOrUpdateCourtesyAddress(
        recipientId,
        'default',
        CourtesyChannelType.IOMSG,
        { value: 'APPIO', verificationCode: '00000' }
      );
    } catch (e: any) {
      if (e.response.status === 406) {
        return rejectWithValue({ response: e.response, blockNotification: true });
      } else {
        return rejectWithValue({ response: e.response });
      }
    }
  }
);

export const disableIOAddress = createAsyncThunk<string, string>(
  'disableIOAddress',
  async (_params: string, { rejectWithValue }) => {
    try {
      return await ContactsApi.deleteCourtesyAddress('default', CourtesyChannelType.IOMSG);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const getAllActivatedParties = createAsyncThunk('getAllActivatedParties', async () =>
  ExternalRegistriesAPI.getAllActivatedParties()
);
