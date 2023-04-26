import { performThunkAction } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ContactsApi } from '../../api/contacts/Contacts.api';
import { DelegationsApi } from '../../api/delegations/Delegations.api';
import { DigitalAddress } from '../../models/contacts';

export enum SIDEMENU_ACTIONS {
  GET_SIDEMENU_INFORMATION = 'getSidemenuInformation',
}

export const getSidemenuInformation = createAsyncThunk<number>(
  SIDEMENU_ACTIONS.GET_SIDEMENU_INFORMATION,
  async () => {
    try {
      const response = await DelegationsApi.countDelegators();
      return response.value;
    } catch (e) {
      return 0;
    }
  }
);

export const getDomicileInfo = createAsyncThunk<Array<DigitalAddress>>(
  'getDomicileInfo',
  performThunkAction(async () => (await ContactsApi.getDigitalAddresses()).legal)
);
