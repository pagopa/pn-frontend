import {
  NotificationDetail,
  NotificationFeePolicy,
  RecipientType,
  DigitalDomicileType,
  NotificationStatus,
  TimelineCategory,
  LegalFactType,
  AddressSource,
  PhysicalCommunicationType,
  parseNotificationDetail,
  ExtRegistriesPaymentDetails,
  PaymentInfoDetail,
  PaymentStatus,
  INotificationDetailTimeline,
  NotificationStatusHistory,
  NotificationDetailDocument,
  NotificationDetailRecipient,
} from '@pagopa-pn/pn-commons';

const timeline: Array<INotificationDetailTimeline> = [
  {
    elementId: 'c_b429-202203021814_start',
    timestamp: '2022-03-02T17:56:46.668Z',
    category: TimelineCategory.REQUEST_ACCEPTED,
    details: {},
    legalFactsIds: [
      {
        key: 'sender_ack~0f4Z32eLEiX8NSYR4WYzyvQvnQHh1t7Z',
        category: LegalFactType.SENDER_ACK,
      },
    ],
  },
  {
    elementId: 'c_b429-202203021814_deliveryMode_rec0',
    timestamp: '2022-03-02T17:56:50.303Z',
    category: TimelineCategory.SEND_ANALOG_DOMICILE,
    details: {
      physicalAddress: {
        at: '',
        address: '',
        addressDetails: '',
        zip: '',
        municipality: '',
        province: '',
        foreignState: '',
      },
    },
  },
  {
    elementId: 'c_b429-202203021814_send_pec_rec0_PLATFORM_n1',
    timestamp: '2022-03-02T17:56:53.636Z',
    category: TimelineCategory.SEND_DIGITAL_DOMICILE,
    details: {
      digitalAddress: {
        type: DigitalDomicileType.EMAIL,
        address: 'mocked@email.it',
      },
      digitalAddressSource: AddressSource.GENERAL,
      retryNumber: 1,
    },
  },
  {
    elementId: 'c_b429-202203021814_send_pec_rec0_SPECIAL_n1',
    timestamp: '2022-03-02T17:56:56.856Z',
    category: TimelineCategory.SEND_DIGITAL_DOMICILE,
    details: {
      digitalAddress: {
        type: DigitalDomicileType.PEC,
        address: 'nome.cognome@works.demo.it',
      },
      digitalAddressSource: AddressSource.GENERAL,
      retryNumber: 1,
    },
  },
  {
    elementId: 'c_b429-202203021814_recipient_timeout_rec0',
    timestamp: '2022-03-02T17:59:10.029Z',
    category: TimelineCategory.REFINEMENT,
    details: {},
  },
  {
    elementId: 'c_b4239-202203021814_recipient_timeout_rec0',
    timestamp: '2022-03-02T17:59:10.029Z',
    category: TimelineCategory.PAYMENT,
    details: {
      paymentSourceChannel: 'EXTERNAL_REGISTRY',
      recipientType: RecipientType.PF,
      recIndex: 0,
    },
  },
];

const notificationStatusHistory: Array<NotificationStatusHistory> = [
  {
    status: NotificationStatus.DELIVERED,
    activeFrom: '2022-02-22T10:19:33.440Z',
    relatedTimelineElements: [],
  },
];

const documents: Array<NotificationDetailDocument> = [
  {
    digests: {
      sha256: '3b56e2b5641d5807fa83d6bc906a35135a6b8b7c21e694b859bbafc3d718d659',
    },
    contentType: 'application/pdf',
    title: 'Mocked document',
    ref: {
      key: 'Doc1',
      versionToken: 'mocked-versionToken',
    },
    docIdx: '0',
  },
];

