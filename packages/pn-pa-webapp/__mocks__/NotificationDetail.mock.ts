import {
  AddressSource,
  DigitalDomicileType,
  INotificationDetailTimeline,
  LegalFactType,
  NotificationDetail,
  NotificationDetailDocument,
  NotificationDetailPayment,
  NotificationDetailRecipient,
  NotificationFeePolicy,
  NotificationStatus,
  NotificationStatusHistory,
  PhysicalCommunicationType,
  RecipientType,
  TimelineCategory,
  parseNotificationDetail,
} from '@pagopa-pn/pn-commons';

const timeline: Array<INotificationDetailTimeline> = [
  {
    elementId: 'REQUEST_ACCEPTED.IUN_TJUN-ATLX-UNQN-202307-L-1',
    timestamp: '2023-07-21T08:45:52.717605603Z',
    legalFactsIds: [
      {
        key: 'safestorage://PN_LEGAL_FACTS-4501752a0c8348ccbe3a36d605c151cb.pdf',
        category: LegalFactType.SENDER_ACK,
      },
    ],
    category: TimelineCategory.REQUEST_ACCEPTED,
    details: {},
  },
  {
    elementId: 'AAR_GEN.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_0',
    timestamp: '2023-07-21T08:46:22.166353168Z',
    legalFactsIds: [],
    category: TimelineCategory.AAR_GENERATION,
    details: {
      recIndex: 0,
      generatedAarUrl: 'safestorage://PN_AAR-2778b42e26cc4e3b8efae785fea17d49.pdf',
      numberOfPages: 1,
    },
  },
  {
    elementId: 'AAR_GEN.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_1',
    timestamp: '2023-07-21T08:46:22.22292031Z',
    legalFactsIds: [],
    category: TimelineCategory.AAR_GENERATION,
    details: {
      recIndex: 1,
      generatedAarUrl: 'safestorage://PN_AAR-185947d1070d4f93b28ca6a8323cdd6f.pdf',
      numberOfPages: 1,
    },
  },
  {
    elementId: 'GET_ADDRESS.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_1.SOURCE_PLATFORM.ATTEMPT_0',
    timestamp: '2023-07-21T08:46:32.232409847Z',
    legalFactsIds: [],
    category: TimelineCategory.GET_ADDRESS,
    details: {
      recIndex: 1,
      digitalAddressSource: AddressSource.PLATFORM,
      isAvailable: false,
      attemptDate: '2023-07-21T08:46:32.232407609Z',
    },
  },
  {
    elementId: 'GET_ADDRESS.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_0.SOURCE_PLATFORM.ATTEMPT_0',
    timestamp: '2023-07-21T08:46:32.237621767Z',
    legalFactsIds: [],
    category: TimelineCategory.GET_ADDRESS,
    details: {
      recIndex: 0,
      digitalAddressSource: AddressSource.PLATFORM,
      isAvailable: false,
      attemptDate: '2023-07-21T08:46:32.237620146Z',
    },
  },
  {
    elementId: 'GET_ADDRESS.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_1.SOURCE_SPECIAL.ATTEMPT_0',
    timestamp: '2023-07-21T08:46:32.258547462Z',
    legalFactsIds: [],
    category: TimelineCategory.GET_ADDRESS,
    details: {
      recIndex: 1,
      digitalAddressSource: AddressSource.SPECIAL,
      isAvailable: true,
      attemptDate: '2023-07-21T08:46:32.25854559Z',
    },
  },
  {
    elementId: 'GET_ADDRESS.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_0.SOURCE_SPECIAL.ATTEMPT_0',
    timestamp: '2023-07-21T08:46:32.267601198Z',
    legalFactsIds: [],
    category: TimelineCategory.GET_ADDRESS,
    details: {
      recIndex: 0,
      digitalAddressSource: AddressSource.SPECIAL,
      isAvailable: true,
      attemptDate: '2023-07-21T08:46:32.267599385Z',
    },
  },
  {
    elementId:
      'SEND_DIGITAL.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_0.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0',
    timestamp: '2023-07-21T08:46:32.896100852Z',
    legalFactsIds: [],
    category: TimelineCategory.SEND_DIGITAL_DOMICILE,
    details: {
      recIndex: 0,
      digitalAddress: {
        type: DigitalDomicileType.PEC,
        address: 'testpagopa3@pnpagopa.postecert.local',
      },
      digitalAddressSource: AddressSource.SPECIAL,
      retryNumber: 0,
    },
  },
  {
    elementId:
      'DIGITAL_PROG.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_0.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0.IDX_1',
    timestamp: '2023-07-21T08:46:42.915686788Z',
    legalFactsIds: [
      {
        key: 'safestorage://PN_EXTERNAL_LEGAL_FACTS-66910524d59c470c824cce017dcbff04.xml',
        category: LegalFactType.PEC_RECEIPT,
      },
    ],
    category: TimelineCategory.SEND_DIGITAL_PROGRESS,
    details: {
      recIndex: 0,
      digitalAddress: {
        type: DigitalDomicileType.PEC,
        address: 'testpagopa3@pnpagopa.postecert.local',
      },
      digitalAddressSource: AddressSource.SPECIAL,
      retryNumber: 0,
      notificationDate: '2023-07-21T08:46:44.192008596Z',
      deliveryDetailCode: 'C001',
    },
  },
  {
    elementId:
      'SEND_DIGITAL_FEEDBACK.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_0.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0',
    timestamp: '2023-07-21T08:46:53.162889641Z',
    legalFactsIds: [
      {
        key: 'safestorage://PN_EXTERNAL_LEGAL_FACTS-a26c91a6fe7b401f8db3829705a2efe3.xml',
        category: LegalFactType.PEC_RECEIPT,
      },
    ],
    category: TimelineCategory.SEND_DIGITAL_FEEDBACK,
    details: {
      recIndex: 0,
      digitalAddress: {
        type: DigitalDomicileType.PEC,
        address: 'testpagopa3@pnpagopa.postecert.local',
      },
      digitalAddressSource: AddressSource.SPECIAL,
      responseStatus: 'OK',
      notificationDate: '2023-07-21T08:46:53.162889641Z',
      deliveryDetailCode: 'C003',
    },
  },
  {
    elementId: 'DIGITAL_SUCCESS_WORKFLOW.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_0',
    timestamp: '2023-07-21T08:47:12.394854919Z',
    legalFactsIds: [
      {
        key: 'safestorage://PN_LEGAL_FACTS-51d20bde88894a0f836aa007627f33d3.pdf',
        category: LegalFactType.DIGITAL_DELIVERY,
      },
    ],
    category: TimelineCategory.DIGITAL_SUCCESS_WORKFLOW,
    details: {
      recIndex: 0,
      digitalAddress: {
        type: DigitalDomicileType.PEC,
        address: 'testpagopa3@pnpagopa.postecert.local',
      },
    },
  },
  {
    elementId: 'SCHEDULE_REFINEMENT_WORKFLOW.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_0',
    timestamp: '2023-07-21T08:47:12.441833431Z',
    legalFactsIds: [],
    category: TimelineCategory.SCHEDULE_REFINEMENT,
    details: {
      recIndex: 0,
    },
  },
  {
    elementId:
      'SEND_DIGITAL.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_1.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0',
    timestamp: '2023-07-21T08:47:32.813187741Z',
    legalFactsIds: [],
    category: TimelineCategory.SEND_DIGITAL_DOMICILE,
    details: {
      recIndex: 1,
      digitalAddress: {
        type: DigitalDomicileType.PEC,
        address: 'testpagopa3@pnpagopa.postecert.local',
      },
      digitalAddressSource: AddressSource.SPECIAL,
      retryNumber: 0,
    },
  },
  {
    elementId:
      'DIGITAL_PROG.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_1.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0.IDX_1',
    timestamp: '2023-07-21T08:47:42.85988544Z',
    legalFactsIds: [
      {
        key: 'safestorage://PN_EXTERNAL_LEGAL_FACTS-55e57ae5d2e44d149b72618037aafd78.xml',
        category: LegalFactType.PEC_RECEIPT,
      },
    ],
    category: TimelineCategory.SEND_DIGITAL_PROGRESS,
    details: {
      recIndex: 1,
      digitalAddress: {
        type: DigitalDomicileType.PEC,
        address: 'testpagopa3@pnpagopa.postecert.local',
      },
      digitalAddressSource: AddressSource.SPECIAL,
      retryNumber: 0,
      notificationDate: '2023-07-21T08:47:44.10840315Z',
      deliveryDetailCode: 'C001',
    },
  },
  {
    elementId:
      'SEND_DIGITAL_FEEDBACK.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_1.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0',
    timestamp: '2023-07-21T08:47:53.138688275Z',
    legalFactsIds: [
      {
        key: 'safestorage://PN_EXTERNAL_LEGAL_FACTS-dafd4972dd36425c98df9d8c1da6b396.xml',
        category: LegalFactType.PEC_RECEIPT,
      },
    ],
    category: TimelineCategory.SEND_DIGITAL_FEEDBACK,
    details: {
      recIndex: 1,
      digitalAddress: {
        type: DigitalDomicileType.PEC,
        address: 'testpagopa3@pnpagopa.postecert.local',
      },
      digitalAddressSource: AddressSource.SPECIAL,
      responseStatus: 'OK',
      notificationDate: '2023-07-21T08:47:53.138688275Z',
      deliveryDetailCode: 'C003',
    },
  },
  {
    elementId: 'DIGITAL_SUCCESS_WORKFLOW.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_1',
    timestamp: '2023-07-21T08:48:12.583947414Z',
    legalFactsIds: [
      {
        key: 'safestorage://PN_LEGAL_FACTS-aee354cf079d4e628d6881417a294604.pdf',
        category: LegalFactType.DIGITAL_DELIVERY,
      },
    ],
    category: TimelineCategory.DIGITAL_SUCCESS_WORKFLOW,
    details: {
      recIndex: 1,
      digitalAddress: {
        type: DigitalDomicileType.PEC,
        address: 'testpagopa3@pnpagopa.postecert.local',
      },
    },
  },
  {
    elementId: 'REFINEMENT.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_0',
    timestamp: '2023-07-21T08:50:02.938793143Z',
    legalFactsIds: [],
    category: TimelineCategory.REFINEMENT,
    details: {
      recIndex: 0,
    },
  },
  {
    elementId: 'REFINEMENT.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_1',
    timestamp: '2023-07-21T08:51:03.091486224Z',
    legalFactsIds: [],
    category: TimelineCategory.REFINEMENT,
    details: {
      recIndex: 1,
    },
  },
  {
    elementId: 'NOTIFICATION_VIEWED.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_0',
    timestamp: '2023-07-21T14:58:29.886128718Z',
    legalFactsIds: [
      {
        key: 'safestorage://PN_LEGAL_FACTS-89e1676797e94453b8463c76d7726a86.pdf',
        category: LegalFactType.RECIPIENT_ACCESS,
      },
    ],
    category: TimelineCategory.NOTIFICATION_VIEWED,
    details: {
      recIndex: 0,
    },
  },
];

