import { NotificationDetailRecipient } from '@pagopa-pn/pn-commons';
import { NewNotificationRecipient, NewNotificationDTO, NewNotification } from '../models/NewNotification';

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

  export function newNotificationMapper(newNotification: NewNotification): NewNotificationDTO {
    const newNotificationParsed: NewNotificationDTO = {...newNotification, recipients: []};
    /* eslint-disable functional/immutable-data */
    // format recipients
    newNotificationParsed.recipients = newNotificationRecipientsMapper(newNotification.recipients);
    /* eslint-enable functional/immutable-data */
    return newNotificationParsed;
  };
