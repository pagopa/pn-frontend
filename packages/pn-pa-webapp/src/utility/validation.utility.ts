import * as yup from 'yup';

import { RecipientType, dataRegex } from '@pagopa-pn/pn-commons';

import { NewNotificationRecipient } from '../models/NewNotification';
import { getDuplicateValuesByKeys } from './notification.utility';

export function requiredStringFieldValidation(
  tc: any,
  maxLength?: number,
  minLength?: number
): any {
  // eslint-disable-next-line functional/no-let
  let newValidation = yup
    .string()
    .required(tc('required-field'))
    .matches(dataRegex.noSpaceAtEdges, tc('no-spaces-at-edges'));
  if (maxLength) {
    newValidation = newValidation.max(maxLength, tc('too-long-field-error', { maxLength }));
  }
  if (minLength) {
    newValidation = newValidation.min(minLength, tc('too-short-field-error', { minLength }));
  }
  return newValidation;
}

export function denominationLengthAndCharacters(
  firstName: string | undefined,
  lastName: string
): { messageKey: string; data?: { [key: string]: number | string } } | undefined {
  const denomination = (firstName || '') + (lastName ? ' ' + lastName : '');
  if (dataRegex.denomination.test(denomination)) {
    return undefined;
  }
  if (denomination.length > 80) {
    return { messageKey: 'too-long-field-error', data: { maxLength: 80 } };
  }
  return { messageKey: `forbidden-characters-denomination-error` };
}

export function taxIdDependingOnRecipientType(
  value: string | undefined,
  recipientType: RecipientType
): boolean {
  if (!value) {
    return true;
  }
  const isCF16 = dataRegex.fiscalCode.test(value);
  const isCF11 = dataRegex.pIva.test(value);
  return (
    (recipientType === RecipientType.PF && isCF16) || (recipientType === RecipientType.PG && isCF11)
  );
}

export function identicalTaxIds(
  values: Array<NewNotificationRecipient> | undefined
): Array<{ messageKey: string; value: NewNotificationRecipient; id: string }> {
  const errors: Array<{ messageKey: string; value: NewNotificationRecipient; id: string }> = [];
  if (values) {
    const duplicatesTaxIds = getDuplicateValuesByKeys(values, ['taxId']);
    if (duplicatesTaxIds.length > 0) {
      values.forEach((value, i) => {
        if (value.taxId && duplicatesTaxIds.includes(value.taxId)) {
          // eslint-disable-next-line functional/immutable-data
          errors.push({
            messageKey: 'identical-fiscal-codes-error',
            value,
            id: `recipients[${i}].taxId`,
          });
        }
      });
    }
  }
  return errors;
}