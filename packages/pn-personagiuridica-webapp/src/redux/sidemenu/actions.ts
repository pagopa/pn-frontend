import { parseError } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import { MandateApiFactory } from '../../generated-client/mandate';
import { DelegationStatus } from '../../models/Deleghe';

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
