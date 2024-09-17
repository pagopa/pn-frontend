import { TFunction } from 'react-i18next';
import * as yup from 'yup';

import { dataRegex } from '@pagopa-pn/pn-commons';

import { ChannelType, DigitalAddress, Sender } from '../models/contacts';
import { SelectedAddresses } from '../redux/contact/reducers';

type AddressTypeItem = {
  id: ChannelType;
  value: string;
  shown: boolean;
  disabled: boolean;
  showMessage: boolean;
};

export const internationalPhonePrefix = '+39';

export const allowedAddressTypes = [
  ChannelType.EMAIL,
  ChannelType.SMS,
  ChannelType.PEC,
  ChannelType.SERCQ,
];

export function countContactsByType(contacts: Array<DigitalAddress>, type: ChannelType) {
  return contacts.reduce((total, contact) => (contact.channelType === type ? total + 1 : total), 0);
}

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
  channelType: ChannelType,
  hasDefaultAddress: boolean,
  defaultSERCQAddress: DigitalAddress | undefined,
  senderHasAlreadyAddress: boolean
): boolean => {
  if (defaultSERCQAddress && channelType === ChannelType.PEC) {
    return false;
  }

  return (channelType !== ChannelType.SERCQ && !hasDefaultAddress) || !senderHasAlreadyAddress;
};

const isDropdownItemShown = (
  channelType: ChannelType,
  defaultSERCQAddress: DigitalAddress | undefined,
  defaultPECAddress: DigitalAddress | undefined
): boolean => {
  if (defaultSERCQAddress && channelType === ChannelType.SERCQ) {
    return false;
  }

  if (
    !defaultPECAddress &&
    !defaultSERCQAddress &&
    (channelType === ChannelType.PEC || channelType === ChannelType.SERCQ)
  ) {
    return false;
  }

  return true;
};

export const specialContactsAddressTypes = (
  t: TFunction,
  addressesData: SelectedAddresses,
  sender: Sender
): Array<AddressTypeItem> => {
  const { defaultPECAddress, defaultSERCQAddress, specialAddresses } = addressesData;

  return allowedAddressTypes.map((addressType) => {
    const senderHasAlreadyAddress =
      specialAddresses.findIndex(
        (a) => a.senderId === sender.senderId && a.channelType === addressType
      ) === -1;

    const isDisabled = isDropdownItemDisabled(
      addressType,
      !!addressesData[`default${addressType}Address`],
      defaultSERCQAddress,
      senderHasAlreadyAddress
    );

    const isShown = isDropdownItemShown(addressType, defaultSERCQAddress, defaultPECAddress);

    return {
      id: addressType,
      value: t(`special-contacts.${addressType.toLowerCase()}`, { ns: 'recapiti' }),
      shown: isShown,
      disabled: isDisabled,
      showMessage: senderHasAlreadyAddress && isDisabled,
    };
  });
};
