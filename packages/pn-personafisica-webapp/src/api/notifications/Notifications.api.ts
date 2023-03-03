import {
  formatDate,
  GetNotificationsParams,
  GetNotificationsResponse,
  LegalFactId,
  NotificationDetail,
  NotificationDetailOtherDocument,
  PaymentAttachmentNameType,
  PaymentInfo,
  PaymentNotice,
} from '@pagopa-pn/pn-commons';
import { AxiosResponse } from 'axios';

import { Delegator } from '../../redux/delegation/types';
import { parseNotificationDetailForRecipient } from '../../utils/notification.utility';
import { NotificationDetailForRecipient } from '../../models/NotificationDetail';
import { NotificationId } from '../../models/Notifications';
import { apiClient } from '../apiClients';
import {
  NOTIFICATIONS_LIST,
  NOTIFICATION_DETAIL,
  NOTIFICATION_DETAIL_DOCUMENTS,
  NOTIFICATION_DETAIL_LEGALFACT,
  NOTIFICATION_DETAIL_OTHER_DOCUMENTS,
  NOTIFICATION_ID_FROM_QRCODE,
  NOTIFICATION_PAYMENT_ATTACHMENT,
  NOTIFICATION_PAYMENT_INFO,
  NOTIFICATION_PAYMENT_URL,
} from './notifications.routes';


const getDownloadUrl = (response: AxiosResponse): { url: string } => {
  if (response.data) {
    return response.data as { url: string };
  }
  return { url: '' };
};


