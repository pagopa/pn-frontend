/* eslint-disable functional/no-let */

import _ from 'lodash';
import { NotificationDetailRecipient, NotificationDetailDocument, RecipientType } from '@pagopa-pn/pn-commons';

import {
  NewNotificationRecipient,
  NewNotificationDocument,
  NewNotificationDTO,
  NewNotification,
  PaymentObject,
  PaymentModel
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
    return {
      at: recipient.at,
      address: `${recipient.address} ${recipient.houseNumber}`,
      addressDetails: recipient.addressDetails,
      zip: recipient.zip,
      municipality: recipient.municipality,
      municipalityDetails: recipient.municipalityDetails,
      province: recipient.province,
      foreignState: recipient.foreignState,
    };
  }
  return undefined;
};

const newNotificationRecipientsMapper = (
  recipients: Array<NewNotificationRecipient>,
  paymentMethod?: PaymentModel
): Array<NotificationDetailRecipient> =>
  recipients.map((recipient) => {
    const digitalDomicile = recipient.digitalDomicile
      ? {
          type: recipient.type,
          address: recipient.digitalDomicile,
        }
      : undefined;
    return {
      denomination: recipient.recipientType === RecipientType.PG ? recipient.firstName : `${recipient.firstName} ${recipient.lastName}`,
      recipientType: recipient.recipientType,
      taxId: recipient.taxId,
      payment: paymentMethod === PaymentModel.NOTHING ? undefined : {
        creditorTaxId: recipient.creditorTaxId,
        noticeCode: recipient.noticeCode,
      },
      digitalDomicile,
      physicalAddress: checkPhysicalAddress(recipient),
    };
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
  recipients: Array<NotificationDetailRecipient>,
  paymentDocuments: { [key: string]: PaymentObject }
): Array<NotificationDetailRecipient> =>
  recipients.map((r) => {
    const documents: {
      pagoPaForm?: NotificationDetailDocument;
      f24flatRate?: NotificationDetailDocument;
      f24standard?: NotificationDetailDocument;
    } = {};
    /* eslint-disable functional/immutable-data */
    if (paymentDocuments[r.taxId].pagoPaForm && paymentDocuments[r.taxId].pagoPaForm.file.sha256.hashBase64 !== '') {
      documents.pagoPaForm = newNotificationDocumentMapper(paymentDocuments[r.taxId].pagoPaForm as NewNotificationDocument);
    }
    if (paymentDocuments[r.taxId].f24flatRate && paymentDocuments[r.taxId].f24flatRate?.file.sha256.hashBase64 !== '') {
      documents.f24flatRate = newNotificationDocumentMapper(paymentDocuments[r.taxId].f24flatRate as NewNotificationDocument);
    }
    if (paymentDocuments[r.taxId].f24standard && paymentDocuments[r.taxId].f24standard?.file.sha256.hashBase64 !== '') {
      documents.f24standard = newNotificationDocumentMapper(paymentDocuments[r.taxId].f24standard as NewNotificationDocument);
    }
    r.payment = {
      ...documents,
      creditorTaxId: r.payment ? r.payment.creditorTaxId : '',
      noticeCode: r.payment?.noticeCode,
    };
    /* eslint-enable functional/immutable-data */
    return r;
  });

export function newNotificationMapper(newNotification: NewNotification): NewNotificationDTO {
  const clonedNotification = _.cloneDeep(newNotification);
  /* eslint-disable functional/immutable-data */
  // remove useless data
  delete clonedNotification.paymentMode;
  delete clonedNotification.payment;
  const newNotificationParsed: NewNotificationDTO = {
    ...clonedNotification,
    recipients: [],
    documents: [],
  };
  // format recipients
  newNotificationParsed.recipients = newNotificationRecipientsMapper(newNotification.recipients, newNotification.paymentMode);
  // format attachments
  newNotificationParsed.documents = newNotificationAttachmentsMapper(newNotification.documents);
  // format payments
  if (newNotification.payment && Object.keys(newNotification.payment).length > 0) {
    newNotificationParsed.recipients = newNotificationPaymentDocumentsMapper(
      newNotificationParsed.recipients,
      newNotification.payment
    );
  }
  /* eslint-enable functional/immutable-data */
  return newNotificationParsed;
}

export function getDuplicateValuesByKeys<T>(objectsList: Array<T>, keys: Array<keyof T>): Array<string> {
  const getValue = (item: T) => {
    let valueByKeys = '';
    for (let i = 0; i < keys.length; i++) {
      valueByKeys += item[keys[i]] ?? '';
    }
    return valueByKeys;
  };

  return objectsList
    .map((recipient) => getValue(recipient))
    .filter((value, i, valueList) => valueList.indexOf(value) !== i)
    .filter((value, i, valueList) => valueList.indexOf(value) === i);
}