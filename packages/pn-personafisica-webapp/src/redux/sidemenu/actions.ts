import { performThunkAction } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ContactsApi } from '../../api/contacts/Contacts.api';
import { DelegationsApi } from '../../api/delegations/Delegations.api';
import { DigitalAddress } from '../../models/contacts';
import { Delegator } from '../delegation/types';

export enum SIDEMENU_ACTIONS  {
  GET_SIDEMENU_INFORMATION = 'getSidemenuInformation',
}

export const getSidemenuInformation = createAsyncThunk<Array<Delegator>>(
  SIDEMENU_ACTIONS.GET_SIDEMENU_INFORMATION,
  // performThunkAction(() => DelegationsApi.getDelegators())
  async () => {
    try {
      return await DelegationsApi.getDelegators();
    } catch (e) {
      return [];
    }
  }
);

export const getDomicileInfo = createAsyncThunk<Array<DigitalAddress>>(
  'getDomicileInfo',
  performThunkAction(async () => (await ContactsApi.getDigitalAddresses()).legal)
);
