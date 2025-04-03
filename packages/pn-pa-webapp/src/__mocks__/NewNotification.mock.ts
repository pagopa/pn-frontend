import { PhysicalAddressLookup, PhysicalCommunicationType, RecipientType } from '@pagopa-pn/pn-commons';

import {
  BffNewNotificationRequest,
  F24Payment,
  NotificationDigitalAddressTypeEnum,
  NotificationDocument,
  NotificationRecipientV24,
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
  PagoPaIntegrationMode,
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

export const newNotificationPagoPa = (paymentIndex: number): NewNotificationPagoPaPayment => ({
  id: 'mocked-pagopa-id',
  idx: paymentIndex,
  contentType: 'application/pdf',
  creditorTaxId: '77777777777',
  noticeCode: `30201012446360092${paymentIndex}`,
  applyCost: true,
  file: {
    data: new File([`mocked-pagopa-file-${paymentIndex}`], 'mocked-name', {
      type: 'application/pdf',
    }),
    sha256: {
      hashBase64: `mocked-pa-sha256-${paymentIndex}`,
      hashHex: `mocked-pa-sha256-hex-${paymentIndex}`,
    },
  },
  ref: {
    key: `mocked-pagopa-key-${0}`,
    versionToken: `mocked-pagopa-versionToken-${0}`,
  },
});

const newNotificationPagoPaForBff = (paymentIndex: number): PagoPaPayment => ({
  creditorTaxId: '77777777777',
  noticeCode: `30201012446360092${paymentIndex}`,
  applyCost: true,
  attachment: {
    contentType: 'application/pdf',
    digests: {
      sha256: `mocked-pa-sha256-${paymentIndex}`,
    },
    ref: {
      key: `mocked-pagopa-key-${0}`,
      versionToken: `mocked-pagopa-versionToken-${0}`,
    },
  },
});

export const newNotificationF24 = (paymentIndex: number): NewNotificationF24Payment => ({
  id: 'mocked-f24-id',
  idx: 0,
  name: 'mocked-name',
  contentType: 'application/json',
  applyCost: false,
  file: {
    data: new File([`mocked-pagopa-f24-${paymentIndex}`], 'mocked-name', {
      type: 'application/json',
    }),
    sha256: {
      hashBase64: `mocked-f24-sha256-${paymentIndex}`,
      hashHex: `mocked-f24-sha256-hex-${paymentIndex}`,
    },
  },
  ref: {
    key: `mocked-f24-key-${0}`,
    versionToken: `mocked-f24-versionToken-${0}`,
  },
});

const newNotificationF24ForBff = (paymentIndex: number): F24Payment => ({
  title: 'mocked-name',
  applyCost: false,
  metadataAttachment: {
    contentType: 'application/json',
    digests: {
      sha256: `mocked-f24-sha256-${paymentIndex}`,
    },
    ref: {
      key: `mocked-f24-key-${0}`,
      versionToken: `mocked-f24-versionToken-${0}`,
    },
  },
});

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
        pagoPa: { ...newNotificationPagoPa(0) },
      },
    ],
    debtPosition: PaymentModel.PAGO_PA,
    physicalAddressLookup: PhysicalAddressLookup.MANUAL,
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
        pagoPa: { ...newNotificationPagoPa(1) },
      },
      {
        f24: { ...newNotificationF24(1) },
      },
    ],
    debtPosition: PaymentModel.PAGO_PA_F24,
    physicalAddressLookup: PhysicalAddressLookup.NATIONAL_REGISTRY,
  },
  {
    id: 'recipient.2',
    idx: 2,
    taxId: 'LVLDAA85T50G702B',
    firstName: 'Ada',
    lastName: 'Lovelace',
    recipientType: RecipientType.PF,
    type: NewNotificationDigitalAddressType.PEC,
    digitalDomicile: 'ada@pec.it',
    address: 'Via Roma',
    addressDetails: '',
    houseNumber: '2',
    zip: '90121',
    municipality: 'Palermo',
    municipalityDetails: '',
    province: 'PA',
    foreignState: 'Italia',
    payments: [
      {
        f24: { ...newNotificationF24(2) },
      },
    ],
    debtPosition: PaymentModel.F24,
    physicalAddressLookup: PhysicalAddressLookup.MANUAL,
  },
];

const newNotificationRecipientsForBff: Array<NotificationRecipientV24> = [
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
        pagoPa: newNotificationPagoPaForBff(0),
      },
    ],
  },
  {
    taxId: '12345678901',
    denomination: 'Sara Gallo srl',
    recipientType: RecipientType.PG,
    payments: [
      {
        pagoPa: { ...newNotificationPagoPaForBff(1) },
      },
      {
        f24: { ...newNotificationF24ForBff(1) },
      },
    ],
  },
  {
    taxId: 'LVLDAA85T50G702B',
    denomination: 'Ada Lovelace',
    recipientType: RecipientType.PF,
    digitalDomicile: {
      type: NotificationDigitalAddressTypeEnum.Pec,
      address: 'ada@pec.it',
    },
    physicalAddress: {
      address: 'Via Roma 2',
      zip: '90121',
      municipality: 'Palermo',
      province: 'PA',
      foreignState: 'Italia',
    },
    payments: [
      {
        f24: { ...newNotificationF24ForBff(2) },
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
    pagoPa: { ...newNotificationPagoPa(0) },
  },
  [newNotificationRecipients[1].taxId]: {
    pagoPa: { ...newNotificationPagoPa(1) },
    f24: { ...newNotificationF24(1) },
  },
  [newNotificationRecipients[2].taxId]: {
    f24: { ...newNotificationF24(2) },
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
  pagoPaIntMode: PagoPaIntegrationMode.SYNC,
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
  senderTaxId: userResponse.organization.fiscal_code,
  notificationFeePolicy: '' as NotificationFeePolicy,
  senderDenomination: userResponse.organization.name,
};

export const newNotificationForBff: BffNewNotificationRequest = {
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
  pagoPaIntMode: PagoPaIntegrationMode.SYNC,
};
