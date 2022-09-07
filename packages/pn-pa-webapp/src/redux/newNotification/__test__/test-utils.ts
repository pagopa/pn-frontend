import {
  PhysicalCommunicationType,
  RecipientType,
  NotificationFeePolicy,
  DigitalDomicileType,
} from '@pagopa-pn/pn-commons';

import {
  NewNotification,
  NewNotificationDTO,
  PaymentModel,
  NewNotificationDocument,
  NewNotificationRecipient,
} from '../../../models/NewNotification';

export const newNotificationRecipients: Array<NewNotificationRecipient> = [
  {
    idx: 0,
    taxId: 'mocked-taxId1',
    firstName: 'Mario',
    lastName: 'Rossi',
    recipientType: RecipientType.PF,
    creditorTaxId: 'mocked-creditorTaxId',
    noticeCode: 'mocked-noticeCode',
    type: DigitalDomicileType.PEC,
    digitalDomicile: 'mocked@mail.it',
    address: 'address',
    houseNumber: 'houseNumber',
    zip: 'zip',
    municipality: 'municipality',
    province: 'province',
    foreignState: 'foreignState',
  },
  {
    idx: 1,
    taxId: 'mocked-taxId2',
    firstName: 'Sara',
    lastName: 'Giallo',
    recipientType: RecipientType.PF,
    creditorTaxId: 'mocked-creditorTaxId',
    noticeCode: 'mocked-noticeCode',
    type: DigitalDomicileType.PEC,
    digitalDomicile: 'mocked@mail.it',
    address: '',
    houseNumber: '',
    zip: '',
    municipality: '',
    province: '',
    foreignState: '',
  },
];

export const newNotificationDocument: NewNotificationDocument = {
  id: 'mocked-id',
  idx: 0,
  name: 'mocked-name',
  file: {
    sha256: {
      hashBase64: '',
      hashHex: '',
    },
    contentType: '',
  },
  ref: {
    key: '',
    versionToken: '',
  },
};

export const newNotification: NewNotification = {
  paProtocolNumber: '',
  subject: '',
  cancelledIun: '',
  recipients: newNotificationRecipients,
  documents: [],
  payment: {
    'mocked-taxId1': {
      pagoPaForm: newNotificationDocument,
      f24flatRate: newNotificationDocument,
      f24standard: newNotificationDocument,
    },
    'mocked-taxId2': {
      pagoPaForm: newNotificationDocument,
      f24flatRate: newNotificationDocument,
      f24standard: newNotificationDocument,
    },
  },
  physicalCommunicationType: '' as PhysicalCommunicationType,
  paymentMode: PaymentModel.PAGO_PA_NOTICE_F24,
  group: '',
  notificationFeePolicy: '' as NotificationFeePolicy,
};

export const newNotificationDTO: NewNotificationDTO = {
  paProtocolNumber: '',
  subject: '',
  cancelledIun: '',
  recipients: [
    {
      taxId: 'mocked-taxId1',
      denomination: 'Mario Rossi',
      recipientType: RecipientType.PF,
      digitalDomicile: {
        type: DigitalDomicileType.PEC,
        address: 'mocked@mail.it',
      },
      physicalAddress: {
        address: 'address houseNumber',
        addressDetails: undefined,
        at: undefined,
        zip: 'zip',
        municipality: 'municipality',
        municipalityDetails: undefined,
        province: 'province',
        foreignState: 'foreignState',
      },
      payment: {
        creditorTaxId: 'mocked-creditorTaxId',
        noticeCode: 'mocked-noticeCode',
        pagoPaForm: {
          title: 'mocked-name',
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
    },
    {
      taxId: 'mocked-taxId2',
      denomination: 'Sara Giallo',
      recipientType: RecipientType.PF,
      digitalDomicile: {
        type: DigitalDomicileType.PEC,
        address: 'mocked@mail.it',
      },
      physicalAddress: undefined,
      payment: {
        creditorTaxId: 'mocked-creditorTaxId',
        noticeCode: 'mocked-noticeCode',
        pagoPaForm: {
          title: 'mocked-name',
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
    },
  ],
  documents: [],
  physicalCommunicationType: '' as PhysicalCommunicationType,
  group: '',
  notificationFeePolicy: '' as NotificationFeePolicy,
};
