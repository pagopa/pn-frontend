import { TFunction } from 'react-i18next';
import * as yup from 'yup';

import { dataRegex } from '@pagopa-pn/pn-commons';

import { AddressType, ChannelType, DigitalAddress } from '../models/contacts';
import { SelectedAddresses } from '../redux/contact/reducers';

export const internationalPhonePrefix = '+39';

type AddressTypeItem = {
  id: ChannelType;
  shown: boolean;
};

type AddressRelation = {
  channelType: ChannelType;
  shownDependsOn: Array<ChannelType>;
};

const addressesRelationships: Array<AddressRelation> = [
  {
    channelType: ChannelType.PEC,
    shownDependsOn: [ChannelType.PEC, ChannelType.SERCQ_SEND],
  },
  {
    channelType: ChannelType.SERCQ_SEND,
    shownDependsOn: [ChannelType.PEC],
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
    .matches(dataRegex.noSpaceAtEdges, t('no-spaces-at-edges', { ns: 'common' }))
    .matches(dataRegex.email, t('legal-contacts.valid-pec', { ns: 'recapiti' }));

export const emailValidationSchema = (t: TFunction) =>
  yup
    .string()
    .required(t('courtesy-contacts.valid-email', { ns: 'recapiti' }))
    .max(254, t('common.too-long-field-error', { ns: 'recapiti', maxLength: 254 }))
    .matches(dataRegex.noSpaceAtEdges, t('no-spaces-at-edges', { ns: 'common' }))
    .matches(dataRegex.email, t('courtesy-contacts.valid-email', { ns: 'recapiti' }));

export const phoneValidationSchema = (t: TFunction, withPrefix = false) =>
  yup
    .string()
    .required(t('courtesy-contacts.valid-sms', { ns: 'recapiti' }))
    .matches(dataRegex.noSpaceAtEdges, t('no-spaces-at-edges', { ns: 'common' }))
    .matches(
      withPrefix ? dataRegex.phoneNumberWithItalyPrefix : dataRegex.phoneNumber,
      t('courtesy-contacts.valid-sms', { ns: 'recapiti' })
    );

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
): Array<AddressTypeItem> =>
  addressesRelationships.map((relation) => {

    const isShown = isDropdownItemShown(relation, addressesData);

    return {
      id: relation.channelType,
      shown: isShown,
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
        (l.channelType === ChannelType.SERCQ_SEND &&
          channelType === ChannelType.PEC &&
          newAddress.pecValid) ||
        (l.channelType === ChannelType.PEC && channelType === ChannelType.SERCQ_SEND && l.pecValid))
  );
  if (addressIndex > -1) {
    // eslint-disable-next-line functional/immutable-data
    addresses[addressIndex] = newAddress;
  } else {
    // eslint-disable-next-line functional/immutable-data
    addresses.push(newAddress);
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
