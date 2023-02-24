import { AxiosResponse } from 'axios';
import {
  DigitalDomicileType,
  formatDate,
  GetNotificationsParams,
  GetNotificationsResponse,
  LegalFactId,
  LegalFactType,
  NotificationDetail,
  NotificationDetailOtherDocument,
  NotificationFeePolicy,
  NotificationStatus,
  parseNotificationDetail,
  PhysicalCommunicationType,
  RecipientType,
  TimelineCategory,
} from '@pagopa-pn/pn-commons';

import { NewNotificationDTO, NewNotificationResponse } from '../../models/NewNotification';
import { GroupStatus, UserGroup } from '../../models/user';
import { apiClient, externalClient } from '../apiClients';
import {
  CREATE_NOTIFICATION,
  NOTIFICATIONS_LIST,
  NOTIFICATION_DETAIL,
  NOTIFICATION_DETAIL_DOCUMENTS,
  NOTIFICATION_DETAIL_LEGALFACT,
  NOTIFICATION_PRELOAD_DOCUMENT,
  GET_USER_GROUPS,
  NOTIFICATION_DETAIL_OTHER_DOCUMENTS,
} from './notifications.routes';


function mockedNotificationDetail(): any { 
  return {
    "abstract": "Dritto devi andare!",
    "paProtocolNumber": "3473",
    "subject": "Inadequatezza nel camminare",
    "recipients": [
      {
        "recipientType": RecipientType.PF,
        "taxId": "LVLDAA85T50G702B",
        "internalId": "PF-b32e4920-6ff3-4872-8018-d60a4e5827f9",
        "denomination": "Ada Lovelace",
        "digitalDomicile": {
          "type": DigitalDomicileType.PEC,
          "address": "bel-indirizzo@coso.local.24680357"
        },
        "physicalAddress": {
          "at": "",
          "address": "Via Rosas 1829",
          "addressDetails": "",
          "zip": "98036",
          "municipality": "Graniti",
          "municipalityDetails": "",
          "province": "Messina",
          "foreignState": "Italia"
        }
      },
      {
        "recipientType": RecipientType.PF,
        "taxId": "CLMCST42R12D969Z",
        "internalId": "PF-a6c1350d-1d69-4209-8bf8-31de58c79d6e",
        "denomination": "Mario Gherkin",
        "digitalDomicile": {
          "type": DigitalDomicileType.PEC,
          "address": "testpagopa2@pnpagopa.postecert.local"
        },
        "physicalAddress": {
          "at": "Presso",
          "address": "Via senza nome",
          "zip": "40100",
          "municipality": "Milano",
          "municipalityDetails": "Milano",
          "province": "MI",
          "foreignState": "ITALIA"
        },
      },
    ],
    "documents": [
      {
        "digests": {
          "sha256": "F40YJSDrDCLS2iI2L8odiAB1O+JHhAbxNarrhSBQLr8="
        },
        "contentType": "application/pdf",
        "ref": {
          "key": "PN_NOTIFICATION_ATTACHMENTS-0001-Y8QB-T2LQ-0HA4-1FQ0",
          "versionToken": "pYA8W0.wYZzHPlF8Wu86gk_evlozdyUK"
        },
        "title": "Atto primo",
        "docIdx": "0"
      }
    ],
    "notificationFeePolicy": NotificationFeePolicy.FLAT_RATE,
    "physicalCommunicationType": PhysicalCommunicationType.AR_REGISTERED_LETTER,
    "senderDenomination": "Comune di Palermo",
    "senderTaxId": "80016350821",
    "group": "",
    "taxonomyCode": "010102P",
    "senderPaId": "5b994d4a-0fa8-47ac-9c7b-354f1d44a1ce",
    "iun": "KQKX-WMDW-GDMU-202301-L-1",
    "sentAt": "2023-01-26T13:54:47.18027307Z",
    "documentsAvailable": true,
    "notificationStatus": NotificationStatus.DELIVERING,
    "notificationStatusHistory": [
      {
        "status": NotificationStatus.ACCEPTED,
        "activeFrom": "2023-01-26T13:54:47.18027307Z",
        "relatedTimelineElements": [
          "KQKX-WMDW-GDMU-202301-L-1_request_accepted",
          "KQKX-WMDW-GDMU-202301-L-1_aar_gen_0",
          "KQKX-WMDW-GDMU-202301-L-1_send_courtesy_message_0_index_0",
          "KQKX-WMDW-GDMU-202301-L-1_send_courtesy_message_0_index_1",
          "KQKX-WMDW-GDMU-202301-L-1_get_address_0_source_PLATFORM_attempt_0"
        ]
      },
      {
        "status": NotificationStatus.DELIVERING,
        "activeFrom": "2023-01-26T13:55:52.651901435Z",
        "relatedTimelineElements": [
          // recipient 0 - first attempt
          "KQKX-WMDW-GDMU-202301-L-1_send_digital_domicile_0_source_PLATFORM_attempt_0",
          "KQKX-WMDW-GDMU-202301-L-1_digital_delivering_progress_0_source_PLATFORM_attempt_0_progidx_1",
          // "KQKX-WMDW-GDMU-202301-L-1_send_digital_feedback_0_source_PLATFORM_attempt_0",
          "KQKX-WMDW-GDMU-202301-L-1_schedule_digital_workflow_0_source_PLATFORM_retry_0",
          // recipient 1 - first attempt
          "KQKX-WMDW-GDMU-202301-L-1_send_digital_domicile_1_source_PLATFORM_attempt_0",
          "KQKX-WMDW-GDMU-202301-L-1_digital_delivering_progress_1_source_PLATFORM_attempt_0_progidx_1",
          "KQKX-WMDW-GDMU-202301-L-1_send_digital_feedback_1_source_PLATFORM_attempt_0",
          "KQKX-WMDW-GDMU-202301-L-1_schedule_digital_workflow_1_source_PLATFORM_retry_0",
          // recipient 0 - second attempt
          "KQKX-WMDW-GDMU-202301-L-1_send_digital_domicile_0_source_PLATFORM_attempt_1",
          "KQKX-WMDW-GDMU-202301-L-1_digital_delivering_progress_0_source_PLATFORM_attempt_1_progidx_1",
          "KQKX-WMDW-GDMU-202301-L-1_send_digital_feedback_0_source_PLATFORM_attempt_1",
          // recipient 1 - second attempt
          "KQKX-WMDW-GDMU-202301-L-1_send_digital_domicile_1_source_PLATFORM_attempt_1",
          "KQKX-WMDW-GDMU-202301-L-1_digital_delivering_progress_1_source_PLATFORM_attempt_1_progidx_1",
          "KQKX-WMDW-GDMU-202301-L-1_send_digital_feedback_1_source_PLATFORM_attempt_1",
        ]
      },
      {
        "status": NotificationStatus.DELIVERED,
        "activeFrom": "2023-01-26T14:16:12.42843144Z",
        "relatedTimelineElements": [
          // digital outcome - recipient 0
          "KQKX-WMDW-GDMU-202301-L-1_digital_failure_workflow_0",
          "KQKX-WMDW-GDMU-202301-L-1_schedule_refinement_workflow_0",
          "KQKX-WMDW-GDMU-202301-L-1_prepare_simple_registered_letter_0",
          "KQKX-WMDW-GDMU-202301-L-1_send_simple_registered_letter_0",
          // digital outcome - recipient 1
          "KQKX-WMDW-GDMU-202301-L-1_digital_failure_workflow_1",
          "KQKX-WMDW-GDMU-202301-L-1_schedule_refinement_workflow_1",
          "KQKX-WMDW-GDMU-202301-L-1_prepare_simple_registered_letter_1",
          "KQKX-WMDW-GDMU-202301-L-1_send_simple_registered_letter_1",
        ]
      },
      {
        "status": NotificationStatus.EFFECTIVE_DATE,
        "activeFrom": "2023-01-26T14:31:23.333432372Z",
        "relatedTimelineElements": ["KQKX-WMDW-GDMU-202301-L-1_refinement_0"]
      },
      {
        "status": NotificationStatus.VIEWED,
        "activeFrom": "2023-01-27T12:14:23.357127847Z",
        "relatedTimelineElements": [
          "KQKX-WMDW-GDMU-202301-L-1_notification_viewed_0"
        ]
      }
    ],
    "timeline": [
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_request_accepted",
        "timestamp": "2023-01-26T13:55:15.975574085Z",
        "legalFactsIds": [
          {
            "key": "safestorage://PN_LEGAL_FACTS-0002-Y8NU-81RH-MWBB-RJ71",
            "category": LegalFactType.SENDER_ACK,
          }
        ],
        "details": {
        },
        "category": TimelineCategory.REQUEST_ACCEPTED
      },
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_aar_gen_0",
        "timestamp": "2023-01-26T13:55:22.715640353Z",
        "legalFactsIds": [],
        "category": TimelineCategory.AAR_GENERATION,
        "details": {
          "recIndex": 0,
          "numberOfPages": 1,
          "generatedAarUrl": "safestorage://PN_AAR-0002-GO6M-7RQG-8PB7-YAER"
        }
      },
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_send_courtesy_message_0_index_0",
        "timestamp": "2023-01-26T13:55:22.816736941Z",
        "legalFactsIds": [],
        "category": TimelineCategory.SEND_COURTESY_MESSAGE,
        "details": {
          "recIndex": 0,
          "digitalAddress": {
            "type": "EMAIL",
            "address": "manudido99@gmail.com"
          },
          "sendDate": "2023-01-26T13:55:22.816723695Z"
        }
      },
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_send_courtesy_message_0_index_1",
        "timestamp": "2023-01-26T13:55:22.881938714Z",
        "legalFactsIds": [],
        "category": TimelineCategory.SEND_COURTESY_MESSAGE,
        "details": {
          "recIndex": 0,
          "digitalAddress": {
            "type": "SMS",
            "address": "+3912345678912"
          },
          "sendDate": "2023-01-26T13:55:22.881927028Z"
        }
      },
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_get_address_0_source_PLATFORM_attempt_0",
        "timestamp": "2023-01-26T13:55:52.597019182Z",
        "legalFactsIds": [],
        "category": TimelineCategory.GET_ADDRESS,
        "details": {
          "recIndex": 0,
          "digitalAddressSource": "PLATFORM",
          "isAvailable": true,
          "attemptDate": "2023-01-26T13:55:52.597018417Z"
        }
      },
      // first send attempt - recipient 0
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_send_digital_domicile_0_source_PLATFORM_attempt_0",
        "timestamp": "2023-01-26T13:55:52.651901435Z",
        "legalFactsIds": [],
        "category": TimelineCategory.SEND_DIGITAL_DOMICILE,
        "details": {
          "recIndex": 0,
          "digitalAddress": { "type": "PEC", "address": "manudido99@gmail.com" },
          "digitalAddressSource": "PLATFORM",
          "retryNumber": 0
        }
      },
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_digital_delivering_progress_0_source_PLATFORM_attempt_0_progidx_1",
        "timestamp": "2023-01-26T13:56:05.000870007Z",
        "legalFactsIds": [
          { "key": "safestorage://PN_EXTERNAL_LEGAL_FACTS-0003-T9NR-EZKL-5V5A-WUAM", "category": LegalFactType.PEC_RECEIPT, }
        ],
        "category": TimelineCategory.SEND_DIGITAL_PROGRESS,
        "details": {
          "recIndex": 0,
          "digitalAddress": { "type": "PEC", "address": "manudido99@gmail.com" },
          "digitalAddressSource": "PLATFORM",
          "retryNumber": 0,
          "notificationDate": "2023-01-26T13:56:06.224667703Z",
          "sendingReceipts": [{}],
          "eventCode": "C008",
          "shouldRetry": false
        }
      },
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_send_digital_feedback_0_source_PLATFORM_attempt_0",
        "timestamp": "2023-01-26T13:56:15.001161877Z",
        "legalFactsIds": [
          { "key": "safestorage://PN_EXTERNAL_LEGAL_FACTS-0003-VXMT-20MV-CBBU-X5MR", "category": LegalFactType.PEC_RECEIPT }
        ],
        "category": TimelineCategory.SEND_DIGITAL_FEEDBACK,
        "details": {
          "recIndex": 0,
          "digitalAddress": { "type": "PEC", "address": "manudido99@gmail.com" },
          "digitalAddressSource": "PLATFORM",
          "responseStatus": "KO",
          "notificationDate": "2023-01-26T13:56:15.001161877Z",
          "sendingReceipts": [{}]
        }
      },
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_schedule_digital_workflow_0_source_PLATFORM_retry_0",
        "timestamp": "2023-01-26T13:57:34.001161877Z",
        "legalFactsIds": [],
        "category": TimelineCategory.SCHEDULE_DIGITAL_WORKFLOW,
        "details": {
            "recIndex": 0,
            "digitalAddressSource": "PLATFORM",
            "sentAttemptMade": 0,
            "lastAttemptDate": "2023-02-08T17:08:10.95299597Z"
        }
      },
      // first send attempt - recipient 1
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_send_digital_domicile_1_source_PLATFORM_attempt_0",
        "timestamp": "2023-01-26T13:58:02.651901435Z",
        "legalFactsIds": [],
        "category": TimelineCategory.SEND_DIGITAL_DOMICILE,
        "details": {
          "recIndex": 1,
          "digitalAddress": { "type": "PEC", "address": "toto45@gmail.com" },
          "digitalAddressSource": "PLATFORM",
          "retryNumber": 0
        }
      },
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_digital_delivering_progress_1_source_PLATFORM_attempt_0_progidx_1",
        "timestamp": "2023-01-26T13:58:05.000870007Z",
        "legalFactsIds": [
          { "key": "safestorage://PN_EXTERNAL_LEGAL_FACTS-0003-T9NR-EZKL-5V5A-WUAM", "category": LegalFactType.PEC_RECEIPT, }
        ],
        "category": TimelineCategory.SEND_DIGITAL_PROGRESS,
        "details": {
          "recIndex": 1,
          "digitalAddress": { "type": "PEC", "address": "toto45@gmail.com" },
          "digitalAddressSource": "PLATFORM",
          "retryNumber": 0,
          "notificationDate": "2023-01-26T13:56:06.224667703Z",
          "sendingReceipts": [{}],
          "eventCode": "C001",
          "shouldRetry": false
        }
      },
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_send_digital_feedback_1_source_PLATFORM_attempt_0",
        "timestamp": "2023-01-26T13:58:15.001161877Z",
        "legalFactsIds": [
          { "key": "safestorage://PN_EXTERNAL_LEGAL_FACTS-0003-VXMT-20MV-CBBU-X5MR", "category": LegalFactType.PEC_RECEIPT }
        ],
        "category": TimelineCategory.SEND_DIGITAL_FEEDBACK,
        "details": {
          "recIndex": 1,
          "digitalAddress": { "type": "PEC", "address": "toto45@gmail.com" },
          "digitalAddressSource": "PLATFORM",
          "responseStatus": "KO",
          "notificationDate": "2023-01-26T13:56:15.001161877Z",
          "sendingReceipts": [{}]
        }
      },
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_schedule_digital_workflow_1_source_PLATFORM_retry_0",
        "timestamp": "2023-01-26T13:59:34.001161877Z",
        "legalFactsIds": [],
        "category": TimelineCategory.SCHEDULE_DIGITAL_WORKFLOW,
        "details": {
            "recIndex": 1,
            "digitalAddressSource": "PLATFORM",
            "sentAttemptMade": 0,
            "lastAttemptDate": "2023-02-08T17:08:10.95299597Z"
        }
      },
      // second send attempt - recipient 0
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_send_digital_domicile_0_source_PLATFORM_attempt_1",
        "timestamp": "2023-01-26T14:05:40.651901435Z",
        "legalFactsIds": [],
        "category": TimelineCategory.SEND_DIGITAL_DOMICILE,
        "details": {
          "recIndex": 0,
          "digitalAddress": { "type": "PEC", "address": "manudido86@gmail.com" },
          "digitalAddressSource": "PLATFORM",
          "retryNumber": 1
        }
      },
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_digital_delivering_progress_0_source_PLATFORM_attempt_1_progidx_1",
        "timestamp": "2023-01-26T14:05:42.000870007Z",
        "legalFactsIds": [
          {
            "key": "safestorage://PN_EXTERNAL_LEGAL_FACTS-0003-T9NR-EZKL-5V5A-WUAM",
            "category": LegalFactType.PEC_RECEIPT,
          }
        ],
        "category": TimelineCategory.SEND_DIGITAL_PROGRESS,
        "details": {
          "recIndex": 0,
          "digitalAddress": {
            "type": "PEC",
            "address": "manudido86@gmail.com"
          },
          "digitalAddressSource": "PLATFORM",
          "retryNumber": 1,
          "notificationDate": "2023-01-26T13:57:41.224667703Z",
          "sendingReceipts": [{}],
          "eventCode": "C001",
          "shouldRetry": false
        }
      },
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_send_digital_feedback_0_source_PLATFORM_attempt_1",
        "timestamp": "2023-01-26T14:05:44.001161877Z",
        "legalFactsIds": [
          {
            "key": "safestorage://PN_EXTERNAL_LEGAL_FACTS-0003-VXMT-20MV-CBBU-X5MR",
            "category": LegalFactType.PEC_RECEIPT
          }
        ],
        "category": TimelineCategory.SEND_DIGITAL_FEEDBACK,
        "details": {
          "recIndex": 0,
          "digitalAddress": {
            "type": "PEC",
            "address": "manudido86@gmail.com"
          },
          "digitalAddressSource": "PLATFORM",
          "responseStatus": "KO",
          "notificationDate": "2023-01-26T13:57:43.001161877Z",
          "sendingReceipts": [{}]
        }
      },
      // second send attempt - recipient 1
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_send_digital_domicile_1_source_PLATFORM_attempt_1",
        "timestamp": "2023-01-26T14:10:40.651901435Z",
        "legalFactsIds": [],
        "category": TimelineCategory.SEND_DIGITAL_DOMICILE,
        "details": {
          "recIndex": 1,
          "digitalAddress": { "type": "PEC", "address": "toto93@gmail.com" },
          "digitalAddressSource": "PLATFORM",
          "retryNumber": 1
        }
      },
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_digital_delivering_progress_1_source_PLATFORM_attempt_1_progidx_1",
        "timestamp": "2023-01-26T14:10:42.000870007Z",
        "legalFactsIds": [
          {
            "key": "safestorage://PN_EXTERNAL_LEGAL_FACTS-0003-T9NR-EZKL-5V5A-WUAM",
            "category": LegalFactType.PEC_RECEIPT,
          }
        ],
        "category": TimelineCategory.SEND_DIGITAL_PROGRESS,
        "details": {
          "recIndex": 1,
          "digitalAddress": { "type": "PEC", "address": "toto93@gmail.com" },
          "digitalAddressSource": "PLATFORM",
          "retryNumber": 1,
          "notificationDate": "2023-01-26T13:57:41.224667703Z",
          "sendingReceipts": [{}],
          "eventCode": "C001",
          "shouldRetry": false
        }
      },
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_send_digital_feedback_1_source_PLATFORM_attempt_1",
        "timestamp": "2023-01-26T14:10:44.001161877Z",
        "legalFactsIds": [
          {
            "key": "safestorage://PN_EXTERNAL_LEGAL_FACTS-0003-VXMT-20MV-CBBU-X5MR",
            "category": LegalFactType.PEC_RECEIPT
          }
        ],
        "category": TimelineCategory.SEND_DIGITAL_FEEDBACK,
        "details": {
          "recIndex": 1,
          "digitalAddress": { "type": "PEC", "address": "toto93@gmail.com" },
          "digitalAddressSource": "PLATFORM",
          "responseStatus": "KO",
          "notificationDate": "2023-01-26T13:57:43.001161877Z",
          "sendingReceipts": [{}]
        }
      },
      // digital outcome - recipient 0
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_digital_failure_workflow_0",
        "timestamp": "2023-01-26T14:16:12.42843144Z",
        "legalFactsIds": [
          { "key": "safestorage://PN_LEGAL_FACTS-0002-0HBC-V58A-FT7W-WG8Y", "category": LegalFactType.DIGITAL_DELIVERY }
        ],
        "category": TimelineCategory.DIGITAL_FAILURE_WORKFLOW,
        "details": {
          "recIndex": 0,
          "digitalAddress": { "type": "PEC", "address": "manudido86@gmail.com" }
        }
      },
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_schedule_refinement_workflow_0",
        "timestamp": "2023-01-26T14:17:16.525827086Z",
        "legalFactsIds": [],
        "category": TimelineCategory.SCHEDULE_REFINEMENT,
        "details": { "recIndex": 0 }
      },
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_prepare_simple_registered_letter_0",
        "timestamp": "2023-01-26T14:17:18.525827086Z",
        "legalFactsIds": [],
        "category": TimelineCategory.PREPARE_SIMPLE_REGISTERED_LETTER,
        "details": {
          "recIndex": 0,
          "physicalAddress": {
            "at": "", "address": "via prova 45", "addressDetails": "", "zip": "20121", 
            "municipality": "milano", "province": "milano"
          },
          "analogCost": 1
        }
      },
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_send_simple_registered_letter_0",
        "timestamp": "2023-01-26T14:20:20.525827086Z",
        "legalFactsIds": [],
        "category": TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER,
        "details": {
          "recIndex": 0,
          "physicalAddress": {
            "at": "", "address": "via prova 45", "addressDetails": "", "zip": "20121", 
            "municipality": "milano", "province": "milano"
          },
          "productType": "RN_RS",
          "analogCost": 1100
        }
      },
      // digital outcome - recipient 1
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_digital_failure_workflow_1",
        "timestamp": "2023-01-26T14:26:12.42843144Z",
        "legalFactsIds": [
          { "key": "safestorage://PN_LEGAL_FACTS-0002-7DSD-PMF0-5SMU-95AI", "category": LegalFactType.DIGITAL_DELIVERY }
        ],
        "category": TimelineCategory.DIGITAL_FAILURE_WORKFLOW,
        "details": {
          "recIndex": 1,
          "digitalAddress": { "type": "PEC", "address": "toto93@gmail.com" }
        }
      },
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_schedule_refinement_workflow_1",
        "timestamp": "2023-01-26T14:27:16.525827086Z",
        "legalFactsIds": [],
        "category": TimelineCategory.SCHEDULE_REFINEMENT,
        "details": { "recIndex": 1 }
      },
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_prepare_simple_registered_letter_1",
        "timestamp": "2023-01-26T14:27:18.525827086Z",
        "legalFactsIds": [],
        "category": TimelineCategory.PREPARE_SIMPLE_REGISTERED_LETTER,
        "details": {
          "recIndex": 1,
          "physicalAddress": {
            "at": "", "address": "Via Roma 153", "addressDetails": "", "zip": "98036", 
            "municipality": "Graniti", "province": "Messina"
          },
          "analogCost": 1
        }
      },
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_send_simple_registered_letter_1",
        "timestamp": "2023-01-26T14:29:20.525827086Z",
        "legalFactsIds": [],
        "category": TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER,
        "details": {
          "recIndex": 1,
          "physicalAddress": {
            "at": "", "address": "Via Valerio Massimo Crisafulli Terzo 153", "addressDetails": "", "zip": "65020", 
            "municipality": "San Valentino in Abruzzo Citeriore", "province": "Pescara"
          },
          "productType": "RN_RS",
          "analogCost": 1100
        }
      },
      // subsequent events
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_refinement_0",
        "timestamp": "2023-01-26T14:31:23.333432372Z",
        "legalFactsIds": [],
        "category": TimelineCategory.REFINEMENT,
        "details": { "recIndex": 0, "notificationCost": 100 }
      },
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_refinement_1",
        "timestamp": "2023-01-26T14:31:23.333432372Z",
        "legalFactsIds": [],
        "category": TimelineCategory.REFINEMENT,
        "details": { "recIndex": 1, "notificationCost": 100 }
      },
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_notification_viewed_0",
        "timestamp": "2023-01-27T12:14:23.357127847Z",
        "legalFactsIds": [
          {
            "key": "safestorage://PN_LEGAL_FACTS-0002-7LNB-G0E1-2OGO-EEA6",
            "category": LegalFactType.RECIPIENT_ACCESS
          }
        ],
        "category": TimelineCategory.NOTIFICATION_VIEWED,
        "details": { 
          "recIndex": 0,
          "delegateInfo": {
            "internalId": "mocked-delegate-internal-id",
            "taxId": "GLLGLL64B15G702I",
            "operatorUuid": "mocked-delegate-uuid",
            "mandateId": "7c69e30a-23cd-4ef2-9b95-98c5a9f4e636",
            "denomination": "galileo galilei",
            "delegateType": RecipientType.PF,
          }
        }
      },
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_notification_viewed_1",
        "timestamp": "2023-01-27T12:14:23.357127847Z",
        "legalFactsIds": [
          {
            "key": "safestorage://PN_LEGAL_FACTS-0002-7LNB-G0E1-2OGO-EEA6",
            "category": LegalFactType.RECIPIENT_ACCESS
          }
        ],
        "category": TimelineCategory.NOTIFICATION_VIEWED,
        "details": { "recIndex": 1 }
      }
    ]
  };
};


