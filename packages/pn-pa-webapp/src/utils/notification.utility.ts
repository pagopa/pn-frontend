import { NotificationDetailRecipient } from '@pagopa-pn/pn-commons';

import { FormRecipient } from '../models/NewNotification_';

const checkFisicalAddress = (recipient: FormRecipient) => {
  if (
    recipient.at &&
    recipient.address &&
    recipient.houseNumber &&
    recipient.addressDetails &&
    recipient.zip &&
    recipient.municipality &&
    recipient.municipalityDetails &&
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

export const formatNotificationRecipients = (
  recipients: Array<FormRecipient>
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
            sha256: ''
          },
          contentType: '',
          ref: {
            key: '',
            versionToken: ''
          }
        }
      },
      digitalDomicile,
      physicalAddress: checkFisicalAddress(recipient),
    };
  });
