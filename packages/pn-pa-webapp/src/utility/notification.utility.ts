/* eslint-disable functional/no-let */
import _ from 'lodash';

import {
  NotificationDetailDocument,
  NotificationDetailPayment,
  PhysicalAddress,
  RecipientType,
} from '@pagopa-pn/pn-commons';

import {
  BffNewNotificationRequest,
  NotificationRecipientV23,
} from '../generated-client/notifications';
import {
  NewNotification,
  NewNotificationDocument,
  NewNotificationF24Payment,
  NewNotificationLangOther,
  NewNotificationPagoPaPayment,
  NewNotificationPayment,
  NewNotificationRecipient,
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
): Array<NotificationRecipientV23> =>
  recipients.map((recipient) => {
    const parsedRecipient: NotificationRecipientV23 = {
      denomination:
        recipient.recipientType === RecipientType.PG
          ? recipient.firstName
          : `${recipient.firstName} ${recipient.lastName}`,
      recipientType: recipient.recipientType,
      taxId: recipient.taxId,
      physicalAddress: checkPhysicalAddress(recipient),
    };
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

const newNotificationDocumentMapper = (
  document:
    | NewNotificationDocument
    | Required<NewNotificationPagoPaPayment>
    | NewNotificationF24Payment
): NotificationDetailDocument => ({
  digests: {
    sha256: document.file.sha256.hashBase64,
  },
  contentType: document.contentType,
  ref: document.ref,
  title: document.name,
});

const newNotificationAttachmentsMapper = (
  documents: Array<NewNotificationDocument>
): Array<NotificationDetailDocument> =>
  documents.map((document) => newNotificationDocumentMapper(document));

export const hasPagoPaDocument = (
  document: NewNotificationPagoPaPayment
): document is Required<NewNotificationPagoPaPayment> => !!document.file && !!document.ref;

const newNotificationPaymentDocumentsMapper = (
  recipientPayments: Array<NewNotificationPayment>
): Array<NotificationDetailPayment> =>
  recipientPayments.map((payment) => {
    const mappedPayment: NotificationDetailPayment = {};

    /* eslint-disable functional/immutable-data */
    if (payment.pagoPA && payment.pagoPA.file?.sha256.hashBase64 !== '') {
      mappedPayment.pagoPa = {
        creditorTaxId: payment.pagoPA.creditorTaxId,
        noticeCode: payment.pagoPA.noticeCode,
        attachment: hasPagoPaDocument(payment.pagoPA)
          ? newNotificationDocumentMapper(payment.pagoPA)
          : undefined,
        applyCost: payment.pagoPA.applyCost,
      };
    }

    if (payment.f24 && payment.f24.file.sha256.hashBase64 !== '') {
      mappedPayment.f24 = {
        title: payment.f24.name,
        applyCost: payment.f24.applyCost,
        metadataAttachment: {
          digests: {
            sha256: payment.f24.file.sha256.hashBase64,
          },
          contentType: payment.f24.contentType,
          ref: payment.f24.ref,
        },
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
    recipients: [],
    documents: [],
  };

  if (additionalLanguages) {
    newNotificationParsed.additionalLanguages = additionalLanguages;
  }

  // format recipients
  newNotificationParsed.recipients = newNotificationRecipientsMapper(newNotification.recipients);
  // format attachments
  newNotificationParsed.documents = newNotificationAttachmentsMapper(newNotification.documents);
  /* eslint-enable functional/immutable-data */
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
