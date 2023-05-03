import { performThunkAction } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ContactsApi } from '../../api/contacts/Contacts.api';
import { DelegationsApi } from '../../api/delegations/Delegations.api';
import { DigitalAddress } from '../../models/contacts';

export enum SIDEMENU_ACTIONS {
  GET_SIDEMENU_INFORMATION = 'getSidemenuInformation',
}

export const getSidemenuInformation = createAsyncThunk<{
  pendingDelegators: number;
  activeDelegators: number;
}>(
  SIDEMENU_ACTIONS.GET_SIDEMENU_INFORMATION,
  async () => {
    try {
      const [
        pendingDelegatorsResponse,
        activeDelegatorsResponse
      ] = await Promise.all([
        DelegationsApi.countPendingDelegators(),
        DelegationsApi.countActiveDelegators()
      ]);
      return {
        pendingDelegators: pendingDelegatorsResponse.value,
        activeDelegators: activeDelegatorsResponse.value
      };
    } catch (e) {
      return {
        pendingDelegators: 0,
        activeDelegators: 0
    };
    }
  }
);

export const getDomicileInfo = createAsyncThunk<Array<DigitalAddress>>(
  'getDomicileInfo',
  performThunkAction(async () => (await ContactsApi.getDigitalAddresses()).legal)
);