const notificationStatusHistory: Array<NotificationStatusHistory> = [
  {
    status: NotificationStatus.ACCEPTED,
    activeFrom: '2023-07-21T08:44:46.330511885Z',
    relatedTimelineElements: [
      'REQUEST_ACCEPTED.IUN_TJUN-ATLX-UNQN-202307-L-1',
      'AAR_CREATION_REQUEST.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_1',
      'AAR_CREATION_REQUEST.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_0',
      'AAR_GEN.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_0',
      'AAR_GEN.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_1',
      'GET_ADDRESS.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_1.SOURCE_PLATFORM.ATTEMPT_0',
      'GET_ADDRESS.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_0.SOURCE_PLATFORM.ATTEMPT_0',
      'GET_ADDRESS.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_1.SOURCE_SPECIAL.ATTEMPT_0',
      'GET_ADDRESS.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_0.SOURCE_SPECIAL.ATTEMPT_0',
    ],
  },
  {
    status: NotificationStatus.DELIVERING,
    activeFrom: '2023-07-21T08:46:32.896100852Z',
    relatedTimelineElements: [
      'SEND_DIGITAL.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_0.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0',
      'DIGITAL_PROG.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_0.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0.IDX_1',
      'SEND_DIGITAL_FEEDBACK.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_0.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0',
      'DIGITAL_DELIVERY_CREATION_REQUEST.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_0',
      'DIGITAL_SUCCESS_WORKFLOW.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_0',
      'SCHEDULE_REFINEMENT_WORKFLOW.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_0',
      'SEND_DIGITAL.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_1.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0',
      'DIGITAL_PROG.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_1.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0.IDX_1',
      'SEND_DIGITAL_FEEDBACK.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_1.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0',
      'DIGITAL_DELIVERY_CREATION_REQUEST.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_1',
    ],
  },
  {
    status: NotificationStatus.DELIVERED,
    activeFrom: '2023-07-21T08:48:12.583947414Z',
    relatedTimelineElements: [
      'DIGITAL_SUCCESS_WORKFLOW.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_1',
      'SCHEDULE_REFINEMENT_WORKFLOW.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_1',
    ],
  },
  {
    status: NotificationStatus.EFFECTIVE_DATE,
    activeFrom: '2023-07-21T08:50:02.938793143Z',
    relatedTimelineElements: [
      'REFINEMENT.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_0',
      'REFINEMENT.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_1',
    ],
  },
  {
    status: NotificationStatus.VIEWED,
    activeFrom: '2023-07-21T14:58:29.886128718Z',
    relatedTimelineElements: [
      'NOTIFICATION_VIEWED.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_0',
      'NOTIFICATION_VIEWED_CREATION_REQUEST.IUN_TJUN-ATLX-UNQN-202307-L-1.RECINDEX_0',
    ],
  },
];

