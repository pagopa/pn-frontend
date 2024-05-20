import { parseError } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import { ExternalRegistriesAPI } from '../../api/external-registries/External-registries.api';
import { AddressesApiFactory } from '../../generated-client/digital-addresses';
import { AddressType, DigitalAddress } from '../../models/contacts';
import { FilterPartiesParams, Party } from '../../models/party';
import { DeleteDigitalAddressParams, SaveDigitalAddressParams } from './types';

export enum CONTACT_ACTIONS {
  GET_DIGITAL_ADDRESSES = 'getDigitalAddresses',
  CREATE_OR_UPDATE_ADDRESS = 'createOrUpdateAddress',
  DELETE_ADDRESS = 'deleteAddress',
  GET_ALL_ACTIVATED_PARTIES = 'getAllActivatedParties',
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

      // user must verify contact
      if (response.data?.result === 'CODE_VERIFICATION_REQUIRED') {
        return;
      }

      const address: DigitalAddress = {
        addressType: params.addressType,
        senderId: params.senderId,
        senderName: params.senderName,
        channelType: params.channelType,
        value: params.value,
      };

      // waiting for pec validation
      if (response.data?.result === 'PEC_VALIDATION_REQUIRED') {
        // eslint-disable-next-line functional/immutable-data
        address.value = '';
        // eslint-disable-next-line functional/immutable-data
        address.pecValid = false;
        return address;
      }

      // address validated
      if (address.addressType === AddressType.LEGAL) {
        // eslint-disable-next-line functional/immutable-data
        address.pecValid = true;
      }
      return address;
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
