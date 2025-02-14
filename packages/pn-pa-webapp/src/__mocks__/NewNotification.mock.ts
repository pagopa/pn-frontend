import {
  PhysicalCommunicationType,
  RecipientType,
} from '@pagopa-pn/pn-commons';

import {
  NewNotification,
  NewNotificationDigitalAddressType,
  NewNotificationDocument,
  NewNotificationRecipient,
  NotificationFeePolicy,
  PaymentModel,
} from '../models/NewNotification';
import { UserGroup } from '../models/user';
import { userResponse } from './Auth.mock';
import { BffNewNotificationRequest, NotificationDigitalAddressTypeEnum, NotificationDocument, NotificationRecipientV23 } from '../generated-client/notifications';

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

const newNotificationRecipients: Array<NewNotificationRecipient> = [
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
  },
];

const newNotificationRecipientsForBff: Array<NotificationRecipientV23> = [
  {
    taxId: 'MRARSS90P08H501Q',
    denomination: 'Mario Rossi',
    recipientType: RecipientType.PF,
    digitalDomicile: {type: NotificationDigitalAddressTypeEnum.Pec,address: 'mario.rossi@pec.it'},
    physicalAddress: {address:'via del corso 49', zip: '00122', municipality: 'Roma', province: 'Roma', foreignState: 'Italia'},
  },
  {
    taxId: '12345678901',
    denomination: 'Sara Gallo srl',
    recipientType: RecipientType.PG,
    physicalAddress: {address:'via delle cicale 21', zip: '00035', municipality: 'Anzio', province: 'Roma', foreignState: 'Italia'}
  },
]

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

const newNotificationPagoPa: NewNotificationDocument = {
  id: 'mocked-pagopa-id',
  idx: 0,
  name: 'mocked-name',
  contentType: 'application/pdf',
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

const newNotificationF24Standard: NewNotificationDocument = {
  id: 'mocked-f24standard-id',
  idx: 0,
  name: 'mocked-name',
  contentType: 'application/pdf',
  file: {
    data: new File([''], 'mocked-name', { type: 'application/pdf' }),
    sha256: {
      hashBase64: 'mocked-f24standard-sha256',
      hashHex: '',
    },
  },
  ref: {
    key: '',
    versionToken: '',
  },
};

export const payments = {
  [newNotificationRecipients[0].taxId]: {
    pagoPa: { ...newNotificationPagoPa },
  },
  [newNotificationRecipients[1].taxId]: {
    pagoPa: { ...newNotificationPagoPa },
    f24: { ...newNotificationF24Standard },
  },
};

export const newNotification: NewNotification = {
  abstract: '',
  paProtocolNumber: '12345678910',
  subject: 'Multone esagerato',
  recipients: newNotificationRecipients,
  documents: newNotificationDocuments,
  physicalCommunicationType: PhysicalCommunicationType.REGISTERED_LETTER_890,
  paymentMode: PaymentModel.NOTHING,
  group: newNotificationGroups[2].id,
  taxonomyCode: '010801N',
  notificationFeePolicy: NotificationFeePolicy.FLAT_RATE,
  senderDenomination: userResponse.organization.name,
  senderTaxId: userResponse.organization.fiscal_code,
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
  payment: {},
  physicalCommunicationType: '' as PhysicalCommunicationType,
  paymentMode: '' as PaymentModel,
  group: '',
  taxonomyCode: '',
  senderTaxId:'',
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
