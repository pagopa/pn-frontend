import { performThunkAction } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import { DelegationsApi } from '../../api/delegations/Delegations.api';
import { AddressesApiFactory } from '../../generated-client/digital-addresses';
import { DelegationStatus } from '../../models/Deleghe';
import { DigitalAddress } from '../../models/contacts';

export enum SIDEMENU_ACTIONS {
  GET_SIDEMENU_INFORMATION = 'getSidemenuInformation',
}

export const getSidemenuInformation = createAsyncThunk<number>(
  SIDEMENU_ACTIONS.GET_SIDEMENU_INFORMATION,
  async () => {
    try {
      const response = await DelegationsApi.countDelegators(DelegationStatus.PENDING);
      return response.value;
    } catch (e) {
      return 0;
    }
  }
);

export const getDomicileInfo = createAsyncThunk<Array<DigitalAddress>>(
  'getDomicileInfo',
  performThunkAction(async () => {
    const isDefaultAddress = (address: DigitalAddress) => address.senderId === 'default';
    const digitalAddressesFactory = AddressesApiFactory(undefined, undefined, apiClient);
    const response = await digitalAddressesFactory.getAddressesV1();
    const allAddresses = response.data as Array<DigitalAddress>;

    return [...allAddresses.filter(isDefaultAddress)];
  })
);
