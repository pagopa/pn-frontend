import _ from 'lodash';

import {
  AddressSource,
  INotificationDetailTimeline,
  LegalFactType,
  NotificationDetail,
  NotificationDetailRecipient,
  NotificationFeePolicy,
  NotificationStatus,
  NotificationStatusHistory,
  PhysicalCommunicationType,
  RecipientType,
  TimelineCategory,
  getF24Payments,
  getPagoPaF24Payments,
} from '@pagopa-pn/pn-commons';
import {
  AnalogDetails,
  NotificationDetailPayment,
  PaymentsData,
  SendPaperDetails,
} from '@pagopa-pn/pn-commons/src/types/NotificationDetail';

import { parseNotificationDetailForRecipient } from '../utils/notification.utility';

const payments: Array<NotificationDetailPayment> = [
  {
    pagoPA: {
      creditorTaxId: '77777777777',
      noticeCode: '302011686772695132',
      applyCost: true,
      attachment: {
        digests: {
          sha256: 'jezIVxlG1M1woCSUngM6KipUN3/p8cG5RMIPnuEanlE=',
        },
        contentType: 'application/pdf',
        ref: {
          key: 'PN_NOTIFICATION_ATTACHMENTS-5641ed2bc57442fb3df53abe5b5d38c.pdf',
          versionToken: 'v1',
        },
      },
    },
  },
  {
    pagoPA: {
      creditorTaxId: '77777777777',
      noticeCode: '302011686772695133',
      applyCost: true,
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
    f24: {
      title: 'F24 seconda rata TARI',
      applyCost: false,
      metadataAttachment: {
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
  },
  {
    pagoPA: {
      creditorTaxId: '77777777777',
      noticeCode: '302011686772695134',
      applyCost: false,
    },
  },
  {
    pagoPA: {
      creditorTaxId: '77777777777',
      noticeCode: '302011686772695135',
      applyCost: false,
    },
  },
  {
    f24: {
      title: 'F24 prima rata F24',
      applyCost: false,
      metadataAttachment: {
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
  },
];

const statusHistory: Array<NotificationStatusHistory> = [
  {
    status: NotificationStatus.ACCEPTED,
    activeFrom: '2023-05-09T13:17:31.401700947Z',
    relatedTimelineElements: [
      'REQUEST_ACCEPTED.IUN_RPTH-YULD-WKMA-202305-T-1',
      'AAR_CREATION_REQUEST.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0',
      'AAR_GEN.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0',
      'GET_ADDRESS.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.SOURCE_PLATFORM.ATTEMPT_0',
      'GET_ADDRESS.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.SOURCE_SPECIAL.ATTEMPT_0',
      'NATIONAL_REGISTRY_CALL.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.DELIVERYMODE_DIGITAL.CONTACTPHASE_CHOOSE_DELIVERY.ATTEMPT_0',
      'NATIONAL_REGISTRY_RESPONSE.CORRELATIONID_NATIONAL_REGISTRY_CALL.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.DELIVERYMODE_DIGITAL.CONTACTPHASE_CHOOSE_DELIVERY.ATTEMPT_0',
      'GET_ADDRESS.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.SOURCE_GENERAL.ATTEMPT_0',
      'SCHEDULE_ANALOG_WORKFLOW.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0',
      'PREPARE_ANALOG_DOMICILE.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.ATTEMPT_0',
    ],
  },
  {
    status: NotificationStatus.DELIVERING,
    activeFrom: '2023-05-09T13:22:02.736668855Z',
    relatedTimelineElements: [
      'SEND_ANALOG_DOMICILE.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.ATTEMPT_0',
    ],
  },
  {
    status: NotificationStatus.VIEWED,
    activeFrom: '2023-05-09T13:22:09.863901492Z',
    relatedTimelineElements: [
      'NOTIFICATION_VIEWED.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0',
      'SEND_ANALOG_PROGRESS.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.ATTEMPT_0.IDX_1',
      'SEND_ANALOG_PROGRESS.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.ATTEMPT_0.IDX_2',
      'NOTIFICATION_VIEWED_CREATION_REQUEST.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0',
      'SEND_ANALOG_FEEDBACK.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.ATTEMPT_0',
      'ANALOG_SUCCESS_WORKFLOW.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0',
      'SCHEDULE_REFINEMENT_WORKFLOW.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0',
    ],
  },
];

const timeline: Array<INotificationDetailTimeline> = [
  {
    elementId: 'REQUEST_ACCEPTED.IUN_RPTH-YULD-WKMA-202305-T-1',
    timestamp: '2023-05-09T13:18:59.380111301Z',
    legalFactsIds: [
      {
        key: 'PN_LEGAL_FACTS-4c3db79198f84e27a108c7446bd803f5.pdf',
        category: LegalFactType.SENDER_ACK,
      },
    ],
    category: TimelineCategory.REQUEST_ACCEPTED,
    details: {},
  },
  {
    elementId: 'AAR_GEN.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0',
    timestamp: '2023-05-09T13:19:59.460058075Z',
    legalFactsIds: [],
    category: TimelineCategory.AAR_GENERATION,
    details: {
      recIndex: 1,
      generatedAarUrl: 'PN_AAR-7b9cfda7870346248daf669191ec2cf1.pdf',
      numberOfPages: 1,
    },
  },
  {
    elementId: 'GET_ADDRESS.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.SOURCE_PLATFORM.ATTEMPT_0',
    timestamp: '2023-05-09T13:20:29.739081206Z',
    legalFactsIds: [],
    category: TimelineCategory.GET_ADDRESS,
    details: {
      recIndex: 1,
      digitalAddressSource: AddressSource.PLATFORM,
      isAvailable: false,
      attemptDate: '2023-05-09T13:20:29.739079404Z',
    },
  },
  {
    elementId: 'GET_ADDRESS.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.SOURCE_SPECIAL.ATTEMPT_0',
    timestamp: '2023-05-09T13:20:29.761493263Z',
    legalFactsIds: [],
    category: TimelineCategory.GET_ADDRESS,
    details: {
      recIndex: 1,
      digitalAddressSource: AddressSource.SPECIAL,
      isAvailable: false,
      attemptDate: '2023-05-09T13:20:29.761491883Z',
    },
  },
  {
    elementId:
      'NATIONAL_REGISTRY_CALL.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.DELIVERYMODE_DIGITAL.CONTACTPHASE_CHOOSE_DELIVERY.ATTEMPT_0',
    timestamp: '2023-05-09T13:20:29.876161477Z',
    legalFactsIds: [],
    category: TimelineCategory.PUBLIC_REGISTRY_CALL,
    details: {
      recIndex: 1,
      sentAttemptMade: 0,
      sendDate: '2023-05-09T13:20:29.876148931Z',
    },
  },
  {
    elementId:
      'NATIONAL_REGISTRY_RESPONSE.CORRELATIONID_NATIONAL_REGISTRY_CALL.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.DELIVERYMODE_DIGITAL.CONTACTPHASE_CHOOSE_DELIVERY.ATTEMPT_0',
    timestamp: '2023-05-09T13:21:45.934270082Z',
    legalFactsIds: [],
    category: TimelineCategory.PUBLIC_REGISTRY_RESPONSE,
    details: {
      recIndex: 1,
    },
  },
  {
    elementId: 'GET_ADDRESS.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.SOURCE_GENERAL.ATTEMPT_0',
    timestamp: '2023-05-09T13:21:45.961667427Z',
    legalFactsIds: [],
    category: TimelineCategory.GET_ADDRESS,
    details: {
      recIndex: 1,
      digitalAddressSource: AddressSource.GENERAL,
      isAvailable: false,
      attemptDate: '2023-05-09T13:21:45.9616657Z',
    },
  },
  {
    elementId: 'SCHEDULE_ANALOG_WORKFLOW.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0',
    timestamp: '2023-05-09T13:21:45.986098643Z',
    legalFactsIds: [],
    category: TimelineCategory.SCHEDULE_ANALOG_WORKFLOW,
    details: {
      recIndex: 1,
    },
  },
  {
    elementId: 'PREPARE_ANALOG_DOMICILE.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.ATTEMPT_0',
    timestamp: '2023-05-09T13:22:00.371575913Z',
    legalFactsIds: [],
    category: TimelineCategory.PREPARE_ANALOG_DOMICILE,
    details: {
      recIndex: 1,
      physicalAddress: {
        at: '',
        address: 'VIA MESSI 2022',
        addressDetails: '',
        zip: '98036',
        municipality: 'GRANITI',
        municipalityDetails: '',
        province: 'MESSINA',
        foreignState: 'ITALIA',
      },
      sentAttemptMade: 0,
      serviceLevel: PhysicalCommunicationType.AR_REGISTERED_LETTER,
    },
  },
  {
    elementId: 'SEND_ANALOG_DOMICILE.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.ATTEMPT_0',
    timestamp: '2023-05-09T13:22:02.736668855Z',
    legalFactsIds: [],
    category: TimelineCategory.SEND_ANALOG_DOMICILE,
    details: {
      recIndex: 1,
      physicalAddress: {
        address: 'VIA MESSI 2022',
        zip: '98036',
        municipality: 'GRANITI',
        province: 'MESSINA',
        foreignState: 'ITALIA',
      },
      sentAttemptMade: 0,
      serviceLevel: PhysicalCommunicationType.AR_REGISTERED_LETTER,
      productType: 'AR',
      numberOfPages: 2,
    },
  },
  {
    elementId: 'NOTIFICATION_VIEWED.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0',
    timestamp: '2023-05-09T13:22:09.863901492Z',
    legalFactsIds: [
      {
        key: 'PN_LEGAL_FACTS-5ac83de87d2f4dd38ae7af4270088a80.pdf',
        category: LegalFactType.RECIPIENT_ACCESS,
      },
    ],
    category: TimelineCategory.NOTIFICATION_VIEWED,
    details: {
      recIndex: 1,
    },
  },
  {
    elementId: 'SEND_ANALOG_PROGRESS.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.ATTEMPT_0.IDX_1',
    timestamp: '2023-05-09T13:22:10.001Z',
    legalFactsIds: [],
    category: TimelineCategory.SEND_ANALOG_PROGRESS,
    details: {
      recIndex: 1,
      notificationDate: '2023-05-09T13:22:10.001Z',
      deliveryDetailCode: 'CON080',
      sendRequestId: 'SEND_ANALOG_DOMICILE.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.ATTEMPT_0',
      registeredLetterCode: 'bcaf92f26c634eb08a5ece4633117816',
    },
  },
  {
    elementId: 'SEND_ANALOG_PROGRESS.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.ATTEMPT_0.IDX_2',
    timestamp: '2023-05-09T13:22:19.001Z',
    legalFactsIds: [
      {
        key: 'PN_EXTERNAL_LEGAL_FACTS-2e53ade5875b4e77a242103e7db6ddc4.pdf',
        category: LegalFactType.ANALOG_DELIVERY,
      },
    ],
    category: TimelineCategory.SEND_ANALOG_PROGRESS,
    details: {
      recIndex: 1,
      notificationDate: '2023-05-09T13:22:19.001Z',
      deliveryDetailCode: 'RECRN001B',
      attachments: [
        {
          id: 'RPTH-YULD-WKMA-202305-T-1DOCMock_1|UaMdYj7cAVO6EZTC9ddUBD7pbkG6zdEZ0LaL/3cmphU=',
          documentType: 'AR',
          url: 'PN_EXTERNAL_LEGAL_FACTS-2e53ade5875b4e77a242103e7db6ddc4.pdf',
        },
      ],
      sendRequestId: 'SEND_ANALOG_DOMICILE.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.ATTEMPT_0',
      registeredLetterCode: 'bcaf92f26c634eb08a5ece4633117816',
    },
  },
  {
    elementId: 'SEND_ANALOG_FEEDBACK.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.ATTEMPT_0',
    timestamp: '2023-05-09T13:22:25.001Z',
    legalFactsIds: [],
    category: TimelineCategory.SEND_ANALOG_FEEDBACK,
    details: {
      recIndex: 1,
      physicalAddress: {
        at: '',
        address: 'VIA MESSI 2022',
        addressDetails: '',
        zip: '98036',
        municipality: 'GRANITI',
        municipalityDetails: '',
        province: 'MESSINA',
        foreignState: 'ITALIA',
      },
      sentAttemptMade: 0,
      responseStatus: 'OK',
      notificationDate: '2023-05-09T13:22:25.001Z',
      deliveryDetailCode: 'RECRN001C',
      serviceLevel: PhysicalCommunicationType.AR_REGISTERED_LETTER,
      sendRequestId: 'SEND_ANALOG_DOMICILE.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.ATTEMPT_0',
      registeredLetterCode: 'bcaf92f26c634eb08a5ece4633117816',
    } as AnalogDetails,
  },
  {
    elementId: 'ANALOG_SUCCESS_WORKFLOW.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0',
    timestamp: '2023-05-09T13:22:27.156517343Z',
    legalFactsIds: [],
    category: TimelineCategory.ANALOG_SUCCESS_WORKFLOW,
    details: {
      recIndex: 1,
      physicalAddress: {
        at: '',
        address: 'VIA MESSI 2022',
        addressDetails: '',
        zip: '98036',
        municipality: 'GRANITI',
        municipalityDetails: '',
        province: 'MESSINA',
        foreignState: 'ITALIA',
      },
    },
  },
  {
    elementId: 'SCHEDULE_REFINEMENT_WORKFLOW.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0',
    timestamp: '2023-05-09T13:22:27.251102669Z',
    legalFactsIds: [],
    category: TimelineCategory.SCHEDULE_REFINEMENT,
    details: {
      recIndex: 1,
    },
  },
  {
    elementId: 'NOTIFICATION_PAID.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_1',
    timestamp: '2023-05-10T12:00:27.251102669Z',
    legalFactsIds: [],
    category: TimelineCategory.PAYMENT,
    details: {
      recIndex: 1,
      recipientType: RecipientType.PG,
      creditorTaxId: '77777777777',
      noticeCode: '302011686772695132',
      paymentSourceChannel: 'EXTERNAL_REGISTRY',
      notificationDate: '2023-08-23T07:45:25Z',
      deliveryDetailCode: 'RECRN001C',
      serviceLevel: 'AR_REGISTERED_LETTER',
      sendRequestId: 'SEND_ANALOG_DOMICILE.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_1.ATTEMPT_0',
      registeredLetterCode: '646577041cdc46a59ad86cd4033e4921',
    } as SendPaperDetails,
  },
];

export const recipients: Array<NotificationDetailRecipient> = [
  {
    recipientType: RecipientType.PF,
  } as NotificationDetailRecipient,
  {
    recipientType: RecipientType.PG,
    taxId: '70412331207',
    denomination: 'Divina Commedia',
    physicalAddress: {
      at: '',
      address: 'VIA MESSI 2022',
      addressDetails: '',
      zip: '98036',
      municipality: 'GRANITI',
      municipalityDetails: '',
      province: 'MESSINA',
      foreignState: 'ITALIA',
    },
    payments,
  },
  {
    recipientType: RecipientType.PG,
  } as NotificationDetailRecipient,
];

export const notificationDTO: NotificationDetail = {
  abstract: 'Dritto devi andare!',
  paProtocolNumber: '3801',
  subject: 'Inadequatezza nel camminare',
  recipients,
  documents: [
    {
      digests: {
        sha256: '7f3Nr8Yhkv4tH40iOrtMr4Y9fPR0vmCCt9BIwvH8fxs=',
      },
      contentType: 'application/pdf',
      ref: {
        key: 'PN_NOTIFICATION_ATTACHMENTS-c433d019acaa485288974021237beb8e.pdf',
        versionToken: 'l0pwhTshqzIIdVKnCqiV1BlQBZA_LC7r',
      },
      title: 'RATA SCADUTA IMU',
      docIdx: '0',
    },
  ],
  notificationFeePolicy: NotificationFeePolicy.FLAT_RATE,
  physicalCommunicationType: PhysicalCommunicationType.AR_REGISTERED_LETTER,
  senderDenomination: 'Comune di Palermo',
  senderTaxId: '80016350821',
  group: '63f359bc72337440a40f537e',
  senderPaId: '5b994d4a-0fa8-47ac-9c7b-354f1d44a1ce',
  iun: 'RPTH-YULD-WKMA-202305-T-1',
  sentAt: '2023-05-09T13:17:31.401700947Z',
  documentsAvailable: true,
  notificationStatus: NotificationStatus.VIEWED,
  notificationStatusHistory: statusHistory,
  timeline,
};

export const cancelledNotificationDTO: NotificationDetail = {
  ...notificationDTO,
  notificationStatus: NotificationStatus.CANCELLED,
  timeline: [
    ...notificationDTO.timeline,
    {
      elementId: 'NOTIFICATION_CANCELLED.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_1',
      timestamp: '2023-05-09T18:42:27.109686054Z',
      category: TimelineCategory.NOTIFICATION_CANCELLED,
      details: {
        recIndex: 1,
      },
    },
  ],
  notificationStatusHistory: [
    ...notificationDTO.notificationStatusHistory,
    {
      status: NotificationStatus.CANCELLED,
      activeFrom: '2023-05-09T18:42:27.109686054Z',
      relatedTimelineElements: ['NOTIFICATION_CANCELLED.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_1'],
    },
  ],
};

export const paymentsData: PaymentsData = {
  pagoPaF24: getPagoPaF24Payments(payments),
  f24Only: getF24Payments(payments),
};

export const notificationToFe = parseNotificationDetailForRecipient(_.cloneDeep(notificationDTO));

export const overrideNotificationMock = (overrideObj: object): NotificationDetail => {
  const notification = { ...notificationDTO, ...overrideObj };
  return parseNotificationDetailForRecipient(notification);
};

export const cancelledNotificationToFe = parseNotificationDetailForRecipient(
  _.cloneDeep(cancelledNotificationDTO)
);
