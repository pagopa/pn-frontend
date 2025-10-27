import * as _ from 'lodash-es';

import {
  INotificationDetailTimeline,
  LegalFactType,
  NotificationDetail,
  NotificationDetailPayment,
  NotificationDetailRecipient,
  NotificationStatus,
  NotificationStatusHistory,
  PaymentCache,
  PaymentsData,
  PhysicalCommunicationType,
  RecipientType,
  ResponseStatus,
  TimelineCategory,
  getF24Payments,
  getPagoPaF24Payments,
  populatePaymentsPagoPaF24,
} from '@pagopa-pn/pn-commons';

import { parseNotificationDetailForRecipient } from '../utility/notification.utility';
import { paymentInfo } from './ExternalRegistry.mock';

export const payments: Array<NotificationDetailPayment> = [
  {
    pagoPa: {
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
    pagoPa: {
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
    pagoPa: {
      creditorTaxId: '77777777777',
      noticeCode: '302011686772695134',
      applyCost: false,
    },
  },
  {
    pagoPa: {
      creditorTaxId: '77777777777',
      noticeCode: '302011686772695135',
      applyCost: false,
    },
  },
  {
    pagoPa: {
      creditorTaxId: '77777777777',
      noticeCode: '302011686772695136',
      applyCost: true,
    },
  },
  {
    pagoPa: {
      creditorTaxId: '77777777777',
      noticeCode: '302011686772695137',
      applyCost: true,
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
    steps: [
      {
        elementId: 'SCHEDULE_REFINEMENT_WORKFLOW.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0',
        timestamp: '2023-05-09T13:22:27.251102669Z',
        legalFactsIds: [],
        category: TimelineCategory.SCHEDULE_REFINEMENT,
        details: {
          recIndex: 1,
        },
        index: 15,
        hidden: true,
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
        index: 14,
        hidden: true,
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
          responseStatus: ResponseStatus.OK,
          deliveryDetailCode: 'RECRN001C',
          serviceLevel: PhysicalCommunicationType.AR_REGISTERED_LETTER,
          sendRequestId: 'SEND_ANALOG_DOMICILE.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.ATTEMPT_0',
          registeredLetterCode: 'bcaf92f26c634eb08a5ece4633117816',
        },
        index: 13,
        hidden: false,
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
        index: 12,
        hidden: false,
      },
      {
        elementId: 'SEND_ANALOG_PROGRESS.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.ATTEMPT_0.IDX_1',
        timestamp: '2023-05-09T13:22:10.001Z',
        legalFactsIds: [],
        category: TimelineCategory.SEND_ANALOG_PROGRESS,
        details: {
          recIndex: 1,
          deliveryDetailCode: 'CON080',
          sendRequestId: 'SEND_ANALOG_DOMICILE.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.ATTEMPT_0',
          registeredLetterCode: 'bcaf92f26c634eb08a5ece4633117816',
        },
        index: 11,
        hidden: false,
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
        index: 10,
        hidden: true,
      },
    ],
  },
  {
    status: NotificationStatus.DELIVERING,
    activeFrom: '2023-05-09T13:22:02.736668855Z',
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
      'SEND_ANALOG_DOMICILE.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.ATTEMPT_0',
    ],
    steps: [
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
          serviceLevel: PhysicalCommunicationType.AR_REGISTERED_LETTER,
          productType: 'AR',
        },
        index: 9,
        hidden: false,
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
          serviceLevel: PhysicalCommunicationType.AR_REGISTERED_LETTER,
        },
        index: 8,
        hidden: true,
      },
      {
        elementId: 'SCHEDULE_ANALOG_WORKFLOW.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0',
        timestamp: '2023-05-09T13:21:45.986098643Z',
        legalFactsIds: [],
        category: TimelineCategory.SCHEDULE_ANALOG_WORKFLOW,
        details: {
          recIndex: 1,
        },
        index: 7,
        hidden: true,
      },
      {
        elementId: 'GET_ADDRESS.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.SOURCE_GENERAL.ATTEMPT_0',
        timestamp: '2023-05-09T13:21:45.961667427Z',
        legalFactsIds: [],
        category: TimelineCategory.GET_ADDRESS,
        details: {
          recIndex: 1,
        },
        index: 6,
        hidden: true,
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
        index: 5,
        hidden: true,
      },
      {
        elementId:
          'NATIONAL_REGISTRY_CALL.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.DELIVERYMODE_DIGITAL.CONTACTPHASE_CHOOSE_DELIVERY.ATTEMPT_0',
        timestamp: '2023-05-09T13:20:29.876161477Z',
        legalFactsIds: [],
        category: TimelineCategory.PUBLIC_REGISTRY_CALL,
        details: {
          recIndex: 1,
        },
        index: 4,
        hidden: true,
      },
      {
        elementId: 'GET_ADDRESS.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.SOURCE_SPECIAL.ATTEMPT_0',
        timestamp: '2023-05-09T13:20:29.761493263Z',
        legalFactsIds: [],
        category: TimelineCategory.GET_ADDRESS,
        details: {
          recIndex: 1,
        },
        index: 3,
        hidden: true,
      },
      {
        elementId: 'GET_ADDRESS.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.SOURCE_PLATFORM.ATTEMPT_0',
        timestamp: '2023-05-09T13:20:29.739081206Z',
        legalFactsIds: [],
        category: TimelineCategory.GET_ADDRESS,
        details: {
          recIndex: 1,
        },
        index: 2,
        hidden: true,
      },
      {
        elementId: 'AAR_GEN.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0',
        timestamp: '2023-05-09T13:19:59.460058075Z',
        legalFactsIds: [],
        category: TimelineCategory.AAR_GENERATION,
        details: {
          recIndex: 1,
        },
        index: 1,
        hidden: true,
      },
      {
        elementId: 'REQUEST_ACCEPTED.IUN_RPTH-YULD-WKMA-202305-T-1',
        timestamp: '2023-05-09T13:18:59.380111301Z',
        legalFactsIds: [],
        category: TimelineCategory.REQUEST_ACCEPTED,
        details: {},
        index: 0,
        hidden: true,
      },
    ],
  },
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
    steps: [
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
          serviceLevel: PhysicalCommunicationType.AR_REGISTERED_LETTER,
        },
        index: 8,
        hidden: true,
      },
      {
        elementId: 'SCHEDULE_ANALOG_WORKFLOW.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0',
        timestamp: '2023-05-09T13:21:45.986098643Z',
        legalFactsIds: [],
        category: TimelineCategory.SCHEDULE_ANALOG_WORKFLOW,
        details: {
          recIndex: 1,
        },
        index: 7,
        hidden: true,
      },
      {
        elementId: 'GET_ADDRESS.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.SOURCE_GENERAL.ATTEMPT_0',
        timestamp: '2023-05-09T13:21:45.961667427Z',
        legalFactsIds: [],
        category: TimelineCategory.GET_ADDRESS,
        details: {
          recIndex: 1,
        },
        index: 6,
        hidden: true,
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
        index: 5,
        hidden: true,
      },
      {
        elementId:
          'NATIONAL_REGISTRY_CALL.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.DELIVERYMODE_DIGITAL.CONTACTPHASE_CHOOSE_DELIVERY.ATTEMPT_0',
        timestamp: '2023-05-09T13:20:29.876161477Z',
        legalFactsIds: [],
        category: TimelineCategory.PUBLIC_REGISTRY_CALL,
        details: {
          recIndex: 1,
        },
        index: 4,
        hidden: true,
      },
      {
        elementId: 'GET_ADDRESS.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.SOURCE_SPECIAL.ATTEMPT_0',
        timestamp: '2023-05-09T13:20:29.761493263Z',
        legalFactsIds: [],
        category: TimelineCategory.GET_ADDRESS,
        details: {
          recIndex: 1,
        },
        index: 3,
        hidden: true,
      },
      {
        elementId: 'GET_ADDRESS.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.SOURCE_PLATFORM.ATTEMPT_0',
        timestamp: '2023-05-09T13:20:29.739081206Z',
        legalFactsIds: [],
        category: TimelineCategory.GET_ADDRESS,
        details: {
          recIndex: 1,
        },
        index: 2,
        hidden: true,
      },
      {
        elementId: 'AAR_GEN.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0',
        timestamp: '2023-05-09T13:19:59.460058075Z',
        legalFactsIds: [],
        category: TimelineCategory.AAR_GENERATION,
        details: {
          recIndex: 1,
        },
        index: 1,
        hidden: true,
      },
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
        index: 0,
        hidden: true,
      },
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
    index: 0,
    hidden: true,
  },
  {
    elementId: 'AAR_GEN.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0',
    timestamp: '2023-05-09T13:19:59.460058075Z',
    legalFactsIds: [],
    category: TimelineCategory.AAR_GENERATION,
    details: {
      recIndex: 1,
    },
    index: 1,
    hidden: true,
  },
  {
    elementId: 'GET_ADDRESS.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.SOURCE_PLATFORM.ATTEMPT_0',
    timestamp: '2023-05-09T13:20:29.739081206Z',
    legalFactsIds: [],
    category: TimelineCategory.GET_ADDRESS,
    details: {
      recIndex: 1,
    },
    index: 2,
    hidden: true,
  },
  {
    elementId: 'GET_ADDRESS.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.SOURCE_SPECIAL.ATTEMPT_0',
    timestamp: '2023-05-09T13:20:29.761493263Z',
    legalFactsIds: [],
    category: TimelineCategory.GET_ADDRESS,
    details: {
      recIndex: 1,
    },
    index: 3,
    hidden: true,
  },
  {
    elementId:
      'NATIONAL_REGISTRY_CALL.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.DELIVERYMODE_DIGITAL.CONTACTPHASE_CHOOSE_DELIVERY.ATTEMPT_0',
    timestamp: '2023-05-09T13:20:29.876161477Z',
    legalFactsIds: [],
    category: TimelineCategory.PUBLIC_REGISTRY_CALL,
    details: {
      recIndex: 1,
    },
    index: 4,
    hidden: true,
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
    index: 5,
    hidden: true,
  },
  {
    elementId: 'GET_ADDRESS.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.SOURCE_GENERAL.ATTEMPT_0',
    timestamp: '2023-05-09T13:21:45.961667427Z',
    legalFactsIds: [],
    category: TimelineCategory.GET_ADDRESS,
    details: {
      recIndex: 1,
    },
    index: 6,
    hidden: true,
  },
  {
    elementId: 'SCHEDULE_ANALOG_WORKFLOW.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0',
    timestamp: '2023-05-09T13:21:45.986098643Z',
    legalFactsIds: [],
    category: TimelineCategory.SCHEDULE_ANALOG_WORKFLOW,
    details: {
      recIndex: 1,
    },
    index: 7,
    hidden: true,
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
      serviceLevel: PhysicalCommunicationType.AR_REGISTERED_LETTER,
    },
    index: 8,
    hidden: true,
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
      serviceLevel: PhysicalCommunicationType.AR_REGISTERED_LETTER,
      productType: 'AR',
    },
    index: 9,
    hidden: false,
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
    index: 10,
    hidden: true,
  },
  {
    elementId: 'SEND_ANALOG_PROGRESS.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.ATTEMPT_0.IDX_1',
    timestamp: '2023-05-09T13:22:10.001Z',
    legalFactsIds: [],
    category: TimelineCategory.SEND_ANALOG_PROGRESS,
    details: {
      recIndex: 1,
      deliveryDetailCode: 'CON080',
      sendRequestId: 'SEND_ANALOG_DOMICILE.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.ATTEMPT_0',
      registeredLetterCode: 'bcaf92f26c634eb08a5ece4633117816',
    },
    index: 11,
    hidden: false,
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
    index: 12,
    hidden: false,
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
      responseStatus: ResponseStatus.OK,
      deliveryDetailCode: 'RECRN001C',
      serviceLevel: PhysicalCommunicationType.AR_REGISTERED_LETTER,
      sendRequestId: 'SEND_ANALOG_DOMICILE.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0.ATTEMPT_0',
      registeredLetterCode: 'bcaf92f26c634eb08a5ece4633117816',
    },
    index: 13,
    hidden: false,
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
    index: 14,
    hidden: true,
  },
  {
    elementId: 'SCHEDULE_REFINEMENT_WORKFLOW.IUN_RPTH-YULD-WKMA-202305-T-1.RECINDEX_0',
    timestamp: '2023-05-09T13:22:27.251102669Z',
    legalFactsIds: [],
    category: TimelineCategory.SCHEDULE_REFINEMENT,
    details: {
      recIndex: 1,
    },
    index: 15,
    hidden: true,
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
      amount: 8000,
    },
    index: 16,
    hidden: true,
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
  senderDenomination: 'Comune di Palermo',
  group: '63f359bc72337440a40f537e',
  iun: 'RPTH-YULD-WKMA-202305-T-1',
  sentAt: '2023-05-09T13:17:31.401700947Z',
  documentsAvailable: true,
  notificationStatus: NotificationStatus.VIEWED,
  notificationStatusHistory: statusHistory,
  timeline,
  otherDocuments: [
    {
      recIndex: 1,
      documentId: 'PN_AAR-7b9cfda7870346248daf669191ec2cf1.pdf',
      documentType: 'AAR',
      title: 'Avviso di avvenuta ricezione',
      digests: {
        sha256: '',
      },
      ref: {
        key: '',
        versionToken: '',
      },
      contentType: '',
    },
  ],
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
  pagoPaF24: getPagoPaF24Payments(payments, 1),
  f24Only: getF24Payments(payments, 1),
};

