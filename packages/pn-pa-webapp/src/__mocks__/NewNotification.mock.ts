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
} from '../models/NewNotification';

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
  contentType: 'text/plain',
  file: {
    data: new File([''], 'mocked-name', { type: 'text/plain' }),
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
  contentType: 'text/plain',
  file: {
    data: new File([''], 'mocked-name', { type: 'text/plain' }),
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
  contentType: 'text/plain',
  file: {
    data: new File([''], 'mocked-name', { type: 'text/plain' }),
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
  paProtocolNumber: '',
  subject: '',
  cancelledIun: '',
  recipients: newNotificationRecipients,
  documents: [newNotificationDocument],
  payment: {
    MRARSS90P08H501Q: {
      pagoPaForm: { ...newNotificationPagoPa },
    },
    SRAGLL00P48H501U: {
      pagoPaForm: { ...newNotificationPagoPa },
      f24standard: { ...newNotificationF24Standard },
    },
  },
  physicalCommunicationType: '' as PhysicalCommunicationType,
  paymentMode: PaymentModel.PAGO_PA_NOTICE_F24,
  group: '',
  taxonomyCode: '010801N',
  notificationFeePolicy: '' as NotificationFeePolicy,
};

export const newNotificationDTO: NewNotificationDTO = {
  paProtocolNumber: '12345678910',
  subject: 'Multone esagerato',
  recipients: [
    {
      taxId: 'MRARSS90P08H501Q',
      denomination: 'Mario Rossi',
      recipientType: RecipientType.PF,
      digitalDomicile: {
        type: DigitalDomicileType.PEC,
        address: 'mocked@mail.it',
      },
      physicalAddress: {
        address: 'address 1',
        zip: 'zip',
        municipality: 'municipality',
        province: 'province',
        foreignState: 'foreignState',
      },
      payment: {
        creditorTaxId: '12345678910',
        noticeCode: '123456789123456788',
        pagoPaForm: {
          title: 'mocked-name',
          digests: {
            sha256: 'mocked-pa-sha256',
          },
          contentType: 'text/plain',
          ref: {
            key: 'mocked-key',
            versionToken: 'mocked-versionToken',
          },
        },
      },
    },
    {
      taxId: 'SRAGLL00P48H501U',
      denomination: 'Sara Giallo',
      recipientType: RecipientType.PF,
      digitalDomicile: {
        type: DigitalDomicileType.PEC,
        address: 'mocked@mail.it',
      },
      physicalAddress: {
        address: 'address 2',
        foreignState: 'foreignState',
        municipality: 'municipality',
        province: 'province',
        zip: 'zip',
      },
      payment: {
        creditorTaxId: '12345678910',
        noticeCode: '123456789123456789',
        pagoPaForm: {
          title: 'mocked-name',
          digests: {
            sha256: 'mocked-pa-sha256',
          },
          contentType: 'text/plain',
          ref: {
            key: 'mocked-ref',
            versionToken: 'mocked-versionToken',
          },
        },
        f24standard: {
          title: 'mocked-name',
          digests: {
            sha256: 'mocked-f24standard-sha256',
          },
          contentType: 'text/plain',
          ref: {
            key: 'mocked-ref',
            versionToken: 'mocked-versionToken',
          },
        },
      },
    },
  ],
  documents: [
    {
      title: 'mocked-name',
      digests: {
        sha256: 'mocked-sha256',
      },
      contentType: 'text/plain',
      ref: {
        key: 'mocked-ref',
        versionToken: 'mocked-versionToken',
      },
    },
  ],
  physicalCommunicationType: PhysicalCommunicationType.AR_REGISTERED_LETTER,
  group: 'GroupTest',
  taxonomyCode: '010801N',
  notificationFeePolicy: NotificationFeePolicy.FLAT_RATE,
};

export const newNotificationWithEmptyAddress: NewNotification = {
  ...newNotification,
  recipients: [
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
      address: '',
      houseNumber: '',
      zip: 'zip',
      municipality: 'municipality',
      province: 'province',
      foreignState: 'foreignState',
    },
  ],
};

export const newNotificationDTOWithUndefinedAddress: NewNotificationDTO = {
  ...newNotificationDTO,
  recipients: [
    {
      taxId: 'MRARSS90P08H501Q',
      denomination: 'Mario Rossi',
      recipientType: RecipientType.PF,
      digitalDomicile: {
        type: DigitalDomicileType.PEC,
        address: 'mocked@mail.it',
      },
      physicalAddress: undefined,
      payment: {
        creditorTaxId: '12345678910',
        noticeCode: '123456789123456788',
        pagoPaForm: {
          title: 'mocked-name',
          digests: {
            sha256: 'mocked-pa-sha256',
          },
          contentType: 'text/plain',
          ref: {
            key: '',
            versionToken: '',
          },
        },
      },
    },
  ],
};
