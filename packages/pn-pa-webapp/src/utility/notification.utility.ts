/* eslint-disable functional/no-let */
import * as _ from 'lodash-es';

import {
  NotificationDetailDocument,
  PhysicalAddress,
  PhysicalAddressLookup,
  RecipientType,
} from '@pagopa-pn/pn-commons';

import {
  BffNewNotificationRequest,
  NotificationDocument,
  NotificationPaymentItem,
  NotificationRecipientV24,
} from '../generated-client/notifications';
import {
  NewNotification,
  NewNotificationDocument,
  NewNotificationDocumentFile,
  NewNotificationDocumentRef,
  NewNotificationF24Payment,
  NewNotificationLangOther,
  NewNotificationPagoPaPayment,
  NewNotificationPayment,
  NewNotificationRecipient,
  NotificationFeePolicy,
  PaymentModel,
} from '../models/NewNotification';

const checkPhysicalAddress = (recipient: NewNotificationRecipient) => {
  const address = {
    address: `${recipient.address} ${recipient.houseNumber}`,
    addressDetails: recipient.addressDetails,
    zip: recipient.zip,
    municipality: recipient.municipality,
    municipalityDetails: recipient.municipalityDetails,
    province: recipient.province,
    foreignState: recipient.foreignState,
  };

  // clean the object from undefined keys
  (Object.keys(address) as Array<Exclude<keyof PhysicalAddress, 'at'>>).forEach((key) => {
    if (!address[key]) {
      // eslint-disable-next-line functional/immutable-data
      delete address[key];
    }
  });
  return address;
};

const newNotificationRecipientsMapper = (
  recipients: Array<NewNotificationRecipient>
): Array<NotificationRecipientV24> =>
  recipients.map((recipient) => {
    const parsedRecipient: NotificationRecipientV24 = {
      denomination:
        recipient.recipientType === RecipientType.PG
          ? recipient.firstName
          : `${recipient.firstName} ${recipient.lastName}`,
      recipientType: recipient.recipientType,
      taxId: recipient.taxId,
    };
    if (recipient.physicalAddressLookup === PhysicalAddressLookup.MANUAL) {
      // eslint-disable-next-line functional/immutable-data
      parsedRecipient.physicalAddress = checkPhysicalAddress(recipient);
    }
    if (recipient.digitalDomicile) {
      // eslint-disable-next-line functional/immutable-data
      parsedRecipient.digitalDomicile = {
        type: recipient.type,
        address: recipient.digitalDomicile,
      };
    }
    if (recipient.payments) {
      // eslint-disable-next-line functional/immutable-data
      parsedRecipient.payments = newNotificationPaymentDocumentsMapper(recipient.payments);
    }
    return parsedRecipient;
  });

const newNotificationDocumentMapper = (document: {
  file: NewNotificationDocumentFile;
  ref: NewNotificationDocumentRef;
  contentType: string;
}): NotificationDetailDocument => ({
  digests: {
    sha256: document.file.sha256.hashBase64,
  },
  contentType: document.contentType,
  ref: document.ref,
});

const newNotificationAttachmentsMapper = (
  documents: Array<NewNotificationDocument>
): Array<NotificationDocument> =>
  documents.map((document) => ({
    ...newNotificationDocumentMapper({
      file: document.file,
      ref: document.ref,
      contentType: document.contentType,
    }),
    title: document.name,
  }));

export const hasPagoPaDocument = (
  document: NewNotificationPagoPaPayment
): document is Required<NewNotificationPagoPaPayment> => !!document.file.data && !!document.ref;

const newNotificationPaymentDocumentsMapper = (
  recipientPayments: Array<NewNotificationPayment>
): Array<NotificationPaymentItem> =>
  recipientPayments.map((payment) => {
    const mappedPayment: NotificationPaymentItem = {};

    /* eslint-disable functional/immutable-data */
    if (payment.pagoPa) {
      mappedPayment.pagoPa = {
        creditorTaxId: payment.pagoPa.creditorTaxId,
        noticeCode: payment.pagoPa.noticeCode,
        applyCost: payment.pagoPa.applyCost,
      };

      if (
        payment.pagoPa.file &&
        payment.pagoPa.ref &&
        payment.pagoPa.file?.sha256.hashBase64 !== ''
      ) {
        mappedPayment.pagoPa.attachment = newNotificationDocumentMapper({
          file: payment.pagoPa.file,
          ref: payment.pagoPa.ref,
          contentType: payment.pagoPa.contentType,
        });
      }
    }

    if (payment.f24 && payment.f24.file.sha256.hashBase64 !== '') {
      mappedPayment.f24 = {
        title: payment.f24.name,
        applyCost: payment.f24.applyCost,
        metadataAttachment: newNotificationDocumentMapper({
          file: payment.f24.file,
          ref: payment.f24.ref,
          contentType: payment.f24.contentType,
        }),
      };
    }
    /* eslint-enable functional/immutable-data */

    return mappedPayment;
  });

