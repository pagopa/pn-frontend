import { parseError, performThunkAction } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import { ContactsApi } from '../../api/contacts/Contacts.api';
import { MandateApiFactory } from '../../generated-client/mandate';
import { DelegationStatus } from '../../models/Deleghe';
import { DigitalAddress } from '../../models/contacts';

export enum SIDEMENU_ACTIONS {
  GET_SIDEMENU_INFORMATION = 'getSidemenuInformation',
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
  'getDomicileInfo',
  performThunkAction(async () => {
    const isDefaultAddress = (address: DigitalAddress) => address.senderId === 'default';
    const allAddresses = await ContactsApi.getDigitalAddresses();
    return [
      ...allAddresses.legal.filter(isDefaultAddress),
      ...allAddresses.courtesy.filter(isDefaultAddress),
    ];
  })
);
