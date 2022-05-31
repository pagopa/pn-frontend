import { NotificationDetailRecipient } from '@pagopa-pn/pn-commons';
import { FormRecipient } from '../models/newNotification';

export const formatNotificationRecipients = (recipients: Array<FormRecipient>): Array<NotificationDetailRecipient> =>
  recipients.map((recipient) => ({
    denomination: `${recipient.firstName} ${recipient.lastName}`,
    recipientType: recipient.recipientType,
    taxId: recipient.taxId,
    creditorTaxId: recipient.creditorTaxId,
    token: recipient.noticeCode,
    digitalDomicile: {
      type: recipient.type,
      address: recipient.digitalDomicile,
    },
    physicalAddress: {
      at: recipient.at,
      address: `${recipient.address} ${recipient.houseNumber}`,
      addressDetails: recipient.addressDetails,
      zip: recipient.zip,
      municipality: recipient.municipality,
      municipalityDetails: recipient.municipalityDetails,
      province: recipient.province,
      foreignState: recipient.foreignState,
    },
  }));