export const notificationToFe = parseNotificationDetailForRecipient(_.cloneDeep(notificationDTO));

export const overrideNotificationMock = (overrideObj: object): NotificationDetail => {
  const notification = { ...notificationDTO, ...overrideObj };
  return parseNotificationDetailForRecipient(notification);
};

export const cancelledNotificationToFe = parseNotificationDetailForRecipient(
  _.cloneDeep(cancelledNotificationDTO)
);

export const cachedPayments: PaymentCache = {
  iun: notificationDTO.iun,
  timestamp: new Date().toISOString(),
  currentPaymentPage: 0,
  payments: populatePaymentsPagoPaF24(
    notificationDTO.timeline,
    paymentsData.pagoPaF24,
    paymentInfo
  ),
};

export const raddNotificationDTO: NotificationDetail = {
  ...notificationDTO,
  timeline: [
    ...notificationDTO.timeline,
    {
      elementId: 'NOTIFICATION_RADD_RETRIEVED_mock',
      timestamp: '2022-06-21T11:44:28Z',
      legalFactsIds: [],
      category: TimelineCategory.NOTIFICATION_RADD_RETRIEVED,
      details: {
        recIndex: 1,
        eventTimestamp: '2022-06-21T11:44:28Z',
      },
    },
  ],
  radd: {
    elementId: 'NOTIFICATION_RADD_RETRIEVED_mock',
    timestamp: '2022-06-21T11:44:28Z',
    legalFactsIds: [],
    category: TimelineCategory.NOTIFICATION_RADD_RETRIEVED,
    details: {
      recIndex: 1,
      eventTimestamp: '2022-06-21T11:44:28Z',
    },
  },
};
