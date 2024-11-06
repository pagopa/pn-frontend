import { TFunction } from 'react-i18next';
import * as yup from 'yup';

import { dataRegex } from '@pagopa-pn/pn-commons';

import { AddressType, ChannelType, DigitalAddress, Sender } from '../models/contacts';
import { SelectedAddresses } from '../redux/contact/reducers';

export const internationalPhonePrefix = '+39';

type AddressTypeItem = {
  id: ChannelType;
  shown: boolean;
  disabled: boolean;
};

type AddressRelation = {
  channelType: ChannelType;
  relationWith: Array<ChannelType>;
  shownDependsOn: Array<ChannelType>;
  priority: number;
};

const addressesRelationships: Array<AddressRelation> = [
  {
    channelType: ChannelType.EMAIL,
    relationWith: [ChannelType.EMAIL],
    shownDependsOn: [],
    priority: 1
  },
  {
    channelType: ChannelType.SMS,
    relationWith: [ChannelType.SMS],
    shownDependsOn: [],
    priority: 0
  },
  {
    channelType: ChannelType.PEC,
    relationWith: [ChannelType.PEC, ChannelType.SERCQ_SEND],
    shownDependsOn: [ChannelType.PEC, ChannelType.SERCQ_SEND],
    priority: 2
  },
  {
    channelType: ChannelType.SERCQ_SEND,
    relationWith: [ChannelType.SERCQ_SEND, ChannelType.PEC],
    shownDependsOn: [ChannelType.PEC],
    priority: 3
  },
];

export const contactAlreadyExists = (
  digitalAddresses: Array<DigitalAddress>,
  value: string,
  senderId: string,
  channelType: ChannelType
): boolean =>
  !!digitalAddresses.find(
    (elem) =>
      elem.value !== '' &&
      elem.value === value &&
      (elem.senderId !== senderId || elem.channelType !== channelType)
  );

export const pecValidationSchema = (t: TFunction) =>
  yup
    .string()
    .required(t('legal-contacts.valid-pec', { ns: 'recapiti' }))
    .max(254, t('common.too-long-field-error', { ns: 'recapiti', maxLength: 254 }))
    .matches(dataRegex.email, t('legal-contacts.valid-pec', { ns: 'recapiti' }));

export const emailValidationSchema = (t: TFunction) =>
  yup
    .string()
    .required(t('courtesy-contacts.valid-email', { ns: 'recapiti' }))
    .max(254, t('common.too-long-field-error', { ns: 'recapiti', maxLength: 254 }))
    .matches(dataRegex.email, t('courtesy-contacts.valid-email', { ns: 'recapiti' }));

export const phoneValidationSchema = (t: TFunction, withPrefix = false) =>
  yup
    .string()
    .required(t('courtesy-contacts.valid-sms', { ns: 'recapiti' }))
    .matches(
      withPrefix ? dataRegex.phoneNumberWithItalyPrefix : dataRegex.phoneNumber,
      t('courtesy-contacts.valid-sms', { ns: 'recapiti' })
    );

const isDropdownItemDisabled = (
  allowedAddress: AddressRelation,
  addresses: SelectedAddresses,
  sender: Sender
): boolean => {
  // the address is disabled if there is an address with the same sender, already added
  const senderHasAlreadyAddress =
    addresses[`special${allowedAddress.channelType}Addresses`].findIndex(
      (a) => a.senderId === sender.senderId
    ) > -1;
  if (senderHasAlreadyAddress) {
    return true;
  }
  return false;
};

const isDropdownItemShown = (
  allowedAddress: AddressRelation,
  addresses: SelectedAddresses
): boolean => {
  // the address is shown if it has one of the default addresses listed into shownDependsOn property
  // eslint-disable-next-line functional/no-let
  let show = false;

  for (const dependency of allowedAddress.shownDependsOn) {
    show = !!addresses[`default${dependency}Address`];
    // exit from loop if at least one default address exists
    if (show) {
      break;
    }
  }

  return show;
};

export const specialContactsAvailableAddressTypes = (
  addressesData: SelectedAddresses,
  sender: Sender
): Array<AddressTypeItem> =>
  addressesRelationships.map((relation) => {
    const isDisabled = isDropdownItemDisabled(relation, addressesData, sender);

    const isShown = isDropdownItemShown(relation, addressesData);

    return {
      id: relation.channelType,
      shown: isShown,
      disabled: isDisabled,
    };
  });

export const updateAddressesList = (
  addressType: AddressType,
  channelType: ChannelType,
  senderId: string,
  addresses: Array<DigitalAddress>,
  newAddress: DigitalAddress
) => {
  // we need to substitute the old address in the following cases:
  // 1. has the same channel type of the previous one (i.e. we need to change the old PEC with a new one)
  // 2. Sercq is enabled and a new PEC address which doesn't require validation is specified
  // 3. PEC is enabled and validated and we enable Sercq
  const addressIndex = addresses.findIndex(
    (l) =>
      l.senderId === senderId &&
      l.addressType === addressType &&
      (l.channelType === channelType || 
        (l.channelType === ChannelType.SERCQ_SEND && channelType === ChannelType.PEC && newAddress.pecValid) ||
        (l.channelType === ChannelType.PEC && channelType === ChannelType.SERCQ_SEND && l.pecValid)
      )
  );
  if (addressIndex > -1) {
    // eslint-disable-next-line functional/immutable-data
    addresses[addressIndex] = newAddress;
  } else {
    // eslint-disable-next-line functional/immutable-data
    addresses.push(newAddress);
    sortAddresses(addresses);
  }
};

export const removeAddress = (
  addressType: AddressType,
  channelType: ChannelType,
  senderId: string,
  addresses: Array<DigitalAddress>
) =>
  addresses.filter(
    (address) =>
      address.senderId !== senderId ||
      address.addressType !== addressType ||
      address.channelType !== channelType
  );

  export const sortAddresses = (addresses: Array<DigitalAddress>) => {
  
    const priorityObj = addressesRelationships.reduce(
      (acc, item) => {
        // eslint-disable-next-line functional/immutable-data
        acc[item.channelType] = item.priority;
        return acc;
      },
      {} as { [key: string]: number }
    );
    
    // eslint-disable-next-line functional/immutable-data
    addresses.sort((addr1, addr2) => {
      if((addr1.senderId === 'default' && addr2.senderId === 'default') || (addr1.senderId !== 'default' && addr2.senderId !== 'default')) {
        return priorityObj[addr2.channelType] - priorityObj[addr1.channelType];
      }
      else if(addr1.senderId === 'default') {
        return -1;
      }
      return 1;
    });
    return addresses;
  };
