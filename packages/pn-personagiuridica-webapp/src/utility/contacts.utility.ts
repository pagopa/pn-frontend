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

export enum DISABLED_REASON {
  NONE = 'NONE',
  NO_DEFAULT = 'NO_DEFAULT',
  ALREADY_ADDED = 'ALREADY_ADDED',
}

type AddressTypeItem = {
  id: ChannelType;
  shown: boolean;
  disabled: boolean;
  disabledReason: DISABLED_REASON;
};

type AllowedAddressTypeForSpecialContact = {
  channelType: ChannelType;
  disabledDependsOn: Array<ChannelType>;
  shownDependsOn: Array<ChannelType>;
};

const allowedAddressTypesForSpecialContacts: Array<AllowedAddressTypeForSpecialContact> = [
  {
    channelType: ChannelType.EMAIL,
    disabledDependsOn: [ChannelType.EMAIL],
    shownDependsOn: [],
  },
  {
    channelType: ChannelType.SMS,
    disabledDependsOn: [ChannelType.SMS],
    shownDependsOn: [],
  },
  {
    channelType: ChannelType.PEC,
    disabledDependsOn: [],
    shownDependsOn: [ChannelType.PEC, ChannelType.SERCQ_SEND],
  },
  {
    channelType: ChannelType.SERCQ_SEND,
    disabledDependsOn: [],
    shownDependsOn: [ChannelType.PEC],
  },
];

const isDropdownItemDisabled = (
  allowedAddress: AllowedAddressTypeForSpecialContact,
  addresses: SelectedAddresses,
  sender: Sender
): { status: boolean; reason: DISABLED_REASON } => {
  // the address is disabled if it hasn't one of the default addresses listed into disabledDependsOn property
  // or there is an address with the same sender, already added
  const senderHasAlreadyAddress =
    addresses[`special${allowedAddress.channelType}Addresses`].findIndex(
      (a) => a.senderId === sender.senderId
    ) > -1;
  if (senderHasAlreadyAddress) {
    return { status: true, reason: DISABLED_REASON.ALREADY_ADDED };
  }

  if (allowedAddress.disabledDependsOn.length === 0) {
    return { status: false, reason: DISABLED_REASON.NONE };
  }

  const disabled = { status: true, reason: DISABLED_REASON.NO_DEFAULT };

  for (const dependency of allowedAddress.disabledDependsOn) {
    // eslint-disable-next-line functional/immutable-data
    disabled.status = !addresses[`default${dependency}Address`];
    // exit from loop if at least one default address exists
    if (!disabled.status) {
      // eslint-disable-next-line functional/immutable-data
      disabled.reason = DISABLED_REASON.NONE;
      break;
    }
  }

  return disabled;
};

const isDropdownItemShown = (
  allowedAddress: AllowedAddressTypeForSpecialContact,
  addresses: SelectedAddresses
): boolean => {
  // the address is shown if it has one of the default addresses listed into shownDependsOn property
  if (allowedAddress.shownDependsOn.length === 0) {
    return true;
  }
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
  allowedAddressTypesForSpecialContacts.map((allowedAddressType) => {
    const isDisabled = isDropdownItemDisabled(allowedAddressType, addressesData, sender);

    const isShown = isDropdownItemShown(allowedAddressType, addressesData);

    return {
      id: allowedAddressType.channelType,
      shown: isShown,
      disabled: isDisabled.status,
      disabledReason: isDisabled.reason,
    };
  });
