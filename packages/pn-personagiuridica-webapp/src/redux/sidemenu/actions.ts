import { parseError } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import { AddressesApiFactory } from '../../generated-client/digital-addresses';
import { MandateApiFactory } from '../../generated-client/mandate';
import { DelegationStatus } from '../../models/Deleghe';
import { DigitalAddress } from '../../models/contacts';

export enum SIDEMENU_ACTIONS {
  GET_SIDEMENU_INFORMATION = 'getSidemenuInformation',
  GET_DOMICILE_INFO = 'getDomicileInfo',
}

export const getSidemenuInformation = createAsyncThunk<number>(
  SIDEMENU_ACTIONS.GET_SIDEMENU_INFORMATION,
  async (_, { rejectWithValue }) => {
    try {
      const mandateApiFactory = MandateApiFactory(undefined, undefined, apiClient);
      const response = await mandateApiFactory.countMandatesByDelegateV1(DelegationStatus.PENDING);
      return response.data.value ?? 0;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const getDomicileInfo = createAsyncThunk<Array<DigitalAddress>>(
  SIDEMENU_ACTIONS.GET_DOMICILE_INFO,
  async (_, { rejectWithValue }) => {
    try {
      const isDefaultAddress = (address: DigitalAddress) => address.senderId === 'default';
      const digitalAddressesFactory = AddressesApiFactory(undefined, undefined, apiClient);
      const response = await digitalAddressesFactory.getAddressesV1();
      const allAddresses = response.data as Array<DigitalAddress>;

      return [...allAddresses.filter(isDefaultAddress)];
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);
