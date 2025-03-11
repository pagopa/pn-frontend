import { TFunction } from 'react-i18next';
import * as yup from 'yup';

import { RecipientType, dataRegex } from '@pagopa-pn/pn-commons';

import {
  NewNotificationF24Payment,
  NewNotificationPagoPaPayment,
  NewNotificationRecipient,
  RecipientPaymentsFormValues,
} from '../models/NewNotification';
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

export const pagoPaValidationSchema = (t: TFunction, tc: TFunction) =>
  yup.object().shape({
    noticeCode: yup
      .string()
      .required(tc('required-field'))
      .matches(dataRegex.noticeCode, `${t('payment-methods.pagopa.notice-code')} ${tc('invalid')}`),
    creditorTaxId: yup
      .string()
      .required(tc('required-field'))
      .matches(dataRegex.pIva, `${t('payment-methods.pagopa.creditor-taxid')} ${tc('invalid')}`),
    applyCost: yup.boolean(),
    file: yup
      .object({
        data: yup
          .mixed()
          .test('fileType', '', (input) => input === undefined || input instanceof File)
          .optional(),
        sha256: yup.object({
          hashBase64: yup.string(),
          hashHex: yup.string(),
        }),
      })
      .optional(),
  });

export const f24ValidationSchema = (tc: TFunction) =>
  yup.object().shape({
    name: requiredStringFieldValidation(tc, 512),
    applyCost: yup.boolean(),
    file: yup
      .object()
      .shape({
        data: yup
          .mixed()
          .test((input) => input instanceof File)
          .required(tc('required-field')),
        sha256: yup
          .object({
            hashBase64: yup.string().required(tc('required-field')),
            hashHex: yup.string().required(tc('required-field')),
          })
          .required(),
      })
      .required(),
  });

export function identicalIUV(
  values: RecipientPaymentsFormValues | undefined
): Array<{ messageKey: string; value: NewNotificationPagoPaPayment; id: string }> {
  const errors: Array<{ messageKey: string; value: NewNotificationPagoPaPayment; id: string }> = [];

  if (!values) {
    return errors;
  }

  const allPagoPaPayments: Array<NewNotificationPagoPaPayment & { taxIdKey: string }> = [];

  Object.entries(values).forEach(([taxIdKey, payments]) => {
    payments.pagoPa.forEach((payment) => {
      // eslint-disable-next-line functional/immutable-data
      allPagoPaPayments.push({ ...payment, taxIdKey });
    });
  });

  const duplicateIUVs = getDuplicateValuesByKeys<NewNotificationPagoPaPayment>(allPagoPaPayments, [
    'creditorTaxId',
    'noticeCode',
  ]);

  if (duplicateIUVs.length > 0) {
    allPagoPaPayments.forEach((payment) => {
      if (
        payment.creditorTaxId &&
        payment.noticeCode &&
        duplicateIUVs.includes(payment.creditorTaxId + payment.noticeCode)
      ) {
        // eslint-disable-next-line functional/immutable-data
        errors.push(
          {
            messageKey: 'identical-notice-codes-error',
            value: payment,
            id: `recipients.${payment.taxIdKey}.pagoPa[${payment.idx}].noticeCode`,
          },
          {
            messageKey: '',
            value: payment,
            id: `recipients.${payment.taxIdKey}.pagoPa[${payment.idx}].creditorTaxId`,
          }
        );
      }
    });
  }

  return errors;
}

const checkPaymentsApplyCost = (
  recipientId: string,
  payments: Array<NewNotificationPagoPaPayment> | Array<NewNotificationF24Payment>,
  paymentType: 'pagoPa' | 'f24',
  errors: Array<{
    messageKey: string;
    value: Array<NewNotificationPagoPaPayment> | Array<NewNotificationF24Payment>;
    id: string;
  }>
) => {
  if (!payments || payments.length === 0) {
    return;
  }

  const hasApplyCost = payments.some((item) => item.applyCost);

  if (!hasApplyCost) {
    payments.forEach((payment, idx) => {
      if (!payment.applyCost) {
        // eslint-disable-next-line functional/immutable-data
        errors.push({
          messageKey: 'at-least-one-applycost',
          value: payments,
          id: `recipients[${recipientId}].${paymentType}[${idx}].applyCost`,
        });
      }
    });
  }
};

export const checkApplyCost = (
  values: RecipientPaymentsFormValues | undefined
): Array<{
  messageKey: string;
  value: Array<NewNotificationPagoPaPayment> | Array<NewNotificationF24Payment>;
  id: string;
}> => {
  const errors: Array<{
    messageKey: string;
    value: Array<NewNotificationPagoPaPayment> | Array<NewNotificationF24Payment>;
    id: string;
  }> = [];

  if (!values) {
    return errors;
  }

  Object.entries(values).forEach(([recipientId, recipient]) => {
    checkPaymentsApplyCost(recipientId, recipient.pagoPa, 'pagoPa', errors);
    checkPaymentsApplyCost(recipientId, recipient.f24, 'f24', errors);
  });

  return errors;
};

export function identicalSHA(values: RecipientPaymentsFormValues | undefined): Array<{
  messageKey: string;
  value: NewNotificationPagoPaPayment | NewNotificationF24Payment;
  id: string;
}> {
  const errors: Array<{
    messageKey: string;
    value: NewNotificationPagoPaPayment | NewNotificationF24Payment;
    id: string;
  }> = [];

  if (!values) {
    return errors;
  }

  type RecipientPayments = (NewNotificationPagoPaPayment | NewNotificationF24Payment) & {
    taxIdKey: string;
    paymentType: 'pagoPa' | 'f24';
    sha256Hash: string;
  };

  const allPayments: Array<RecipientPayments> = [];

  Object.entries(values).forEach(([taxIdKey, payments]) => {
    payments.pagoPa.forEach((payment) => {
      if (payment.file?.sha256?.hashBase64) {
        // eslint-disable-next-line functional/immutable-data
        allPayments.push({
          ...payment,
          taxIdKey,
          paymentType: 'pagoPa',
          sha256Hash: payment.file.sha256.hashBase64,
        });
      }
    });

    payments.f24.forEach((payment) => {
      if (payment.file?.sha256?.hashBase64) {
        // eslint-disable-next-line functional/immutable-data
        allPayments.push({
          ...payment,
          taxIdKey,
          paymentType: 'f24',
          sha256Hash: payment.file.sha256.hashBase64,
        });
      }
    });
  });

  const duplicateSHA = getDuplicateValuesByKeys<RecipientPayments>(allPayments, ['sha256Hash']);

  if (duplicateSHA.length > 0) {
    allPayments.forEach((payment) => {
      if (payment.sha256Hash && duplicateSHA.includes(payment.sha256Hash)) {
        // eslint-disable-next-line functional/immutable-data
        errors.push({
          messageKey: 'identical-sha256-error',
          value: payment,
          id: `recipients[${payment.taxIdKey}].${payment.paymentType}[${payment.idx}].file.sha256.hashBase64`,
        });
      }
    });
  }

  return errors;
}
