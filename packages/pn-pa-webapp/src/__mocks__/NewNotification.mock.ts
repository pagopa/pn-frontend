import {
  DigitalDomicileType,
  NotificationFeePolicy,
  PhysicalCommunicationType,
  RecipientType,
} from '@pagopa-pn/pn-commons';

import {
  NewNotification,
  NewNotificationDTO,
  NewNotificationDocument,
  NewNotificationRecipient,
  PaymentModel,
} from '../models/NewNotification';
import { GroupStatus, UserGroup } from '../models/user';
import { newNotificationMapper } from '../utils/notification.utility';
import { userResponse } from './Auth.mock';

export const newNotificationGroups: Array<UserGroup> = [
  {
    id: 'mock-id-1',
    name: 'mock-group-1',
    description: 'mock-description-1',
    status: GroupStatus.ACTIVE,
  },
  {
    id: 'mock-id-2',
    name: 'mock-group-2',
    description: 'mock-description-2',
    status: GroupStatus.ACTIVE,
  },
  {
    id: 'mock-id-3',
    name: 'mock-group-3',
    description: 'mock-description-3',
    status: GroupStatus.ACTIVE,
  },
  {
    id: 'mock-id-4',
    name: 'mock-group-4',
    description: 'mock-description-4',
    status: GroupStatus.ACTIVE,
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
    creditorTaxId: '12345678910',
    noticeCode: '123456789123456788',
    type: DigitalDomicileType.PEC,
    digitalDomicile: 'mario.rossi@pec.it',
    address: 'via del corso',
    addressDetails: '',
    at: '',
    houseNumber: '49',
    zip: '00122',
    municipality: 'Roma',
    municipalityDetails: '',
    province: 'Roma',
    foreignState: 'Italia',
    showPhysicalAddress: true,
    showDigitalDomicile: true,
  },
  {
    id: 'recipient.1',
    idx: 1,
    taxId: 'SRAGLL00P48H501U',
    firstName: 'Sara Gallo srl',
    lastName: '',
    recipientType: RecipientType.PG,
    creditorTaxId: '12345678910',
    noticeCode: '123456789123456789',
    type: DigitalDomicileType.PEC,
    digitalDomicile: '',
    address: 'via delle cicale',
    addressDetails: '',
    at: '',
    houseNumber: '21',
    zip: '00035',
    municipality: 'Anzio',
    municipalityDetails: '',
    province: 'Roma',
    foreignState: 'Italia',
    showDigitalDomicile: false,
    showPhysicalAddress: true,
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

export const newNotification: NewNotification = {
  abstract: '',
  paProtocolNumber: '12345678910',
  subject: 'Multone esagerato',
  recipients: newNotificationRecipients,
  documents: newNotificationDocuments,
  payment: {
    [newNotificationRecipients[0].taxId]: {
      pagoPaForm: { ...newNotificationPagoPa },
    },
    [newNotificationRecipients[1].taxId]: {
      pagoPaForm: { ...newNotificationPagoPa },
      f24standard: { ...newNotificationF24Standard },
    },
  },
  physicalCommunicationType: PhysicalCommunicationType.REGISTERED_LETTER_890,
  paymentMode: PaymentModel.PAGO_PA_NOTICE_F24,
  group: newNotificationGroups[2].id,
  taxonomyCode: '010801N',
  notificationFeePolicy: NotificationFeePolicy.FLAT_RATE,
  senderDenomination: userResponse.organization.name,
  senderTaxId: userResponse.organization.fiscal_code,
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
  notificationFeePolicy: '' as NotificationFeePolicy,
};

export const newNotificationDTO: NewNotificationDTO = newNotificationMapper(newNotification);
