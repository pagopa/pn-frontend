import { parseError } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import {
  AddressesApiFactory,
  BffAddressVerificationResponse,
  BffChannelType,
} from '../../generated-client/digital-addresses';
import { InfoRecipientApiFactory } from '../../generated-client/recipient-info';
import {
  AddressType,
  ChannelType,
  DeleteDigitalAddressParams,
  DigitalAddress,
  SaveDigitalAddressParams,
} from '../../models/contacts';
import { FilterPartiesParams, Party } from '../../models/party';

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

      return response.data.filter(
        (addr) => addr.addressType === AddressType.COURTESY || addr.codeValid
      ) as Array<DigitalAddress>;
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
        // TODO: rimuovere l'as appena si ha il bff integrato
        params.channelType as BffChannelType,
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
        // eslint-disable-next-line functional/immutable-data
        address.codeValid = true;
        return address;
      }

      // address validated
      if (address.addressType === AddressType.LEGAL) {
        // eslint-disable-next-line functional/immutable-data
        address.pecValid = true;
        // eslint-disable-next-line functional/immutable-data
        address.codeValid = true;
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
        // TODO: rimuovere l'as appena si ha il bff integrato
        params.channelType as BffChannelType
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
        ChannelType.IOMSG,
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
        ChannelType.IOMSG
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
      const infoRecipientFactory = InfoRecipientApiFactory(undefined, undefined, apiClient);
      const response = await infoRecipientFactory.getPAListV1(
        payload?.paNameFilter ? payload.paNameFilter : undefined
      );

      return response.data as Array<Party>;
    } catch (e) {
      return rejectWithValue(parseError(e));
    }
  },
  {
    getPendingMeta: ({ arg }) => ({ blockLoading: arg?.blockLoading }),
  }
);
