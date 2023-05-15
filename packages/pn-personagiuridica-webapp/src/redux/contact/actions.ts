import { performThunkAction } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { ContactsApi } from '../../api/contacts/Contacts.api';
import { ExternalRegistriesAPI } from '../../api/external-registries/External-registries.api';
import {
  CourtesyChannelType,
  DigitalAddress,
  DigitalAddresses,
  LegalChannelType,
} from '../../models/contacts';
import { FilterPartiesParams, Party } from '../../models/party';
import { DeleteDigitalAddressParams, SaveDigitalAddressParams } from './types';

export enum CONTACT_ACTIONS {
  GET_DIGITAL_ADDRESSES = 'getDigitalAddresses',
  GET_ALL_ACTIVATED_PARTIES = 'getAllActivatedParties',
}

export const getDigitalAddresses = createAsyncThunk<DigitalAddresses, string>(
  CONTACT_ACTIONS.GET_DIGITAL_ADDRESSES,
  performThunkAction(() => ContactsApi.getDigitalAddresses())
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
      { value: params.value, verificationCode: params.code },
      params.senderName
    );
  } catch (e: any) {
    return rejectWithValue(e);
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
        { value: params.value, verificationCode: params.code },
        params.senderName
      );
    } catch (e: any) {
      return rejectWithValue(e);
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

export const getAllActivatedParties = createAsyncThunk<Array<Party>, FilterPartiesParams | null>(
  CONTACT_ACTIONS.GET_ALL_ACTIVATED_PARTIES,
  async (payload, { rejectWithValue }) => {
    try {
      return await ExternalRegistriesAPI.getAllActivatedParties(payload ? payload : {});
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);