const documents: Array<NotificationDetailDocument> = [
  {
    digests: {
      sha256: 'jezIVxlG1M1woCSUngM6KipUN3/p8cG5RMIPnuEanlE=',
    },
    contentType: 'application/pdf',
    ref: {
      key: 'PN_NOTIFICATION_ATTACHMENTS-2396e00fd41f435d97fcab45edd394f2.pdf',
      versionToken: 'v1',
    },
    docIdx: '0',
  },
];

const paymentsPagoPa: Array<NotificationDetailPayment> = [
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
];

const paymentsPagoPaF24: Array<NotificationDetailPayment> = [
  {
    pagoPA: {
      creditorTaxId: '302011686772695133',
      noticeCode: '77777777777',
      applyCostFlg: true,
      attachment: {
        digests: {
          sha256: 'jezIVxlG1M1woCSUngM6KipUN3/p8cG5RMIPnuEanlA=',
        },
        contentType: 'application/pdf',
        ref: {
          key: 'PN_NOTIFICATION_ATTACHMENTS-5641ed2bc57442fb3df53abe5b5d38d.pdf',
          versionToken: 'v1',
        },
      },
    },
    f24Data: {
      metadata: 'metadata-mocked',
      description: 'F24 seconda rata TARI',
    },
  },
];