function mockedNotificationDetail(): any { 
  return {
    "abstract": "Dritto devi andare!",
    "paProtocolNumber": "3473",
    "subject": "Inadequatezza nel camminare",
    "recipients": [
      {
        "recipientType": "PF",
        "taxId": "LVLDAA85T50G702B",
        // "internalId": "PF-b32e4920-6ff3-4872-8018-d60a4e5827f9",
        "denomination": "Ada Lovelace",
        "digitalDomicile": {
          "type": "PEC",
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
      // {
      //   "recipientType": RecipientType.PF,
      //   // "taxId": "CLMCST42R12D969Z",
      //   "internalId": "PF-a6c1350d-1d69-4209-8bf8-31de58c79d6e",
      //   // "denomination": "Mario Gherkin",
      //   // "digitalDomicile": {
      //   //   "type": DigitalDomicileType.PEC,
      //   //   "address": "testpagopa2@pnpagopa.postecert.local"
      //   // },
      //   // "physicalAddress": {
      //   //   "at": "Presso",
      //   //   "address": "Via senza nome",
      //   //   "zip": "40100",
      //   //   "municipality": "Milano",
      //   //   "municipalityDetails": "Milano",
      //   //   "province": "MI",
      //   //   "foreignState": "ITALIA"
      //   // },
      // },
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
    "notificationFeePolicy": "FLAT_RATE",
    "physicalCommunicationType": "AR_REGISTERED_LETTER",
    "senderDenomination": "Comune di Palermo",
    "senderTaxId": "80016350821",
    "group": "",
    "taxonomyCode": "010102P",
    "senderPaId": "5b994d4a-0fa8-47ac-9c7b-354f1d44a1ce",
    "iun": "KQKX-WMDW-GDMU-202301-L-1",
    "sentAt": "2023-01-26T13:54:47.18027307Z",
    "documentsAvailable": true,
    "notificationStatus": "VIEWED",
    "notificationStatusHistory": [
      {
        "status": "ACCEPTED",
        "activeFrom": "2023-01-26T13:54:47.18027307Z",
        "relatedTimelineElements": [
          "KQKX-WMDW-GDMU-202301-L-1_request_accepted",
          "KQKX-WMDW-GDMU-202301-L-1_aar_gen_0",
          "KQKX-WMDW-GDMU-202301-L-1_send_courtesy_message_0_index_0",
          "KQKX-WMDW-GDMU-202301-L-1_send_courtesy_message_0_index_1",
          "KQKX-WMDW-GDMU-202301-L-1_send_courtesy_message_0_index_2",
          "KQKX-WMDW-GDMU-202301-L-1_send_courtesy_message_0_index_3",
          "KQKX-WMDW-GDMU-202301-L-1_get_address_0_source_PLATFORM_attempt_0"
        ]
      },
      {
        "status": "DELIVERING",
        "activeFrom": "2023-01-26T13:55:52.651901435Z",
        "relatedTimelineElements": [
          // recipient 0 - first attempt
          "KQKX-WMDW-GDMU-202301-L-1_send_digital_domicile_0_source_PLATFORM_attempt_0",
          "KQKX-WMDW-GDMU-202301-L-1_digital_delivering_progress_0_source_PLATFORM_attempt_0_progidx_1",
          "KQKX-WMDW-GDMU-202301-L-1_send_digital_feedback_0_source_PLATFORM_attempt_0",
          "KQKX-WMDW-GDMU-202301-L-1_schedule_digital_workflow_0_source_PLATFORM_retry_0",
          // recipient 0 - second attempt
          "KQKX-WMDW-GDMU-202301-L-1_send_digital_domicile_0_source_PLATFORM_attempt_1",
          "KQKX-WMDW-GDMU-202301-L-1_digital_delivering_progress_0_source_PLATFORM_attempt_1_progidx_1",
          "KQKX-WMDW-GDMU-202301-L-1_send_digital_feedback_0_source_PLATFORM_attempt_1",
        ]
      },
      {
        "status": "DELIVERED",
        "activeFrom": "2023-01-26T14:16:12.42843144Z",
        "relatedTimelineElements": [
          // digital success - recipient 0
          "KQKX-WMDW-GDMU-202301-L-1_digital_success_workflow_0",
          "KQKX-WMDW-GDMU-202301-L-1_schedule_refinement_workflow_0",
          // "KQKX-WMDW-GDMU-202301-L-1_prepare_simple_registered_letter_0",
          // "KQKX-WMDW-GDMU-202301-L-1_send_simple_registered_letter_0",
        ]
      },
      {
        "status": "EFFECTIVE_DATE",
        "activeFrom": "2023-01-26T14:31:23.333432372Z",
        "relatedTimelineElements": ["KQKX-WMDW-GDMU-202301-L-1_refinement_0"]
      },
      {
        "status": "VIEWED",
        "activeFrom": "2023-01-27T12:14:23.357127847Z",
        "relatedTimelineElements": [
          // "KQKX-WMDW-GDMU-202301-L-1_notification_viewed_0"
        ]
      }
    ],
    "timeline": [
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_request_accepted",
        "timestamp": "2023-01-26T13:54:15.975574085Z",
        "legalFactsIds": [
          {
            "key": "safestorage://PN_LEGAL_FACTS-0002-Y8NU-81RH-MWBB-RJ71",
            "category": "SENDER_ACK",
          }
        ],
        "details": {
        },
        "category": "REQUEST_ACCEPTED"
      },
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_aar_gen_0",
        "timestamp": "2023-01-26T13:54:22.715640353Z",
        "legalFactsIds": [],
        "category": "AAR_GENERATION",
        "details": {
          "recIndex": 0,
          "numberOfPages": 1,
          "generatedAarUrl": "safestorage://PN_AAR-0002-GO6M-7RQG-8PB7-YAER"
        }
      },
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_send_courtesy_message_0_index_0",
        "timestamp": "2023-01-26T13:54:33.816736941Z",
        "legalFactsIds": [],
        "category": "SEND_COURTESY_MESSAGE",
        "details": {
          "recIndex": 0,
          "digitalAddress": {
            "type": "EMAIL",
            "address": "manudido99@gmail.com"
          },
          "sendDate": "2023-01-26T13:54:33.816723695Z"
        }
      },
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_send_courtesy_message_0_index_1",
        "timestamp": "2023-01-26T13:55:22.826736941Z",
        "legalFactsIds": [],
        "category": "SEND_COURTESY_MESSAGE",
        "details": {
          "recIndex": 0,
          "digitalAddress": {
            "type": "APPIO",
            "address": "sono_io_1"
          },
          "ioSendMessageResult": "NOT_SENT_OPTIN_ALREADY_SENT",
          "sendDate": "2023-01-26T13:55:22.826723695Z"
        }
      },
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_send_courtesy_message_0_index_2",
        "timestamp": "2023-01-26T13:56:22.836736941Z",
        "legalFactsIds": [],
        "category": "SEND_COURTESY_MESSAGE",
        "details": {
          "recIndex": 0,
          "digitalAddress": {
            "type": "APPIO",
            "address": "sono_un_altro_1"
          },
          "ioSendMessageResult": "SENT_OPTIN",
          "sendDate": "2023-01-26T13:55:22.826723695Z"
        }
      },
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_send_courtesy_message_0_index_3",
        "timestamp": "2023-01-26T13:56:33.881938714Z",
        "legalFactsIds": [],
        "category": "SEND_COURTESY_MESSAGE",
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
        "timestamp": "2023-01-26T13:57:32.597019182Z",
        "legalFactsIds": [],
        "category": "GET_ADDRESS",
        "details": {
          "recIndex": 0,
          "digitalAddressSource": "PLATFORM",
          "isAvailable": true,
          "attemptDate": "2023-01-26T13:57:32.597018417Z"
        }
      },
      // first send attempt - recipient 0
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_send_digital_domicile_0_source_PLATFORM_attempt_0",
        "timestamp": "2023-01-26T13:57:52.651901435Z",
        "legalFactsIds": [],
        "category": "SEND_DIGITAL_DOMICILE",
        "details": {
          "recIndex": 0,
          "digitalAddress": { "type": "PEC", "address": "manudido99@gmail.com" },
          "digitalAddressSource": "PLATFORM",
          "retryNumber": 0
        }
      },
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_digital_delivering_progress_0_source_PLATFORM_attempt_0_progidx_1",
        "timestamp": "2023-01-26T13:58:05.000870007Z",
        "legalFactsIds": [
          { "key": "safestorage://PN_EXTERNAL_LEGAL_FACTS-0003-T9NR-EZKL-5V5A-WUAM", "category": "PEC_RECEIPT", }
        ],
        "category": "SEND_DIGITAL_PROGRESS",
        "details": {
          "recIndex": 0,
          "digitalAddress": { "type": "PEC", "address": "manudido99@gmail.com" },
          "digitalAddressSource": "PLATFORM",
          "retryNumber": 0,
          "notificationDate": "2023-01-26T13:56:06.224667703Z",
          "sendingReceipts": [{}],
          "eventCode": "C001",
          "shouldRetry": false
        }
      },
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_send_digital_feedback_0_source_PLATFORM_attempt_0",
        "timestamp": "2023-01-26T13:58:15.001161877Z",
        "legalFactsIds": [
          { "key": "safestorage://PN_EXTERNAL_LEGAL_FACTS-0003-VXMT-20MV-CBBU-X5MR", "category": "PEC_RECEIPT" }
        ],
        "category": "SEND_DIGITAL_FEEDBACK",
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
        "timestamp": "2023-01-26T13:59:34.001161877Z",
        "legalFactsIds": [],
        "category": "SCHEDULE_DIGITAL_WORKFLOW",
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
        "timestamp": "2023-01-26T14:00:02.651901435Z",
        "legalFactsIds": [],
        "category": "SEND_DIGITAL_DOMICILE",
        "details": {
          "recIndex": 1,
          "digitalAddress": { "type": "PEC", "address": "toto45@gmail.com" },
          "digitalAddressSource": "PLATFORM",
          "retryNumber": 0
        }
      },
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_digital_delivering_progress_1_source_PLATFORM_attempt_0_progidx_1",
        "timestamp": "2023-01-26T14:00:05.000870007Z",
        "legalFactsIds": [
          { "key": "safestorage://PN_EXTERNAL_LEGAL_FACTS-0003-T9NR-EZKL-5V5A-WUAM", "category": "PEC_RECEIPT", }
        ],
        "category": "SEND_DIGITAL_PROGRESS",
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
        "timestamp": "2023-01-26T14:00:15.001161877Z",
        "legalFactsIds": [
          { "key": "safestorage://PN_EXTERNAL_LEGAL_FACTS-0003-VXMT-20MV-CBBU-X5MR", "category": "PEC_RECEIPT" }
        ],
        "category": "SEND_DIGITAL_FEEDBACK",
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
        "timestamp": "2023-01-26T14:01:34.001161877Z",
        "legalFactsIds": [],
        "category": "SCHEDULE_DIGITAL_WORKFLOW",
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
        "category": "SEND_DIGITAL_DOMICILE",
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
            "category": "PEC_RECEIPT",
          }
        ],
        "category": "SEND_DIGITAL_PROGRESS",
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
            "category": "PEC_RECEIPT"
          }
        ],
        "category": "SEND_DIGITAL_FEEDBACK",
        "details": {
          "recIndex": 0,
          "digitalAddress": {
            "type": "PEC",
            "address": "manudido86@gmail.com"
          },
          "digitalAddressSource": "PLATFORM",
          "responseStatus": "OK",
          "notificationDate": "2023-01-26T13:57:43.001161877Z",
          "sendingReceipts": [{}]
        }
      },
      // second send attempt - recipient 1
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_send_digital_domicile_1_source_PLATFORM_attempt_1",
        "timestamp": "2023-01-26T14:10:40.651901435Z",
        "legalFactsIds": [],
        "category": "SEND_DIGITAL_DOMICILE",
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
            "category": "PEC_RECEIPT",
          }
        ],
        "category": "SEND_DIGITAL_PROGRESS",
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
            "category": "PEC_RECEIPT"
          }
        ],
        "category": "SEND_DIGITAL_FEEDBACK",
        "details": {
          "recIndex": 1,
          "digitalAddress": { "type": "PEC", "address": "toto93@gmail.com" },
          "digitalAddressSource": "PLATFORM",
          "responseStatus": "OK",
          "notificationDate": "2023-01-26T13:57:43.001161877Z",
          "sendingReceipts": [{}]
        }
      },
      // digital success - recipient 0
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_digital_success_workflow_0",
        "timestamp": "2023-01-26T14:16:12.42843144Z",
        "legalFactsIds": [
          { "key": "safestorage://PN_LEGAL_FACTS-0002-0HBC-V58A-FT7W-WG8Y", "category": "DIGITAL_DELIVERY" }
        ],
        "category": "DIGITAL_SUCCESS_WORKFLOW",
        "details": {
          "recIndex": 0,
          "digitalAddress": { "type": "PEC", "address": "manudido86@gmail.com" }
        }
      },
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_schedule_refinement_workflow_0",
        "timestamp": "2023-01-26T14:17:16.525827086Z",
        "legalFactsIds": [],
        "category": "SCHEDULE_REFINEMENT",
        "details": { "recIndex": 0 }
      },
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_prepare_simple_registered_letter_0",
        "timestamp": "2023-01-26T14:17:18.525827086Z",
        "legalFactsIds": [],
        "category": "PREPARE_SIMPLE_REGISTERED_LETTER",
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
        "category": "SEND_SIMPLE_REGISTERED_LETTER",
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
      // digital success - recipient 1
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_digital_success_workflow_1",
        "timestamp": "2023-01-26T14:26:12.42843144Z",
        "legalFactsIds": [
          { "key": "safestorage://PN_LEGAL_FACTS-0002-7DSD-PMF0-5SMU-95AI", "category": "DIGITAL_DELIVERY" }
        ],
        "category": "DIGITAL_SUCCESS_WORKFLOW",
        "details": {
          "recIndex": 1,
          "digitalAddress": { "type": "PEC", "address": "toto93@gmail.com" }
        }
      },
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_schedule_refinement_workflow_1",
        "timestamp": "2023-01-26T14:27:16.525827086Z",
        "legalFactsIds": [],
        "category": "SCHEDULE_REFINEMENT",
        "details": { "recIndex": 1 }
      },
      // {
      //   "elementId": "KQKX-WMDW-GDMU-202301-L-1_prepare_simple_registered_letter_1",
      //   "timestamp": "2023-01-26T14:27:18.525827086Z",
      //   "legalFactsIds": [],
      //   "category": TimelineCategory.PREPARE_SIMPLE_REGISTERED_LETTER,
      //   "details": {
      //     "recIndex": 1,
      //     "physicalAddress": {
      //       "at": "", "address": "Via Roma 153", "addressDetails": "", "zip": "98036", 
      //       "municipality": "Graniti", "province": "Messina"
      //     },
      //     "analogCost": 1
      //   }
      // },
      // {
      //   "elementId": "KQKX-WMDW-GDMU-202301-L-1_send_simple_registered_letter_1",
      //   "timestamp": "2023-01-26T14:29:20.525827086Z",
      //   "legalFactsIds": [],
      //   "category": TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER,
      //   "details": {
      //     "recIndex": 1,
      //     "physicalAddress": {
      //       "at": "", "address": "Via Roma 153", "addressDetails": "", "zip": "98036", 
      //       "municipality": "Graniti", "province": "Messina"
      //     },
      //     "productType": "RN_RS",
      //     "analogCost": 1100
      //   }
      // },
      // subsequent events
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_refinement_0",
        "timestamp": "2023-01-26T14:31:23.333432372Z",
        "legalFactsIds": [],
        "category": "REFINEMENT",
        "details": { "recIndex": 0, "notificationCost": 100 }
      },
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_refinement_1",
        "timestamp": "2023-01-26T14:31:23.333432372Z",
        "legalFactsIds": [],
        "category": "REFINEMENT",
        "details": { "recIndex": 1, "notificationCost": 100 }
      },
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_notification_viewed_0",
        "timestamp": "2023-01-27T12:14:23.357127847Z",
        "legalFactsIds": [
          {
            "key": "safestorage://PN_LEGAL_FACTS-0002-7LNB-G0E1-2OGO-EEA6",
            "category": "RECIPIENT_ACCESS"
          }
        ],
        "category": "NOTIFICATION_VIEWED",
        "details": { 
          "recIndex": 0,
          "delegateInfo": {
            "internalId": "mocked-delegate-internal-id",
            "taxId": "GLLGLL64B15G702I",
            "operatorUuid": "mocked-delegate-uuid",
            "mandateId": "7c69e30a-23cd-4ef2-9b95-98c5a9f4e636",
            "denomination": "galileo galilei",
            "delegateType": "PF",
          }
        }
      },
      {
        "elementId": "KQKX-WMDW-GDMU-202301-L-1_notification_viewed_1",
        "timestamp": "2023-01-27T12:14:23.357127847Z",
        "legalFactsIds": [
          {
            "key": "safestorage://PN_LEGAL_FACTS-0002-7LNB-G0E1-2OGO-EEA6",
            "category": "RECIPIENT_ACCESS"
          }
        ],
        "category": "NOTIFICATION_VIEWED",
        "details": { "recIndex": 1 }
      }
    ]
  };
};


