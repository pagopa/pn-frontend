import { TFunction } from 'react-i18next';
import * as yup from 'yup';

import { dataRegex } from '@pagopa-pn/pn-commons';

import { ChannelType, DigitalAddress, Sender } from '../models/contacts';
import { SelectedAddresses } from '../redux/contact/reducers';

export const internationalPhonePrefix = '+39';

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

type AddressTypeItem = {
  id: ChannelType;
  shown: boolean;
  disabled: boolean;
};

type AddressRelation = {
  channelType: ChannelType;
  relationWith: Array<ChannelType>;
  shownDependsOn: Array<ChannelType>;
};

export const addressesRelationships: Array<AddressRelation> = [
  {
    channelType: ChannelType.EMAIL,
    relationWith: [ChannelType.EMAIL],
    shownDependsOn: [],
  },
  {
    channelType: ChannelType.SMS,
    relationWith: [ChannelType.SMS],
    shownDependsOn: [],
  },
  {
    channelType: ChannelType.PEC,
    relationWith: [ChannelType.PEC, ChannelType.SERCQ_SEND],
    shownDependsOn: [ChannelType.PEC, ChannelType.SERCQ_SEND],
  },
  {
    channelType: ChannelType.SERCQ_SEND,
    relationWith: [ChannelType.SERCQ_SEND, ChannelType.PEC],
    shownDependsOn: [ChannelType.PEC],
  },
];

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
