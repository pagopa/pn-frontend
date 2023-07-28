import {
  AddressSource,
  DigitalDomicileType,
  ExtRegistriesPaymentDetails,
  INotificationDetailTimeline,
  LegalFactType,
  NotificationDetail,
  NotificationDetailRecipient,
  NotificationFeePolicy,
  NotificationStatus,
  NotificationStatusHistory,
  PaymentInfoDetail,
  PaymentStatus,
  PhysicalCommunicationType,
  RecipientType,
  TimelineCategory,
  parseNotificationDetail,
} from '@pagopa-pn/pn-commons';

const recipients: Array<NotificationDetailRecipient> = [
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

const statusHistory: Array<NotificationStatusHistory> = [
  {
    status: NotificationStatus.ACCEPTED,
    activeFrom: '2023-07-12T06:15:50.416429021Z',
    relatedTimelineElements: [
      'REQUEST_ACCEPTED.IUN_AGZY-LZEZ-HDJW-202307-Z-1',
      'AAR_CREATION_REQUEST.IUN_AGZY-LZEZ-HDJW-202307-Z-1.RECINDEX_0',
      'AAR_GEN.IUN_AGZY-LZEZ-HDJW-202307-Z-1.RECINDEX_0',
      'SEND_COURTESY_MESSAGE.IUN_AGZY-LZEZ-HDJW-202307-Z-1.RECINDEX_0.COURTESYADDRESSTYPE_EMAIL',
      'PROBABLE_SCHEDULING_ANALOG_DATE.IUN_AGZY-LZEZ-HDJW-202307-Z-1.RECINDEX_0',
      'SEND_COURTESY_MESSAGE.IUN_AGZY-LZEZ-HDJW-202307-Z-1.RECINDEX_0.COURTESYADDRESSTYPE_SMS',
      'GET_ADDRESS.IUN_AGZY-LZEZ-HDJW-202307-Z-1.RECINDEX_0.SOURCE_PLATFORM.ATTEMPT_0',
      'GET_ADDRESS.IUN_AGZY-LZEZ-HDJW-202307-Z-1.RECINDEX_0.SOURCE_SPECIAL.ATTEMPT_0',
    ],
  },
  {
    status: NotificationStatus.DELIVERING,
    activeFrom: '2023-07-12T06:17:32.938009007Z',
    relatedTimelineElements: [
      'SEND_DIGITAL.IUN_AGZY-LZEZ-HDJW-202307-Z-1.RECINDEX_0.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0',
      'DIGITAL_PROG.IUN_AGZY-LZEZ-HDJW-202307-Z-1.RECINDEX_0.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0.IDX_1',
      'SEND_DIGITAL_FEEDBACK.IUN_AGZY-LZEZ-HDJW-202307-Z-1.RECINDEX_0.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0',
      'DIGITAL_DELIVERY_CREATION_REQUEST.IUN_AGZY-LZEZ-HDJW-202307-Z-1.RECINDEX_0',
    ],
  },
  {
    status: NotificationStatus.DELIVERED,
    activeFrom: '2023-07-12T06:18:12.651426861Z',
    relatedTimelineElements: [
      'DIGITAL_SUCCESS_WORKFLOW.IUN_AGZY-LZEZ-HDJW-202307-Z-1.RECINDEX_0',
      'SCHEDULE_REFINEMENT_WORKFLOW.IUN_AGZY-LZEZ-HDJW-202307-Z-1.RECINDEX_0',
    ],
  },
  {
    status: NotificationStatus.VIEWED,
    activeFrom: '2023-07-12T06:18:26.109470956Z',
    relatedTimelineElements: [
      'NOTIFICATION_VIEWED.IUN_AGZY-LZEZ-HDJW-202307-Z-1.RECINDEX_0',
      'NOTIFICATION_VIEWED_CREATION_REQUEST.IUN_AGZY-LZEZ-HDJW-202307-Z-1.RECINDEX_0',
    ],
  },
];

const timeline: Array<INotificationDetailTimeline> = [
  {
    elementId: 'c_b429-202203021814_start',
    timestamp: '2022-03-02T17:56:46.668Z',
    category: TimelineCategory.REQUEST_ACCEPTED,
    details: { recIndex: 0 },
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
      recIndex: 0,
      digitalAddress: {
        type: DigitalDomicileType.EMAIL,
        address: 'nome.cognome@works.demo.it',
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
    elementId: 'c_b429-202203021814_send_pec_result_rec0_SPECIAL_n1',
    timestamp: '2022-03-02T17:57:03.284Z',
    category: TimelineCategory.NOTIFICATION_VIEWED,
    legalFactsIds: [
      {
        key: 'sender_ack-toto1',
        category: LegalFactType.SENDER_ACK,
      },
    ],
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
    elementId: 'c_b429-202203021814_send_courtesy_rec0',
    timestamp: '2022-03-02T17:57:06.819Z',
    category: TimelineCategory.NOTIFICATION_VIEWED,
    details: {
      recIndex: 0,
    },
    legalFactsIds: [
      {
        key: 'digital_delivery_info_ed84b8c9-444e-410d-80d7-cfad6aa12070~QDr7GVmbdGkJJFEgxi0OlxPs.l2F2Wq.',
        category: LegalFactType.DIGITAL_DELIVERY,
      },
    ],
  },
  {
    elementId: 'c_b429-202203021814_recipient_timeout_rec0',
    timestamp: '2022-03-02T17:59:10.029Z',
    category: TimelineCategory.REFINEMENT,
    details: {},
  },
];

export const PF_NOTIFICATION_FROM_BE: NotificationDetail = {
  iun: 'AGZY-LZEZ-HDJW-202307-Z-1',
  paProtocolNumber: '302011689142547177',
  subject: 'Mock notification',
  abstract: 'Abstract della notifica',
  sentAt: '2023-07-12T06:15:50.416429021Z',
  senderDenomination: 'Comune di Milano',
  documentsAvailable: true,
  notificationFeePolicy: NotificationFeePolicy.DELIVERY_MODE,
  senderPaId: '026e8c72-7944-4dcd-8668-f596447fec6d',
  recipients: [recipients[0]],
  documents: [
    {
      digests: {
        sha256: 'jezIVxlG1M1woCSUngM6KipUN3/p8cG5RMIPnuEanlE=',
      },
      contentType: 'application/pdf',
      ref: {
        key: 'PN_NOTIFICATION_ATTACHMENTS-a62a5bb5813045cbafc87f55828feb24.pdf',
        versionToken: 'v1',
      },
      docIdx: '0',
    },
  ],
  notificationStatus: NotificationStatus.PAID,
  notificationStatusHistory: statusHistory,
  timeline,
  physicalCommunicationType: PhysicalCommunicationType.REGISTERED_LETTER_890,
};

export const notificationToFe = parseNotificationDetail(PF_NOTIFICATION_FROM_BE);

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