function mockedAnalogNotificationDetail(): any {
  return {
    "abstract": "",
    "paProtocolNumber": "2023080217355",
    "subject": "prova priva preva",
    "recipients": [
        {
            "recipientType": "PF",
            "taxId": "PLOMRC01P30L736Y",
            "internalId": "PF-20250cb4-2f26-4609-9ca3-051bd621e0b7",
            "denomination": "marco polo",
            "physicalAddress": {
                "at": "",
                "address": "via prova 1",
                "addressDetails": "",
                "zip": "20121",
                "municipality": "milano",
                "municipalityDetails": "",
                "province": "milano",
                "foreignState": "italia"
            },
            "payment": {
                "noticeCode": "302047770003556788",
                "creditorTaxId": "77777777777"
            }
        },
        // {
        //   "recipientType": RecipientType.PF,
        //   "taxId": "CLMCST42R12D969Z",
        //   "internalId": "PF-a6c1350d-1d69-4209-8bf8-31de58c79d6e",
        //   "denomination": "Mario Gherkin",
        //   "digitalDomicile": {
        //     "type": DigitalDomicileType.PEC,
        //     "address": "testpagopa2@pnpagopa.postecert.local"
        //   },
        //   "physicalAddress": {
        //     "at": "Presso",
        //     "address": "Via senza nome",
        //     "zip": "40100",
        //     "municipality": "Milano",
        //     "municipalityDetails": "Milano",
        //     "province": "MI",
        //     "foreignState": "ITALIA"
        //   },
        // },
      ],
    "documents": [
        {
            "digests": {
                "sha256": "EbHGyDE77eEdLgw88zM37xMcnEcUx/QenPLDncJUfyk="
            },
            "contentType": "application/pdf",
            "ref": {
                "key": "PN_NOTIFICATION_ATTACHMENTS-0001-4J35-OBZE-5AUL-JCDP",
                "versionToken": "5MRCSKyBgEHbjcLqlmtxpZl4F.p7egrr"
            },
            "title": "atto",
            "docIdx": "0"
        }
    ],
    "notificationFeePolicy": "FLAT_RATE",
    "physicalCommunicationType": "AR_REGISTERED_LETTER",
    "senderDenomination": "Comune di Palermo",
    "senderTaxId": "80016350821",
    "group": "",
    "taxonomyCode": "123456A",
    "senderPaId": "5b994d4a-0fa8-47ac-9c7b-354f1d44a1ce",
    "iun": "WRVL-PVGN-UZTK-202302-A-1",
    "sentAt": "2023-02-08T16:36:05.904429787Z",
    "documentsAvailable": true,
    "notificationStatus": "VIEWED",
    "notificationStatusHistory": [
      {
        "status": "ACCEPTED",
        "activeFrom": "2023-02-08T16:36:05.904429787Z",
        "relatedTimelineElements": [
          "WRVL-PVGN-UZTK-202302-A-1_request_accepted",
          "aar_creation_request_iun_WRVL-PVGN-UZTK-202302-A-1_recIndex_0",
          "WRVL-PVGN-UZTK-202302-A-1_aar_gen_0",
          "WRVL-PVGN-UZTK-202302-A-1_send_courtesy_message_0_type_EMAIL",
          "WRVL-PVGN-UZTK-202302-A-1_get_address_0_source_PLATFORM_attempt_0",
          "WRVL-PVGN-UZTK-202302-A-1_get_address_0_source_SPECIAL_attempt_0",
          "WRVL-PVGN-UZTK-202302-A-1_0_DIGITAL_CHOOSE_DELIVERY_0_public_registry_call",
          "public_registry_response_WRVL-PVGN-UZTK-202302-A-1_0_DIGITAL_CHOOSE_DELIVERY_0_public_registry_call",
          "WRVL-PVGN-UZTK-202302-A-1_get_address_0_source_GENERAL_attempt_0",
          "WRVL-PVGN-UZTK-202302-A-1_schedule_analog_workflow_0_retry_0",
          "WRVL-PVGN-UZTK-202302-A-1_prepare_analog_domicile_0_attempt_0"
        ]
      },
      {
        "status": "DELIVERING",
        "activeFrom": "2023-02-08T16:40:33.217455701Z",
        "relatedTimelineElements": [
          "WRVL-PVGN-UZTK-202302-A-1_send_analog_domicile_0_attempt_0",
          "WRVL-PVGN-UZTK-202302-A-1_send_analog_progress_0_update_0",
          "WRVL-PVGN-UZTK-202302-A-1_send_analog_feedback_0_attempt_0"
        ]
      },
      {
        "status": "DELIVERED",
        "activeFrom": "2023-02-08T16:40:57.5513874Z",
        "relatedTimelineElements": [
          "WRVL-PVGN-UZTK-202302-A-1_analog_success_workflow_0",
          "WRVL-PVGN-UZTK-202302-A-1_schedule_refinement_workflow_0"
        ]
      },
      {
        "status": "EFFECTIVE_DATE",
        "activeFrom": "2023-02-08T16:45:01.254143387Z",
        "relatedTimelineElements": [
          "WRVL-PVGN-UZTK-202302-A-1_refinement_0"
        ]
      },
      {
        "status": "VIEWED",
        "activeFrom": "2023-02-09T14:44:39.966797944Z",
        "relatedTimelineElements": [
          "WRVL-PVGN-UZTK-202302-A-1_notification_viewed_0",
          "notification_viewed_creation_request_iun_WRVL-PVGN-UZTK-202302-A-1_recIndex_0",
          "NOTIFICATION_VIEWED.IUN_WRVL-PVGN-UZTK-202302-A-1.RECINDEX_0",
          "NOTIFICATION_VIEWED_CREATION_REQUEST.IUN_WRVL-PVGN-UZTK-202302-A-1.RECINDEX_0"
        ]
      }
    ],
    "timeline": [
      {
        "elementId": "senderack_legalfact_creation_request_iun_WRVL-PVGN-UZTK-202302-A-1",
        "timestamp": "2023-02-08T16:36:36.62863026Z",
        "legalFactsIds": [],
        "category": "SENDER_ACK_CREATION_REQUEST",
        "details": {}
      },
      {
        "elementId": "WRVL-PVGN-UZTK-202302-A-1_request_accepted",
        "timestamp": "2023-02-08T16:37:01.876406427Z",
        "legalFactsIds": [
          {
            "key": "safestorage://PN_LEGAL_FACTS-0002-5WNA-FU6Z-VVZV-1D5E",
            "category": "SENDER_ACK"
          }
        ],
        "category": "REQUEST_ACCEPTED"
      },
      {
        "elementId": "aar_creation_request_iun_WRVL-PVGN-UZTK-202302-A-1_recIndex_0",
        "timestamp": "2023-02-08T16:37:30.242868569Z",
        "legalFactsIds": [],
        "category": "AAR_CREATION_REQUEST",
        "details": {
          "recIndex": 0,
          "aarKey": "safestorage://PN_AAR-0002-GVTP-ZMH1-49O7-LDRJ",
          "numberOfPages": 1
        }
      },
      {
        "elementId": "WRVL-PVGN-UZTK-202302-A-1_aar_gen_0",
        "timestamp": "2023-02-08T16:37:59.886730617Z",
        "legalFactsIds": [],
        "category": "AAR_GENERATION",
        "details": {
          "recIndex": 0,
          "numberOfPages": 1,
          "generatedAarUrl": "safestorage://PN_AAR-0002-GVTP-ZMH1-49O7-LDRJ"
        }
      },
      {
          "elementId": "WRVL-PVGN-UZTK-202302-A-1_send_courtesy_message_0_type_EMAIL",
          "timestamp": "2023-02-08T16:38:00.037670604Z",
          "legalFactsIds": [],
          "category": "SEND_COURTESY_MESSAGE",
          "details": {
            "recIndex": 0,
            "digitalAddress": {
              "type": "EMAIL",
              "address": "test@test.it"
            },
            "sendDate": "2023-02-08T16:38:00.036508467Z"
          }
      },
      {
        "elementId": "WRVL-PVGN-UZTK-202302-A-1_get_address_0_source_PLATFORM_attempt_0",
        "timestamp": "2023-02-08T16:38:29.978501364Z",
        "legalFactsIds": [],
        "category": "GET_ADDRESS",
        "details": {
          "recIndex": 0,
          "digitalAddressSource": "PLATFORM",
          "isAvailable": false,
          "attemptDate": "2023-02-08T16:38:29.978495649Z"
        }
      },
      {
        "elementId": "WRVL-PVGN-UZTK-202302-A-1_get_address_0_source_SPECIAL_attempt_0",
        "timestamp": "2023-02-08T16:38:30.011315723Z",
        "legalFactsIds": [],
        "category": "GET_ADDRESS",
        "details": {
          "recIndex": 0,
          "digitalAddressSource": "SPECIAL",
          "isAvailable": false,
          "attemptDate": "2023-02-08T16:38:30.011310333Z"
        }
      },
      {
        "elementId": "WRVL-PVGN-UZTK-202302-A-1_0_DIGITAL_CHOOSE_DELIVERY_0_public_registry_call",
        "timestamp": "2023-02-08T16:38:30.260846704Z",
        "legalFactsIds": [],
        "category": "PUBLIC_REGISTRY_CALL",
        "details": {
          "recIndex": 0,
          "deliveryMode": "DIGITAL",
          "contactPhase": "CHOOSE_DELIVERY",
          "sentAttemptMade": 0,
          "sendDate": "2023-02-08T16:38:30.260841154Z"
        }
      },
      {
        "elementId": "public_registry_response_WRVL-PVGN-UZTK-202302-A-1_0_DIGITAL_CHOOSE_DELIVERY_0_public_registry_call",
        "timestamp": "2023-02-08T16:38:32.855255118Z",
        "legalFactsIds": [],
        "category": "PUBLIC_REGISTRY_RESPONSE",
        "details": {
          "recIndex": 0
        }
      },
      {
        "elementId": "WRVL-PVGN-UZTK-202302-A-1_get_address_0_source_GENERAL_attempt_0",
        "timestamp": "2023-02-08T16:38:32.913957893Z",
        "legalFactsIds": [],
        "category": "GET_ADDRESS",
        "details": {
          "recIndex": 0,
          "digitalAddressSource": "GENERAL",
          "isAvailable": false,
          "attemptDate": "2023-02-08T16:38:32.913952529Z"
        }
      },
      {
        "elementId": "WRVL-PVGN-UZTK-202302-A-1_schedule_analog_workflow_0_retry_0",
        "timestamp": "2023-02-08T16:38:32.9830969Z",
        "legalFactsIds": [],
        "category": "SCHEDULE_ANALOG_WORKFLOW",
        "details": {
          "recIndex": 0
        }
      },
      {
        "elementId": "WRVL-PVGN-UZTK-202302-A-1_prepare_analog_domicile_0_attempt_0",
        "timestamp": "2023-02-08T16:40:30.370627919Z",
        "legalFactsIds": [],
        "category": "PREPARE_ANALOG_DOMICILE",
        "details": {
          "recIndex": 0,
          "physicalAddress": {
            "at": "",
            "address": "via prova 1",
            "addressDetails": "",
            "zip": "20121",
            "municipality": "milano",
            "province": "milano"
          },
          "sentAttemptMade": 0
        }
      },
      {
          "elementId": "WRVL-PVGN-UZTK-202302-A-1_send_analog_domicile_0_attempt_0",
          "timestamp": "2023-02-08T16:40:33.217455701Z",
          "legalFactsIds": [],
          "category": "SEND_ANALOG_DOMICILE",
          "details": {
              "recIndex": 0,
              "physicalAddress": {
                  "address": "via prova 1",
                  "zip": "20121",
                  "municipality": "milano",
                  "province": "milano"
              },
              "sentAttemptMade": 0,
              "serviceLevel": "AR_REGISTERED_LETTER",
              "ServiceLevelAR": "AR_REGISTERED_LETTER",
              "serviceLevel890": "REGISTERED_LETTER_890",
              "productType": "RN_AR",
              "analogCost": 1100
          }
      },
      {
        "elementId": "WRVL-PVGN-UZTK-202302-A-1_send_analog_progress_0_update_0",
        "timestamp": "2023-02-08T16:40:34.217455701Z",
        "legalFactsIds": [
          {
            "key": "safestorage://PN_EXTERNAL_LEGAL_FACTS-0003-13YK-ZH8U-OUP9-SOJM",
            "category": "ANALOG_DELIVERY"
          }
        ],
        "category": "SEND_ANALOG_PROGRESS",
        "details": {
            "recIndex": 0,
            "physicalAddress": {
                "address": "via prova 1",
                "zip": "20121",
                "municipality": "milano",
                "province": "milano"
            },
            "sentAttemptMade": 0,
            "productType": "RN_AR",
            "analogCost": 1100
        }
    },
    {
        "elementId": "WRVL-PVGN-UZTK-202302-A-1_send_analog_feedback_0_attempt_0",
        "timestamp": "2023-02-08T16:40:57.50164825Z",
        "legalFactsIds": [
          {
            "key": "safestorage://PN_EXTERNAL_LEGAL_FACTS-0003-13YK-ZH8U-OUP9-SOJM",
            "category": "ANALOG_DELIVERY"
          }
        ],
        "category": "SEND_ANALOG_FEEDBACK",
        "details": {
          "recIndex": 0,
          "physicalAddress": {
            "at": "",
            "address": "via prova 1",
            "addressDetails": "",
            "zip": "20121",
            "municipality": "milano",
            "province": "milano"
          },
          "sentAttemptMade": 0,
          "responseStatus": "OK"
        }
      },
      {
        "elementId": "WRVL-PVGN-UZTK-202302-A-1_analog_success_workflow_0",
        "timestamp": "2023-02-08T16:40:57.5513874Z",
        "legalFactsIds": [
          {
            "key": "safestorage://PN_EXTERNAL_LEGAL_FACTS-0003-13YK-ZH8U-OUP9-SOJM",
            "category": "ANALOG_DELIVERY"
          }
        ],
        "category": "ANALOG_SUCCESS_WORKFLOW",
        "details": {
          "recIndex": 0,
          "physicalAddress": {
            "at": "",
            "address": "via prova 1",
            "addressDetails": "",
            "zip": "20121",
            "municipality": "milano",
            "province": "milano"
          }
        }
      },
      {
        "elementId": "WRVL-PVGN-UZTK-202302-A-1_schedule_refinement_workflow_0",
        "timestamp": "2023-02-08T16:40:57.661845703Z",
        "legalFactsIds": [],
        "category": "SCHEDULE_REFINEMENT",
        "details": {
          "recIndex": 0
        }
      },
      {
        "elementId": "WRVL-PVGN-UZTK-202302-A-1_refinement_0",
        "timestamp": "2023-02-08T16:45:01.254143387Z",
        "legalFactsIds": [],
        "category": "REFINEMENT",
        "details": {
          "recIndex": 0,
          "notificationCost": 100
        }
      },
      {
        "elementId": "WRVL-PVGN-UZTK-202302-A-1_notification_viewed_0",
        "timestamp": "2023-02-09T14:44:39.966797944Z",
        "legalFactsIds": [
          {
            "key": "safestorage://PN_LEGAL_FACTS-0002-ASTL-VVSZ-FYV2-EL3A",
            "category": "RECIPIENT_ACCESS"
          }
        ],
        "category": "NOTIFICATION_VIEWED",
        "details": {
          "recIndex": 0
        }
      },
      {
        "elementId": "notification_viewed_creation_request_iun_WRVL-PVGN-UZTK-202302-A-1_recIndex_0",
        "timestamp": "2023-02-09T14:44:50.813741977Z",
        "legalFactsIds": [],
        "category": "NOTIFICATION_VIEWED_CREATION_REQUEST",
        "details": {
          "recIndex": 0,
          "eventTimestamp": "2023-02-09T14:44:39.966797944Z"
        }
      },
      {
        "elementId": "NOTIFICATION_VIEWED.IUN_WRVL-PVGN-UZTK-202302-A-1.RECINDEX_0",
        "timestamp": "2023-02-23T16:41:57.511051467Z",
        "legalFactsIds": [
          {
            "key": "safestorage://PN_LEGAL_FACTS-0002-8ZCR-9GMT-2SIU-XPS4",
            "category": "RECIPIENT_ACCESS"
          }
        ],
        "category": "NOTIFICATION_VIEWED",
        "details": {
          "recIndex": 0,
          "notificationCost": 100
        }
      },
      {
        "elementId": "NOTIFICATION_VIEWED_CREATION_REQUEST.IUN_WRVL-PVGN-UZTK-202302-A-1.RECINDEX_0",
        "timestamp": "2023-02-23T16:42:08.474766059Z",
        "legalFactsIds": [],
        "category": "NOTIFICATION_VIEWED_CREATION_REQUEST",
        "details": {
          "recIndex": 0,
          "eventTimestamp": "2023-02-23T16:41:57.511051467Z"
        }
      }
    ]
  };
}

