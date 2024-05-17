import { parseError } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import { ExternalRegistriesAPI } from '../../api/external-registries/External-registries.api';
import {
  AddressesApiFactory,
  BffAddressVerificationResponse,
} from '../../generated-client/digital-addresses';
import { AddressType, CourtesyChannelType, DigitalAddress } from '../../models/contacts';
import { FilterPartiesParams, Party } from '../../models/party';
import { DeleteDigitalAddressParams, SaveDigitalAddressParams } from './types';

export enum CONTACT_ACTIONS {
  GET_DIGITAL_ADDRESSES = 'getDigitalAddresses',
  GET_ALL_ACTIVATED_PARTIES = 'getAllActivatedParties',
  CREATE_OR_UPDATE_ADDRESS = 'createOrUpdateAddress',
  DELETE_ADDRESS = 'deleteAddress',
  ENABLE_IO_ADDRESS = 'enableIOAddress',
  DISABLE_IO_ADDRESS = 'disableIOAddress',
}

export const getDigitalAddresses = createAsyncThunk<Array<DigitalAddress>>(
  CONTACT_ACTIONS.GET_DIGITAL_ADDRESSES,
  async (_, { rejectWithValue }) => {
    try {
      const digitalAddressesFactory = AddressesApiFactory(undefined, undefined, apiClient);
      const response = await digitalAddressesFactory.getAddressesV1();

      return response.data as Array<DigitalAddress>;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const createOrUpdateAddress = createAsyncThunk<
  DigitalAddress | undefined,
  SaveDigitalAddressParams
>(
  CONTACT_ACTIONS.CREATE_OR_UPDATE_ADDRESS,
  async (params: SaveDigitalAddressParams, { rejectWithValue }) => {
    try {
      const digitalAddressesFactory = AddressesApiFactory(undefined, undefined, apiClient);
      const response = await digitalAddressesFactory.createOrUpdateAddressV1(
        params.addressType,
        params.senderId,
        params.channelType,
        { value: params.value, verificationCode: params.code }
      );

      if (params.addressType === 'LEGAL') {
        // PEC already verified
        if (response.status === 204) {
          return {
            addressType: params.addressType,
            recipientId: params.recipientId,
            senderId: params.senderId,
            senderName: params.senderName,
            channelType: params.channelType,
            value: params.value,
            pecValid: true,
          };
        }

        // PEC_VALIDATION_REQUIRED is received when the code has been inserted and is valid, but the pec validation is
        // still in progress
        if (response.data?.result === 'PEC_VALIDATION_REQUIRED') {
          return {
            addressType: params.addressType,
            recipientId: params.recipientId,
            senderId: params.senderId,
            senderName: params.senderName,
            channelType: params.channelType,
            value: '',
            pecValid: false,
          };
        } else {
          return;
        }
      } else {
        // user must verify contact
        if (response.status !== 204) {
          return;
        }

        // contact already verified
        return {
          addressType: params.addressType,
          recipientId: params.recipientId,
          senderId: params.senderId,
          senderName: params.senderName,
          channelType: params.channelType,
          value: params.value,
        };
      }

      // // user must verify contact
      // if (response.data.result === 'CODE_VERIFICATION_REQUIRED') {
      //   return;
      // }

      // const address = {
      //   addressType: params.addressType,
      //   recipientId: params.recipientId,
      //   senderId: params.senderId,
      //   senderName: params.senderName,
      //   channelType: params.channelType,
      //   value: params.value
      // }

      // // waiting for pec validation
      // if (response.data.result === 'PEC_VALIDATION_REQUIRED') {
      //   address.value = '';
      //   address.pecValid = false;
      //   return address;
      // }

      // // address validated
      // if (address.addressType === AddressType.LEGAL) {
      //  address.pecValid = true;
      // }
      // return address
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const deleteAddress = createAsyncThunk<void, DeleteDigitalAddressParams>(
  CONTACT_ACTIONS.DELETE_ADDRESS,
  async (params: DeleteDigitalAddressParams, { rejectWithValue }) => {
    try {
      const digitalAddressesFactory = AddressesApiFactory(undefined, undefined, apiClient);
      const response = await digitalAddressesFactory.deleteAddressV1(
        params.addressType,
        params.senderId,
        params.channelType
      );

      return response.data;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const enableIOAddress = createAsyncThunk<BffAddressVerificationResponse>(
  CONTACT_ACTIONS.ENABLE_IO_ADDRESS,
  async (_, { rejectWithValue }) => {
    try {
      const digitalAddressesFactory = AddressesApiFactory(undefined, undefined, apiClient);
      const response = await digitalAddressesFactory.createOrUpdateAddressV1(
        AddressType.COURTESY,
        'default',
        CourtesyChannelType.IOMSG,
        { value: 'APPIO', verificationCode: '00000' }
      );

      return response.data;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const disableIOAddress = createAsyncThunk<void>(
  CONTACT_ACTIONS.DISABLE_IO_ADDRESS,
  async (_, { rejectWithValue }) => {
    try {
      const digitalAddressesFactory = AddressesApiFactory(undefined, undefined, apiClient);
      const response = await digitalAddressesFactory.deleteAddressV1(
        AddressType.COURTESY,
        'default',
        CourtesyChannelType.IOMSG
      );

      return response.data;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
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
  },
  {
    getPendingMeta: ({ arg }) => ({ blockLoading: arg?.blockLoading }),
  }
);
