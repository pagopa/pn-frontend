import { PhysicalCommunicationType, RecipientType } from '@pagopa-pn/pn-commons';
import {
  BffNewNotificationRequest,
  F24Payment,
  NotificationDigitalAddressTypeEnum,
  NotificationDocument,
  NotificationRecipientV23,
  PagoPaPayment,
} from '../generated-client/notifications';
import {
  NewNotification,
  NewNotificationDigitalAddressType,
  NewNotificationDocument,
  NewNotificationF24Payment,
  NewNotificationPagoPaPayment,
  NewNotificationRecipient,
  NotificationFeePolicy,
  PaymentModel,
} from '../models/NewNotification';
import { UserGroup } from '../models/user';
import { userResponse } from './Auth.mock';

export const newNotificationGroups: Array<UserGroup> = [
  {
    id: 'mock-id-1',
    name: 'mock-group-1',
  },
  {
    id: 'mock-id-2',
    name: 'mock-group-2',
  },
  {
    id: 'mock-id-3',
    name: 'mock-group-3',
  },
  {
    id: 'mock-id-4',
    name: 'mock-group-4',
  },
];

const newNotificationPagoPa: NewNotificationPagoPaPayment = {
  id: 'mocked-pagopa-id',
  idx: 0,
  contentType: 'application/pdf',
  creditorTaxId: 'mocked-creditor-taxid',
  noticeCode: 'mocked-noticecode',
  applyCost: true,
  file: {
    data: new File([''], 'mocked-name', { type: 'application/pdf' }),
    sha256: {
      hashBase64: 'mocked-pa-sha256',
      hashHex: '',
    },
  },
  ref: {
    key: '',
    versionToken: '',
  },
};

const newNotificationPagoPaForBff: PagoPaPayment = {
  creditorTaxId: 'mocked-creditor-taxid',
  noticeCode: 'mocked-noticecode',
  applyCost: true,
  attachment: {
    contentType: 'application/pdf',
    digests: {
      sha256: 'mocked-pa-sha256',
    },
    ref: {
      key: '',
      versionToken: '',
    },
  },
};

const newNotificationF24: NewNotificationF24Payment = {
  id: 'mocked-f24-id',
  idx: 0,
  name: 'mocked-name',
  contentType: 'application/json',
  applyCost: false,
  file: {
    data: new File([''], 'mocked-name', { type: 'application/json' }),
    sha256: {
      hashBase64: 'mocked-f24-sha256',
      hashHex: '',
    },
  },
  ref: {
    key: '',
    versionToken: '',
  },
};

const newNotificationF24ForBff: F24Payment = {
  title: 'mocked-name',
  applyCost: false,
  metadataAttachment: {
    contentType: 'application/json',
    digests: {
      sha256: 'mocked-f24-sha256',
    },
    ref: {
      key: '',
      versionToken: '',
    },
  },
};

export const newNotificationRecipients: Array<NewNotificationRecipient> = [
  {
    id: 'recipient.0',
    idx: 0,
    taxId: 'MRARSS90P08H501Q',
    firstName: 'Mario',
    lastName: 'Rossi',
    recipientType: RecipientType.PF,
    type: NewNotificationDigitalAddressType.PEC,
    digitalDomicile: 'mario.rossi@pec.it',
    address: 'via del corso',
    addressDetails: '',
    houseNumber: '49',
    zip: '00122',
    municipality: 'Roma',
    municipalityDetails: '',
    province: 'Roma',
    foreignState: 'Italia',
    payments: [
      {
        pagoPa: { ...newNotificationPagoPa },
      },
    ],
  },
  {
    id: 'recipient.1',
    idx: 1,
    taxId: '12345678901',
    firstName: 'Sara Gallo srl',
    lastName: '',
    recipientType: RecipientType.PG,
    type: NewNotificationDigitalAddressType.PEC,
    digitalDomicile: '',
    address: 'via delle cicale',
    addressDetails: '',
    houseNumber: '21',
    zip: '00035',
    municipality: 'Anzio',
    municipalityDetails: '',
    province: 'Roma',
    foreignState: 'Italia',
    payments: [
      {
        pagoPa: { ...newNotificationPagoPa },
        f24: { ...newNotificationF24 },
      },
    ],
  },
];

