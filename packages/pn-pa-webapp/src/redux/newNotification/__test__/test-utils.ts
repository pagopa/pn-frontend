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

const newNotificationRecipients: Array<NewNotificationRecipient> = [
  {
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
    uint8Array: new Uint8Array(),
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
    uint8Array: new Uint8Array(),
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
    uint8Array: new Uint8Array(),
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
    'MRARSS90P08H501Q': {
      pagoPaForm: {...newNotificationPagoPa},
    },
    'SRAGLL00P48H501U': {
      pagoPaForm: {...newNotificationPagoPa},
      f24standard: {...newNotificationF24Standard},
    },
  },
  physicalCommunicationType: '' as PhysicalCommunicationType,
  paymentMode: PaymentModel.PAGO_PA_NOTICE_F24,
  group: '',
  taxonomyCode: '010801N',
  notificationFeePolicy: '' as NotificationFeePolicy,
};

export const newNotificationDTO: NewNotificationDTO = {
  paProtocolNumber: '',
  subject: '',
  cancelledIun: '',
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
        addressDetails: undefined,
        at: undefined,
        zip: 'zip',
        municipality: 'municipality',
        municipalityDetails: undefined,
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
            key: '',
            versionToken: '',
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
      physicalAddress:  {
         address: "address 2",
         addressDetails: undefined,
         at: undefined,
         foreignState: "foreignState",
         municipality: "municipality",
         municipalityDetails: undefined,
         province: "province",
         zip: "zip",
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
            key: '',
            versionToken: '',
          },
        },
        f24standard: {
          title: 'mocked-name',
          digests: {
            sha256: 'mocked-f24standard-sha256',
          },
          contentType: 'text/plain',
          ref: {
            key: '',
            versionToken: '',
          },
        }
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
        key: '',
        versionToken: '',
      },
    }
  ],
  physicalCommunicationType: '' as PhysicalCommunicationType,
  group: '',
  taxonomyCode: '010801N',
  notificationFeePolicy: '' as NotificationFeePolicy,
};

export const newNotificationWithEmptyAddress: NewNotification = {
  ...newNotification,
  recipients: [{
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
  }],
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
    }
  ],
};