const recipients: Array<NotificationDetailRecipient> = [
  {
    recipientType: RecipientType.PF,
    taxId: 'CGNNMO80A03H501U',
    denomination: 'Analogico Ok',
    digitalDomicile: {
      address: 'mail@pec.it',
      type: DigitalDomicileType.PEC,
    },
    physicalAddress: {
      at: 'Presso qualcuno',
      address: 'In via del tutto eccezionale',
      addressDetails: 'scala A',
      zip: '00100',
      municipality: 'Comune',
      province: 'PROV',
      foreignState: '',
    },
    payments: [
      {
        pagoPA: {
          creditorTaxId: '302011689142547191',
          noticeCode: '77777777777',
          applyCostFlg: true,
          attachment: {
            digests: {
              sha256: 'jezIVxlG1M1woCSUngM6KipUN3/p8cG5RMIPnuEanlE=',
            },
            contentType: 'application/pdf',
            ref: {
              key: 'PN_NOTIFICATION_ATTACHMENTS-4727f193467c4c5cb26a848f0ea5aee0.pdf',
              versionToken: 'v1',
            },
          },
        },
      },
    ],
  },
  {
    recipientType: RecipientType.PG,
    taxId: 'CCRMCT06A03A433H',
    denomination: 'Totito',
    digitalDomicile: {
      type: DigitalDomicileType.PEC,
      address: 'totito@pec.pagopa.it',
    },
    physicalAddress: {
      at: 'Presso',
      address: 'VIA SENZA NOME',
      addressDetails: 'SCALA B',
      zip: '87100',
      municipality: 'MILANO',
      municipalityDetails: 'MILANO',
      province: 'MI',
      foreignState: 'ITALIA',
    },
    payments: [
      {
        pagoPA: {
          creditorTaxId: '302011689142547191',
          noticeCode: '77777777777',
          applyCostFlg: true,
          attachment: {
            digests: {
              sha256: 'jezIVxlG1M1woCSUngM6KipUN3/p8cG5RMIPnuEanlE=',
            },
            contentType: 'application/pdf',
            ref: {
              key: 'PN_NOTIFICATION_ATTACHMENTS-4727f193467c4c5cb26a848f0ea5aee0.pdf',
              versionToken: 'v1',
            },
          },
        },
      },
    ],
  },
];

export const PA_NOTIFICATION_DTO: NotificationDetail = {
  iun: 'c_b963-220220221119',
  paProtocolNumber: '220220221119',
  subject: 'Prova - status',
  abstract: 'mocked-abstract',
  sentAt: '2022-02-21T10:19:33.440Z',
  cancelledIun: 'mocked-cancelledIun',
  cancelledByIun: 'mocked-cancelledByIun',
  documentsAvailable: true,
  notificationFeePolicy: NotificationFeePolicy.DELIVERY_MODE,
  senderPaId: 'mocked-senderPaId',
  recipients: [recipients[0]],
  documents,
  notificationStatus: NotificationStatus.DELIVERED,
  notificationStatusHistory,
  timeline,
  physicalCommunicationType: PhysicalCommunicationType.REGISTERED_LETTER_890,
  amount: 130,
};

export const notificationToFe = parseNotificationDetail(PA_NOTIFICATION_DTO);

export const PA_NOTIFICATION_DTO_MULTI_RECIPIENT: NotificationDetail = {
  ...PA_NOTIFICATION_DTO,
  recipients,
};

export const notificationToFeMultiRecipient = parseNotificationDetail(
  PA_NOTIFICATION_DTO_MULTI_RECIPIENT
);

export const EXTERNAL_REGISTRIES_MOCK: ExtRegistriesPaymentDetails = {
  creditorTaxId: 'string',
  noticeCode: 'string',
  status: PaymentStatus.REQUIRED,
  detail: PaymentInfoDetail.PAYMENT_UNAVAILABLE,
  detail_v2: 'PPT_PSP_SCONOSCIUTO',
  errorCode: 'PPT_AUTORIZZAZIONE',
  amount: 1200,
  url: 'https://api.uat.platform.pagopa.it/checkout/auth/payments/v2',
  causaleVersamento: 'Seconda rata TARI',
  dueDate: '2025-07-31',
};
