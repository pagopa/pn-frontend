import { dataRegex, RecipientType } from '@pagopa-pn/pn-commons';

import { NewNotificationRecipient, PaymentModel } from '../../../models/NewNotification';
import { getDuplicateValuesByKeys } from '../../../utils/notification.utility';

export function denominationTotalLength(
  value: string | undefined,
  recipientType: RecipientType,
  lastName: string
): string {
  const denomination = (value || '') + (lastName ? ' ' + lastName : '');
  if (dataRegex.denomination.test(denomination)) {
    return '';
  }
  // il messaggio di "denominazione troppo lunga" è diverso a seconda che sia PF o PG
  return `too-long-denomination-error-${recipientType || 'PF'}`;
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
  return isCF16 || (recipientType === RecipientType.PG && isCF11);
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

export function identicalIUV(
  values: Array<NewNotificationRecipient> | undefined,
  paymentMode: PaymentModel | undefined
): Array<{ messageKey: string; value: NewNotificationRecipient; id: string }> {
  const errors: Array<{ messageKey: string; value: NewNotificationRecipient; id: string }> = [];
  if (values && paymentMode !== PaymentModel.NOTHING) {
    const duplicateIUVs = getDuplicateValuesByKeys(values, ['creditorTaxId', 'noticeCode']);
    if (duplicateIUVs.length > 0) {
      values.forEach((value: NewNotificationRecipient, i: number) => {
        if (
          value.creditorTaxId &&
          value.noticeCode &&
          duplicateIUVs.includes(value.creditorTaxId + value.noticeCode)
        ) {
          // eslint-disable-next-line functional/immutable-data
          errors.push({
            messageKey: 'identical-notice-codes-error',
            value,
            id: `recipients[${i}].noticeCode`
          },
          {
            messageKey: '',
            value,
            id: `recipients[${i}].creditorTaxId`
          });
        }
      });
    }
  }
  return errors;
}