const getDownloadUrl = (response: AxiosResponse): { url: string } => {
  if (response.data) {
    return response.data as { url: string };
  }
  return { url: '' };
};

export const NotificationsApi = {
  /**
   * Gets current user notifications
   * @param  {string} startDate
   * @param  {string} endDate
   * @returns Promise
   */
  getSentNotifications: (params: GetNotificationsParams): Promise<GetNotificationsResponse> =>
    apiClient.get<GetNotificationsResponse>(NOTIFICATIONS_LIST(params)).then((response) => {
      if (response.data && response.data.resultsPage) {
        const notifications = response.data.resultsPage.map((d) => ({
          ...d,
          sentAt: formatDate(d.sentAt),
        }));
        notifications.forEach(noti => {
          if (noti.iun === "NGQJ-YEXR-MYVA-202211-Y-1") {
            // eslint-disable-next-line functional/immutable-data
            noti.recipients = [noti.recipients[0]];
          }
        });
        return {
          ...response.data,
          resultsPage: notifications,
        };
      }
      return {
        resultsPage: [],
        moreResult: false,
        nextPagesKey: [],
      };
    }),

  getSentNotificationsReal: (params: GetNotificationsParams): Promise<GetNotificationsResponse> =>
    apiClient.get<GetNotificationsResponse>(NOTIFICATIONS_LIST(params)).then((response) => {
      if (response.data && response.data.resultsPage) {
        const notifications = response.data.resultsPage.map((d) => ({
          ...d,
          sentAt: formatDate(d.sentAt),
        }));
        return {
          ...response.data,
          resultsPage: notifications,
        };
      }
      return {
        resultsPage: [],
        moreResult: false,
        nextPagesKey: [],
      };
    }),

  /**
   * Gets current user notification detail
   * @param  {string} iun
   * @returns Promise
   */
  getSentNotification: (iun: string): Promise<NotificationDetail> => {
    if (iun === "KQKX-WMDW-GDMU-202301-L-1") {
      return Promise.resolve(parseNotificationDetail(mockedNotificationDetail()));
    } else if (iun === "WRVL-PVGN-UZTK-202302-A-1") {
      return Promise.resolve(parseNotificationDetail(mockedAnalogNotificationDetail()));
    } else {
      return apiClient.get<NotificationDetail>(NOTIFICATION_DETAIL(iun)).then((response) => {
        if (response.data && response.data.iun) {
          const parsedNotification = parseNotificationDetail(response.data);
          if (parsedNotification.iun === "NGQJ-YEXR-MYVA-202211-Y-1") {
            // eslint-disable-next-line functional/immutable-data
            parsedNotification.recipients = [parsedNotification.recipients[0]];
          }
          return parsedNotification;
        }
        return {} as NotificationDetail;
      });
    }
  },

  getSentNotificationReal: (iun: string): Promise<NotificationDetail> =>
    apiClient.get<NotificationDetail>(NOTIFICATION_DETAIL(iun)).then((response) => {
      if (response.data) {
        return parseNotificationDetail(response.data);
      }
      return {} as NotificationDetail;
    }),

  /**
   * Gets current user notification document
   * @param  {string} iun
   * @param  {number} documentIndex
   * @returns Promise
   */
  getSentNotificationDocument: (iun: string, documentIndex: string): Promise<{ url: string }> =>
    apiClient
      .get<{ url: string }>(NOTIFICATION_DETAIL_DOCUMENTS(iun, documentIndex))
      .then((response) => getDownloadUrl(response)),

  /**
   * 
   * @param  {string} iun
   * @param  {NotificationDetailOtherDocument} otherDocument 
   * @returns Promise
   */
  getSentNotificationOtherDocument: (iun: string, otherDocument: NotificationDetailOtherDocument): Promise<{ url: string }> =>
    apiClient
      .get<{ url: string }>(NOTIFICATION_DETAIL_OTHER_DOCUMENTS(iun, otherDocument), {params: {documentId: otherDocument.documentId}})
      .then((response) => getDownloadUrl(response)),

  /**
   * Gets current user notification legalfact
   * @param  {string} iun
   * @param  {LegalFactId} legalFact
   * @returns Promise
   */
  getSentNotificationLegalfact: (iun: string, legalFact: LegalFactId): Promise<{ url: string }> =>
    apiClient
      .get<{ url: string }>(NOTIFICATION_DETAIL_LEGALFACT(iun, legalFact))
      .then((response) => getDownloadUrl(response)),

  /**
   * get user groups
   * @param  {GroupStatus} status
   * @returns Promise
   */
  getUserGroups: (status?: GroupStatus): Promise<Array<UserGroup>> =>
    apiClient.get<Array<UserGroup>>(GET_USER_GROUPS(status)).then((response) => response.data),

  /**
   * Preload notification document
   * @param  {string} key
   * @param  {string} contentType
   * @returns Promise
   */
  preloadNotificationDocument: (
    items: Array<{ key: string; contentType: string; sha256: string }>
  ): Promise<Array<{ url: string; secret: string; httpMethod: string; key: string }>> =>
    apiClient
      .post<Array<{ url: string; secret: string; httpMethod: string; key: string }>>(
        NOTIFICATION_PRELOAD_DOCUMENT(),
        items
      )
      .then((response) => {
        if (response.data) {
          return response.data;
        }
        return [];
      }),

  /**
   * Upload notification document
   * @param  {string} url
   * @param  {string} sha256
   * @param  {string} secret
   * @param  {string} fileBase64
   * @returns Promise
   */
  uploadNotificationAttachment: (
    url: string,
    sha256: string,
    secret: string,
    file: Uint8Array,
    httpMethod: string
  ): Promise<string> => {
    const method = httpMethod.toLowerCase() as 'get' | 'post' | 'put';
    return externalClient[method]<string>(url, file, {
      headers: {
        'Content-Type': 'application/pdf',
        'x-amz-meta-secret': secret,
        'x-amz-checksum-sha256': sha256,
      },
    }).then((res) => res.headers['x-amz-version-id']);
  },

  /**
   * create new notification
   * @param  {NewNotificationDTO} notification
   * @returns Promise
   */
  createNewNotification: (notification: NewNotificationDTO): Promise<NewNotificationResponse> =>
    apiClient
      .post<NewNotificationResponse>(CREATE_NOTIFICATION(), notification)
      .then((response) => response.data),
};
