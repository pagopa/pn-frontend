import { performThunkAction } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { ContactsApi } from '../../api/contacts/Contacts.api';
import { DelegationsApi } from '../../api/delegations/Delegations.api';
import { CourtesyChannelType, DigitalAddress, IOAllowedValues } from '../../models/contacts';
import { setProfilePropertyValues } from '../../utility/mixpanel';
import { Delegator } from '../delegation/types';

export enum SIDEMENU_ACTIONS {
  GET_SIDEMENU_INFORMATION = 'getSidemenuInformation',
}

export const getSidemenuInformation = createAsyncThunk<Array<Delegator>>(
  SIDEMENU_ACTIONS.GET_SIDEMENU_INFORMATION,
  // performThunkAction(() => DelegationsApi.getDelegators())
  async () => {
    try {
      const delegators = await DelegationsApi.getDelegators();
      setProfilePropertyValues('profile', 'SEND_HAS_MANDATE', delegators.length > 0 ? 'yes' : 'no');
      return delegators;
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
    const allAddresses = await ContactsApi.getDigitalAddresses();

    const hasPec = allAddresses.legal.length > 0 ? 'yes' : 'no';
    const hasEmail = allAddresses.courtesy.some(
      (address) => address.channelType === CourtesyChannelType.EMAIL
    )
      ? 'yes'
      : 'no';
    const hasSMS = allAddresses.courtesy.some(
      (address) => address.channelType === CourtesyChannelType.SMS
    )
      ? 'yes'
      : 'no';
    const hasAppIO = allAddresses.courtesy.some(
      (address) => address.channelType === CourtesyChannelType.IOMSG
    )
      ? 'activated'
      : 'deactivated';

    setProfilePropertyValues('profile', 'SEND_HAS_PEC', hasPec);
    setProfilePropertyValues('profile', 'SEND_HAS_EMAIL', hasEmail);
    setProfilePropertyValues('profile', 'SEND_HAS_SMS', hasSMS);
    setProfilePropertyValues('profile', 'SEND_APPIO_STATUS', hasAppIO);

    setProfilePropertyValues('superProperty', 'SEND_HAS_PEC', hasPec);
    setProfilePropertyValues('superProperty', 'SEND_HAS_EMAIL', hasEmail);
    setProfilePropertyValues('superProperty', 'SEND_HAS_SMS', hasSMS);
    setProfilePropertyValues('superProperty', 'SEND_APPIO_STATUS', hasAppIO);

    return [
      ...allAddresses.legal.filter(isDefaultAddress),
      ...allAddresses.courtesy.filter(isDefaultAddress),
    ];
  })
);