const newNotificationRecipientsForBff: Array<NotificationRecipientV23> = [
  {
    taxId: 'MRARSS90P08H501Q',
    denomination: 'Mario Rossi',
    recipientType: RecipientType.PF,
    digitalDomicile: {
      type: NotificationDigitalAddressTypeEnum.Pec,
      address: 'mario.rossi@pec.it',
    },
    physicalAddress: {
      address: 'via del corso 49',
      zip: '00122',
      municipality: 'Roma',
      province: 'Roma',
      foreignState: 'Italia',
    },
    payments: [
      {
        pagoPa: newNotificationPagoPaForBff,
      },
    ],
  },
  {
    taxId: '12345678901',
    denomination: 'Sara Gallo srl',
    recipientType: RecipientType.PG,
    physicalAddress: {
      address: 'via delle cicale 21',
      zip: '00035',
      municipality: 'Anzio',
      province: 'Roma',
      foreignState: 'Italia',
    },
    payments: [
      {
        pagoPa: newNotificationPagoPaForBff,
        f24: newNotificationF24ForBff,
      },
    ],
  },
];

const newNotificationDocuments: Array<NewNotificationDocument> = [
  {
    id: 'mocked-id-0',
    idx: 0,
    name: 'mocked-name-0',
    contentType: 'application/pdf',
    file: {
      data: new File(['mocked content first file'], 'mocked-first-file.pdf', {
        type: 'application/pdf',
      }),
      sha256: {
        hashBase64: 'mocked-sha256-0',
        hashHex: 'mocked-hashHex-0',
      },
    },
    ref: {
      key: 'mocked-key-0',
      versionToken: 'mocked-versionToken-0',
    },
  },
  {
    id: 'mocked-id-1',
    idx: 1,
    name: 'mocked-name-1',
    contentType: 'application/pdf',
    file: {
      data: new File(['mocked content second file'], 'mocked-second-file.pdf', {
        type: 'application/pdf',
      }),
      sha256: {
        hashBase64: 'mocked-sha256-1',
        hashHex: 'mocked-hashHex-1',
      },
    },
    ref: {
      key: 'mocked-key-1',
      versionToken: 'mocked-versionToken-1',
    },
  },
];

const newNotificationDocumentsForBff: Array<NotificationDocument> = [
  {
    title: 'mocked-name-0',
    contentType: 'application/pdf',
    digests: {
      sha256: 'mocked-sha256-0',
    },
    ref: {
      key: 'mocked-key-0',
      versionToken: 'mocked-versionToken-0',
    },
  },
  {
    title: 'mocked-name-1',
    contentType: 'application/pdf',
    digests: {
      sha256: 'mocked-sha256-1',
    },
    ref: {
      key: 'mocked-key-1',
      versionToken: 'mocked-versionToken-1',
    },
  },
];

export const payments = {
  [newNotificationRecipients[0].taxId]: {
    pagoPa: { ...newNotificationPagoPa },
  },
  [newNotificationRecipients[1].taxId]: {
    pagoPa: { ...newNotificationPagoPa },
    f24: { ...newNotificationF24 },
  },
};

export const newNotification: NewNotification = {
  abstract: '',
  paProtocolNumber: '12345678910',
  subject: 'Multone esagerato',
  recipients: newNotificationRecipients,
  documents: newNotificationDocuments,
  physicalCommunicationType: PhysicalCommunicationType.REGISTERED_LETTER_890,
  group: newNotificationGroups[2].id,
  taxonomyCode: '010801N',
  notificationFeePolicy: NotificationFeePolicy.FLAT_RATE,
  senderDenomination: userResponse.organization.name,
  senderTaxId: userResponse.organization.fiscal_code,
  paymentMode: PaymentModel.F24,
  lang: 'it',
  additionalLang: '',
  additionalSubject: '',
  additionalAbstract: '',
};

export const newNotificationEmpty: NewNotification = {
  paProtocolNumber: '',
  subject: '',
  recipients: [],
  documents: [],
  physicalCommunicationType: PhysicalCommunicationType.REGISTERED_LETTER_890,
  group: '',
  taxonomyCode: '',
  senderTaxId: '',
  notificationFeePolicy: '' as NotificationFeePolicy,
  senderDenomination: userResponse.organization.name,
};

export const newNotificationForBff: BffNewNotificationRequest = {
  abstract: '',
  paProtocolNumber: '12345678910',
  subject: 'Multone esagerato',
  recipients: newNotificationRecipientsForBff,
  documents: newNotificationDocumentsForBff,
  physicalCommunicationType: PhysicalCommunicationType.REGISTERED_LETTER_890,
  group: newNotificationGroups[2].id,
  taxonomyCode: '010801N',
  notificationFeePolicy: NotificationFeePolicy.FLAT_RATE,
  senderDenomination: userResponse.organization.name,
  senderTaxId: userResponse.organization.fiscal_code,
};