export function newNotificationMapper(newNotification: NewNotification): BffNewNotificationRequest {
  const clonedNotification = _.omit(_.cloneDeep(newNotification), [
    'additionalAbstract',
    'additionalLang',
    'additionalSubject',
    'lang',
  ]);

  /* eslint-disable functional/immutable-data */
  // bilingualism
  if (newNotification.lang === NewNotificationLangOther) {
    clonedNotification.subject = concatAdditionalContent(
      newNotification.subject,
      newNotification.additionalSubject
    );
    clonedNotification.abstract = concatAdditionalContent(
      newNotification.abstract,
      newNotification.additionalAbstract
    );
  }

  const additionalLanguages =
    newNotification.lang === NewNotificationLangOther && newNotification.additionalLang
      ? [newNotification.additionalLang.toUpperCase()]
      : undefined;

  /* eslint-disable functional/immutable-data */
  const newNotificationParsed: BffNewNotificationRequest = {
    ...clonedNotification,
    paFee: clonedNotification.paFee
      ? parseFloat(clonedNotification.paFee.replace(',', '.')) * 100
      : undefined,
    recipients: [],
    documents: [],
  };

  if (additionalLanguages) {
    newNotificationParsed.additionalLanguages = additionalLanguages;
  }

  if (!newNotification.notificationFeePolicy) {
    newNotificationParsed.notificationFeePolicy = NotificationFeePolicy.FLAT_RATE;
  }

  // format recipients
  newNotificationParsed.recipients = newNotificationRecipientsMapper(newNotification.recipients);
  // format attachments
  newNotificationParsed.documents = newNotificationAttachmentsMapper(newNotification.documents);
  /* eslint-enable functional/immutable-data */

  (Object.keys(newNotificationParsed) as Array<keyof BffNewNotificationRequest>).forEach((key) => {
    if (!newNotificationParsed[key]) {
      // eslint-disable-next-line functional/immutable-data
      delete newNotificationParsed[key];
    }
  });

  return newNotificationParsed;
}

// This model is needed to force the call of the getDuplicateValuesByKeys with ONLY keys that are of type string
type ExtractStringPropertyNames<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

export function getDuplicateValuesByKeys<T>(
  objectsList: Array<T>,
  keys: Array<ExtractStringPropertyNames<T>>
): Array<string> {
  const getValue = (item: T) => {
    let valueByKeys = '';
    for (const key of keys) {
      valueByKeys += (item[key] as string) ?? '';
    }
    return valueByKeys;
  };

  return objectsList
    .map((recipient) => getValue(recipient))
    .filter((value, i, valueList) => valueList.indexOf(value) !== i)
    .filter((value, i, valueList) => valueList.indexOf(value) === i);
}

const concatAdditionalContent = (content?: string, additionalContent?: string): string => {
  if (content && additionalContent) {
    return `${content}|${additionalContent}`;
  }
  return content || additionalContent || '';
};

const shouldClearPayments = (newMethod: PaymentModel, previousMethod?: PaymentModel): boolean => {
  if (!previousMethod || previousMethod === PaymentModel.NOTHING) {
    return false;
  }

  if (newMethod === PaymentModel.NOTHING) {
    return true;
  }

  const transitionMap: Record<PaymentModel, Record<PaymentModel, boolean>> = {
    PAGO_PA: {
      PAGO_PA: false,
      F24: true,
      PAGO_PA_F24: false,
      NOTHING: true,
    },
    F24: {
      PAGO_PA: true,
      F24: false,
      PAGO_PA_F24: false,
      NOTHING: true,
    },
    PAGO_PA_F24: {
      PAGO_PA: true, // Remove f24 payments
      F24: true, // Remove pagopa payments
      PAGO_PA_F24: false,
      NOTHING: true,
    },
    NOTHING: {
      PAGO_PA: false,
      F24: false,
      PAGO_PA_F24: false,
      NOTHING: false,
    },
  };

  return transitionMap[previousMethod]?.[newMethod] ?? false;
};

export const filterPaymentsByDebtPositionChange = (
  payments: Array<NewNotificationPayment>,
  newDebtPosition: PaymentModel,
  previousDebtPosition?: PaymentModel
): Array<NewNotificationPayment> => {
  if (!shouldClearPayments(newDebtPosition, previousDebtPosition)) {
    return payments;
  }

  if (newDebtPosition === PaymentModel.NOTHING) {
    return [];
  }

  if (previousDebtPosition === PaymentModel.PAGO_PA_F24) {
    if (newDebtPosition === PaymentModel.PAGO_PA) {
      return payments.reduce((acc, item) => {
        // eslint-disable-next-line functional/immutable-data
        acc.push({ pagoPa: item.pagoPa });
        return acc;
      }, [] as Array<NewNotificationPayment>);
    }
    if (newDebtPosition === PaymentModel.F24) {
      return payments.reduce((acc, item) => {
        // eslint-disable-next-line functional/immutable-data
        acc.push({ f24: item.f24 });
        return acc;
      }, [] as Array<NewNotificationPayment>);
    }
  }

  return [];
};

const emptyFileData = {
  data: undefined,
  sha256: { hashBase64: '', hashHex: '' },
};

export const newPagopaPayment = (
  taxId: string,
  idx: number,
  creditorTaxId: string
): NewNotificationPagoPaPayment => ({
  id: `${taxId}-${idx}-pagoPa`,
  idx,
  contentType: 'application/pdf',
  file: emptyFileData,
  creditorTaxId,
  noticeCode: '',
  applyCost: false,
  ref: {
    key: '',
    versionToken: '',
  },
});

export const newF24Payment = (taxId: string, idx: number): NewNotificationF24Payment => ({
  id: `${taxId}-${idx}-f24`,
  idx,
  contentType: 'application/json',
  file: emptyFileData,
  name: '',
  applyCost: false,
  ref: {
    key: '',
    versionToken: '',
  },
});
