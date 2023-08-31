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
    id: '0',
    idx: 0,
    taxId: 'MRARSS90P08H501Q',
    firstName: 'Mario',
    lastName: 'Rossi',
    recipientType: RecipientType.PF,
    creditorTaxId: '12345678910',
    noticeCode: '123456789123456788',
    type: DigitalDomicileType.PEC,
    digitalDomicile: 'mocked@mail.it',
    address: 'address',
    houseNumber: '1',
    zip: 'zip',
    municipality: 'municipality',
    province: 'province',
    foreignState: 'foreignState',
  },
  {
    id: '1',
    idx: 1,
    taxId: 'SRAGLL00P48H501U',
    firstName: 'Sara',
    lastName: 'Giallo',
    recipientType: RecipientType.PF,
    creditorTaxId: '12345678910',
    noticeCode: '123456789123456789',
    type: DigitalDomicileType.PEC,
    digitalDomicile: 'mocked@mail.it',
    address: 'address',
    houseNumber: '2',
    zip: 'zip',
    municipality: 'municipality',
    province: 'province',
    foreignState: 'foreignState',
  },
];

const newNotificationDocument: NewNotificationDocument = {
  id: 'mocked-id',
  idx: 0,
  name: 'mocked-name',
  contentType: 'application/pdf',
  file: {
    data: new File([''], 'mocked-name', { type: 'application/pdf' }),
    sha256: {
      hashBase64: 'mocked-sha256',
      hashHex: '',
    },
  },
  ref: {
    key: '',
    versionToken: '',
  },
};

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
  paProtocolNumber: '12345678910',
  subject: 'Multone esagerato',
  recipients: newNotificationRecipients,
  documents: [newNotificationDocument],
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
  notificationFeePolicy: NotificationFeePolicy.DELIVERY_MODE,
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
