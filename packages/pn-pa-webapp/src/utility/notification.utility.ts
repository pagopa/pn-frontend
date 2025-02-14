/* eslint-disable functional/no-let */
import _ from 'lodash';

import {
  NotificationDetailDocument,
  NotificationDetailPayment,
  NotificationDetailRecipient,
  PhysicalAddress,
  RecipientType,
} from '@pagopa-pn/pn-commons';

import {
  NewNotification,
  NewNotificationDTO,
  NewNotificationDocument,
  NewNotificationLangOther,
  NewNotificationPayment,
  NewNotificationRecipient,
} from '../models/NewNotification';

const checkPhysicalAddress = (recipient: NewNotificationRecipient) => {
  if (
    recipient.address &&
    recipient.houseNumber &&
    recipient.zip &&
    recipient.municipality &&
    recipient.province &&
    recipient.foreignState
  ) {
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
  }
  return undefined;
};

const newNotificationRecipientsMapper = (
  recipients: Array<NewNotificationRecipient>
): Array<NotificationDetailRecipient> =>
  recipients.map((recipient) => {
    const digitalDomicile = recipient.digitalDomicile
      ? {
          type: recipient.type,
          address: recipient.digitalDomicile,
        }
      : undefined;
    const parsedRecipient: NotificationDetailRecipient = {
      denomination:
        recipient.recipientType === RecipientType.PG
          ? recipient.firstName
          : `${recipient.firstName} ${recipient.lastName}`,
      recipientType: recipient.recipientType,
      taxId: recipient.taxId,
      physicalAddress: checkPhysicalAddress(recipient),
    };
    if (digitalDomicile) {
      // eslint-disable-next-line functional/immutable-data
      parsedRecipient.digitalDomicile = digitalDomicile;
    }
    if (recipient.payments) {
      // eslint-disable-next-line functional/immutable-data
      parsedRecipient.payments = newNotificationPaymentDocumentsMapper(recipient.payments);
    }
    return parsedRecipient;
  });

const newNotificationDocumentMapper = (
  document: NewNotificationDocument
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

const newNotificationPaymentDocumentsMapper = (
  recipientPayments: Array<NewNotificationPayment>
): Array<NotificationDetailPayment> =>
  recipientPayments.map((payment) => {
    const mappedPayment: NotificationDetailPayment = {};

    /* eslint-disable functional/immutable-data */
    if (payment.pagoPA && payment.pagoPA.file.sha256.hashBase64 !== '') {
      mappedPayment.pagoPa = {
        creditorTaxId: '',
        noticeCode: '',
        attachment: newNotificationDocumentMapper(payment.pagoPA),
        applyCost: false,
      };
    }

    if (payment.f24 && payment.f24.file.sha256.hashBase64 !== '') {
      mappedPayment.f24 = {
        title: payment.f24.name,
        applyCost: true,
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

export function newNotificationMapper(newNotification: NewNotification): NewNotificationDTO {
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
  const newNotificationParsed: NewNotificationDTO = {
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
