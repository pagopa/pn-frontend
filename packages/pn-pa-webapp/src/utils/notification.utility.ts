import _ from 'lodash';
import { NotificationDetailRecipient, NotificationDetailDocument } from '@pagopa-pn/pn-commons';

import {
  NewNotificationRecipient,
  NewNotificationDocument,
  NewNotificationDTO,
  NewNotification,
  PaymentObject,
} from '../models/NewNotification';

const checkFisicalAddress = (recipient: NewNotificationRecipient) => {
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
  recipients: Array<NewNotificationRecipient>
): Array<NotificationDetailRecipient> =>
  recipients.map((recipient) => {
    const digitalDomicile = recipient.digitalDomicile
      ? {
          type: recipient.type,
          address: recipient.digitalDomicile,
        }
      : undefined;
    return {
      denomination: `${recipient.firstName} ${recipient.lastName}`,
      recipientType: recipient.recipientType,
      taxId: recipient.taxId,
      payment: {
        creditorTaxId: recipient.creditorTaxId,
        noticeCode: recipient.noticeCode,
        pagoPaForm: {
          digests: {
            sha256: '',
          },
          contentType: '',
          ref: {
            key: '',
            versionToken: '',
          },
        },
      },
      digitalDomicile,
      physicalAddress: checkFisicalAddress(recipient),
    };
  });

const newNotificationDocumentMapper = (
  document: NewNotificationDocument
): NotificationDetailDocument => ({
  digests: {
    sha256: document.file.sha256.hashBase64,
  },
  contentType: document.file.contentType,
  ref: {
    key: '',
    versionToken: '',
  },
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
      pagoPaForm: NotificationDetailDocument;
      f24flatRate?: NotificationDetailDocument;
      f24standard?: NotificationDetailDocument;
    } = {
      pagoPaForm: newNotificationDocumentMapper(paymentDocuments[r.taxId].pagoPaForm),
    };
    /* eslint-disable functional/immutable-data */
    if (paymentDocuments[r.taxId].f24flatRate && paymentDocuments[r.taxId].f24flatRate.file && paymentDocuments[r.taxId].f24flatRate.file.uint8Array) {
      documents.f24flatRate = newNotificationDocumentMapper(paymentDocuments[r.taxId].f24flatRate);
    }
    if (paymentDocuments[r.taxId].f24standard && paymentDocuments[r.taxId].f24standard.file && paymentDocuments[r.taxId].f24standard.file.uint8Array) {
      documents.f24standard = newNotificationDocumentMapper(paymentDocuments[r.taxId].f24standard);
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
  newNotificationParsed.recipients = newNotificationRecipientsMapper(newNotification.recipients);
  // format attachments
  newNotificationParsed.documents = newNotificationAttachmentsMapper(newNotification.documents);
  // format payments
  if (newNotification.payment) {
    newNotificationParsed.recipients = newNotificationPaymentDocumentsMapper(
      newNotificationParsed.recipients,
      newNotification.payment
    );
  }
  /* eslint-enable functional/immutable-data */
  return newNotificationParsed;
}
