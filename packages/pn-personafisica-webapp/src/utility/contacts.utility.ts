import { TFunction } from 'react-i18next';
import * as yup from 'yup';

import { dataRegex } from '@pagopa-pn/pn-commons';

import { PFEventsType } from '../models/PFEventsType';
import { ChannelType, DigitalAddress } from '../models/contacts';

export const internationalPhonePrefix = '+39';

export const allowedAddressTypes = [ChannelType.PEC, ChannelType.EMAIL, ChannelType.SMS];

export function countContactsByType(contacts: Array<DigitalAddress>, type: ChannelType) {
  return contacts.reduce((total, contact) => (contact.channelType === type ? total + 1 : total), 0);
}

export const getEventByContactType = (contactType: ChannelType): PFEventsType => {
  if (contactType === ChannelType.PEC) {
    return PFEventsType.SEND_REMOVE_PEC_SUCCESS;
  } else if (contactType === ChannelType.EMAIL) {
    return PFEventsType.SEND_REMOVE_EMAIL_SUCCESS;
  }
  return PFEventsType.SEND_REMOVE_SMS_SUCCESS;
};

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