const recipients: Array<NotificationDetailRecipient> = [
  {
    recipientType: RecipientType.PF,
    taxId: 'CLMCST42R12D969Z',
    denomination: 'Mario Gherkin',
    digitalDomicile: {
      address: 'testpagopa3@pnpagopa.postecert.local',
      type: DigitalDomicileType.PEC,
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
    payments: paymentsPagoPa,
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
    payments: paymentsPagoPaF24,
  },
];

export const notificationDTO: NotificationDetail = {
  abstract: 'Abstract della notifica',
  paProtocolNumber: '302221689929085089',
  subject: 'invio notifica GA cucumber',
  recipients: recipients,
  documents,
  notificationFeePolicy: NotificationFeePolicy.FLAT_RATE,
  physicalCommunicationType: PhysicalCommunicationType.REGISTERED_LETTER_890,
  senderDenomination: 'Comune di palermo',
  senderTaxId: '80016350821',
  group: '000',
  senderPaId: '5b994d4a-0fa8-47ac-9c7b-354f1d44a1ce',
  iun: 'TJUN-ATLX-UNQN-202307-L-1',
  sentAt: '2023-07-21T08:44:46.330511885Z',
  documentsAvailable: true,
  notificationStatus: NotificationStatus.VIEWED,
  notificationStatusHistory,
  timeline,
};

export const notificationToFe = parseNotificationDetail(notificationDTO);
