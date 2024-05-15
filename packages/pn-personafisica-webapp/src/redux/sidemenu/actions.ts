import { performThunkAction } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import { DelegationsApi } from '../../api/delegations/Delegations.api';
import { AddressesApiFactory } from '../../generated-client/digital-addresses';
import { CourtesyChannelType, DigitalAddress, IOAllowedValues } from '../../models/contacts';
import { Delegator } from '../delegation/types';

export enum SIDEMENU_ACTIONS {
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

// PN-7095 - per capire quale categorie di recapito far vedere nel DomicileBanner
// si devono prendere gli indirizzi default, tranne per AppIO che si prendono tutti (senza verificare default)
// il cui valore non sia DISABLED (cfr. description e commenti della issue JIRA)
export const getDomicileInfo = createAsyncThunk<Array<DigitalAddress>>(
  'getDomicileInfo',
  performThunkAction(async () => {
    const isDefaultAddress = (address: DigitalAddress) =>
      (address.channelType !== CourtesyChannelType.IOMSG && address.senderId === 'default') ||
      (address.channelType === CourtesyChannelType.IOMSG &&
        address.value !== IOAllowedValues.DISABLED);

    const digitalAddressesFactory = AddressesApiFactory(undefined, undefined, apiClient);
    const response = await digitalAddressesFactory.getAddressesV1();
    const allAddresses = response.data as Array<DigitalAddress>;

    return [...allAddresses.filter(isDefaultAddress)];
  })
);
