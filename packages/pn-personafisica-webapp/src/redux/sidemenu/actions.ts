import { parseError } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import { AddressesApiFactory } from '../../generated-client/digital-addresses';
import { MandateApiFactory } from '../../generated-client/mandate';
import { AddressType, DigitalAddress } from '../../models/contacts';
import { Delegator } from '../delegation/types';
import { BffCheckTPPResponse, NotificationReceivedApiFactory } from '../../generated-client/notifications';

export enum SIDEMENU_ACTIONS {
  GET_SIDEMENU_INFORMATION = 'getSidemenuInformation',
  GET_DOMICILE_INFO = 'getDomicileInfo',
}

export const getSidemenuInformation = createAsyncThunk<Array<Delegator>>(
  SIDEMENU_ACTIONS.GET_SIDEMENU_INFORMATION,
  async (_params, { rejectWithValue }) => {
    try {
      const mandateApiFactory = MandateApiFactory(undefined, undefined, apiClient);
      const response = await mandateApiFactory.getMandatesByDelegateV1();
      return response.data as Array<Delegator>;
    } catch (e) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const getDomicileInfo = createAsyncThunk<Array<DigitalAddress>>(
  SIDEMENU_ACTIONS.GET_DOMICILE_INFO,
  async (_params, { rejectWithValue }) => {
    try {
      const digitalAddressesFactory = AddressesApiFactory(undefined, undefined, apiClient);
      const response = await digitalAddressesFactory.getAddressesV1();
      return response.data.filter(
        (addr) => addr.addressType === AddressType.COURTESY || addr.codeValid
      ) as Array<DigitalAddress>;
    } catch (e) {
      return rejectWithValue(parseError(e));
    }
  }
);


/**
 * TPP
 */

export const exchangeNotificationRetrievalId = createAsyncThunk<BffCheckTPPResponse, string>(
  'exchangeNotificationRetrievalId',
  async (retrievalId: string, { rejectWithValue }) => {
    try {
      const notificationReceivedApiFactory = NotificationReceivedApiFactory(
        undefined,
        undefined,
        apiClient
      );
      const result = await notificationReceivedApiFactory.checkTppV1(retrievalId);
      return result.data;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);