export const NotificationsApi = {
  /**
   * Gets current user notifications
   * @param  {string} startDate
   * @param  {string} endDate
   * @returns Promise
   */
  getReceivedNotifications: (params: GetNotificationsParams): Promise<GetNotificationsResponse> =>
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
   * @param  {string} currentUserTaxId
   * @param  {Array<Delegator>} delegatorsFromStore
   * @param  {string} mandateId
   * @returns Promise
   */
  getReceivedNotification: (
    iun: string,
    currentUserTaxId: string,
    delegatorsFromStore: Array<Delegator>,
    mandateId?: string
  ): Promise<NotificationDetailForRecipient> => {
    if (iun === 'KQKX-WMDW-GDMU-202301-L-1') {
      return Promise.resolve(parseNotificationDetailForRecipient(
        mockedNotificationDetail(),
        currentUserTaxId,
        delegatorsFromStore,
        mandateId
      ));
    } else {
      return apiClient.get<NotificationDetail>(NOTIFICATION_DETAIL(iun, mandateId)).then((response) => {
        if (response.data && response.data.iun) {
          return parseNotificationDetailForRecipient(
            response.data,
            currentUserTaxId,
            delegatorsFromStore,
            mandateId
          );
        } else {
          return {} as NotificationDetailForRecipient;
        }
      });
    }
  },

  getReceivedNotificationReal: (
    iun: string,
    currentUserTaxId: string,
    delegatorsFromStore: Array<Delegator>,
    mandateId?: string
  ): Promise<NotificationDetailForRecipient> =>
    apiClient.get<NotificationDetail>(NOTIFICATION_DETAIL(iun, mandateId)).then((response) => {
      if (response.data) {
        return parseNotificationDetailForRecipient(
          response.data,
          currentUserTaxId,
          delegatorsFromStore,
          mandateId
        );
      } else {
        return {} as NotificationDetailForRecipient;
      }
    }),

  /**
   * Get notification iun and mandate id from aar link
   * @param {string} qrCode
   * @returns Promise
   */
  exchangeNotificationQrCode: (qrCode: string): Promise<NotificationId> =>
    apiClient
      .post<NotificationId>(NOTIFICATION_ID_FROM_QRCODE(), { aarQrCodeValue: qrCode })
      .then((response) => response.data),

  /**
   * Gets current user notification document
   * @param  {string} iun
   * @param  {number} documentIndex
   * @param  {string} mandateId
   * @returns Promise
   */
  getReceivedNotificationDocument: (
    iun: string,
    documentIndex: string,
    mandateId?: string
  ): Promise<{ url: string }> =>
    apiClient
      .get<{ url: string }>(NOTIFICATION_DETAIL_DOCUMENTS(iun, documentIndex, mandateId))
      .then((response) => getDownloadUrl(response)),

  /**
   *
   * @param  {string} iun
   * @param  {NotificationDetailOtherDocument} otherDocument
   * @returns Promise
   */
  getReceivedNotificationOtherDocument: (
    iun: string,
    otherDocument: NotificationDetailOtherDocument,
    mandateId?: string
  ): Promise<{ url: string }> =>
    apiClient
      .get<{ url: string }>(NOTIFICATION_DETAIL_OTHER_DOCUMENTS(iun, otherDocument), {
        params: { documentId: otherDocument.documentId, mandateId },
      })
      .then((response) => getDownloadUrl(response)),

  /**
   * Gets current user notification legalfact
   * @param  {string} iun
   * @param  {LegalFactId} legalFact
   * @param  {string} mandateId
   * @returns Promise
   */
  getReceivedNotificationLegalfact: (
    iun: string,
    legalFact: LegalFactId,
    mandateId?: string
  ): Promise<{ url: string }> =>
    apiClient
      .get<{ url: string }>(NOTIFICATION_DETAIL_LEGALFACT(iun, legalFact, mandateId))
      .then((response) => getDownloadUrl(response)),

  /**
   * Gets current user specified Payment Attachment
   * @param  {string} iun
   * @param  {PaymentAttachmentNameType} attachmentName
   * @param  {string} mandateId
   * @returns Promise
   */
  getPaymentAttachment: (
    iun: string,
    attachmentName: PaymentAttachmentNameType,
    mandateId?: string
  ): Promise<{ url: string }> =>
    apiClient
      .get<{ url: string }>(
        NOTIFICATION_PAYMENT_ATTACHMENT(iun, attachmentName as string, mandateId)
      )
      .then((response) => getDownloadUrl(response)),

  /**
   * Gets current user's notification payment info
   * @param  {string} noticeCode
   * @param  {string} taxId
   * @returns Promise
   */
  getNotificationPaymentInfo: (noticeCode: string, taxId: string): Promise<PaymentInfo> =>
    apiClient
      .get<PaymentInfo>(NOTIFICATION_PAYMENT_INFO(taxId, noticeCode))
      .then((response) => response.data),

  /**
   * Gets current user's notification payment url
   * @param  {string} noticeCode
   * @param  {string} taxId
   * @returns Promise
   */
  getNotificationPaymentUrl: (
    paymentNotice: PaymentNotice,
    returnUrl: string
  ): Promise<{ checkoutUrl: string }> =>
    apiClient
      .post<{ checkoutUrl: string }>(NOTIFICATION_PAYMENT_URL(), {
        paymentNotice,
        returnUrl,
      })
      .then((response) => response.data),
};
