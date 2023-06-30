import { LegalFactType, NotificationStatus, TimelineCategory } from "../../types";
import { NotificationDeliveryMode } from "../../types/NotificationDetail";
import { parseNotificationDetail } from "../notification.utility";
import { flexibleNotificationFromBE } from "./test-utils";

const eventsUpToSecondAttempt = [
  {
    "elementId": "KQKX-WMDW-GDMU-202301-L-1_request_accepted",
    "category": TimelineCategory.REQUEST_ACCEPTED,
    "timestamp": "2023-01-26T13:55:15.975574085Z",
    "legalFactsIds": [ { "key": "mock-sender-ack", "category": LegalFactType.SENDER_ACK, } ],
    "details": { },
  },
  {
    "elementId": "KQKX-WMDW-GDMU-202301-L-1_aar_gen_0",
    "category": TimelineCategory.AAR_GENERATION,
    "timestamp": "2023-01-26T13:55:22.715640353Z",
    "legalFactsIds": [],
    "details": { "recIndex": 0, "numberOfPages": 1, "generatedAarUrl": "safestorage://PN_AAR-0002-GO6M-7RQG-8PB7-YAER" }
  },
  // first send attempt
  {
    "elementId": "KQKX-WMDW-GDMU-202301-L-1_send_digital_domicile_0_source_PLATFORM_attempt_0",
    "category": TimelineCategory.SEND_DIGITAL_DOMICILE,
    "timestamp": "2023-01-26T13:55:52.651901435Z",
    "legalFactsIds": [],
    "details": {
      "digitalAddress": { "type": "PEC", "address": "manudido99@gmail.com" },
      "recIndex": 0, "digitalAddressSource": "PLATFORM", "retryNumber": 0,
    }
  },
  {
    "elementId": "KQKX-WMDW-GDMU-202301-L-1_digital_delivering_progress_0_source_PLATFORM_attempt_0_progidx_1",
    "timestamp": "2023-01-26T13:56:05.000870007Z",
    "category": TimelineCategory.SEND_DIGITAL_PROGRESS,
    "legalFactsIds": [
      { "key": "mock-pec-accepted-receipt-0-0", "category": LegalFactType.PEC_RECEIPT, }
    ],
    "details": {
      "digitalAddress": { "type": "PEC", "address": "manudido99@gmail.com" },
      "recIndex": 0, "digitalAddressSource": "PLATFORM", "retryNumber": 0,
      "deliveryDetailCode": "C001",
      "notificationDate": "2023-01-26T13:56:06.224667703Z", "sendingReceipts": [{}],  "shouldRetry": false,
    }
  },
  {
    "elementId": "KQKX-WMDW-GDMU-202301-L-1_send_digital_feedback_0_source_PLATFORM_attempt_0",
    "category": TimelineCategory.SEND_DIGITAL_FEEDBACK,
    "timestamp": "2023-01-26T13:56:15.001161877Z",
    "legalFactsIds": [
      { "key": "mock-pec-failure-receipt-0-0", "category": LegalFactType.PEC_RECEIPT }
    ],
    "details": {
      "digitalAddress": { "type": "PEC", "address": "manudido99@gmail.com" },
      "recIndex": 0, "digitalAddressSource": "PLATFORM", 
      "responseStatus": "KO",
      "notificationDate": "2023-01-26T13:56:15.001161877Z", "sendingReceipts": [{}],
    }
  },
  {
    "elementId": "KQKX-WMDW-GDMU-202301-L-1_schedule_digital_workflow_0_source_PLATFORM_retry_0",
    "category": TimelineCategory.SCHEDULE_DIGITAL_WORKFLOW,
    "timestamp": "2023-01-26T13:57:34.001161877Z",
    "legalFactsIds": [],
    "details": { "recIndex": 0, "digitalAddressSource": "PLATFORM", 
    "sentAttemptMade": 0, "lastAttemptDate": "2023-02-08T17:08:10.95299597Z"
    }
  },
  // second send attempt
  {
    "elementId": "KQKX-WMDW-GDMU-202301-L-1_send_digital_domicile_0_source_PLATFORM_attempt_1",
    "category": TimelineCategory.SEND_DIGITAL_DOMICILE,
    "timestamp": "2023-01-26T14:05:40.651901435Z",
    "legalFactsIds": [],
    "details": {
      "digitalAddress": { "type": "PEC", "address": "manudido86@gmail.com" },
      "recIndex": 0, "digitalAddressSource": "PLATFORM", "retryNumber": 1
    }
  },
  {
    "elementId": "KQKX-WMDW-GDMU-202301-L-1_digital_delivering_progress_0_source_PLATFORM_attempt_1_progidx_1",
    "category": TimelineCategory.SEND_DIGITAL_PROGRESS,
    "timestamp": "2023-01-26T14:05:42.000870007Z",
    "legalFactsIds": [
      { "key": "mock-pec-accepted-receipt-0-1", "category": LegalFactType.PEC_RECEIPT, }
    ],
    "details": {
      "digitalAddress": { "type": "PEC", "address": "manudido86@gmail.com" },
      "recIndex": 0, "digitalAddressSource": "PLATFORM", "retryNumber": 1,
      "deliveryDetailCode": "C001",
      "notificationDate": "2023-01-26T13:57:41.224667703Z", "sendingReceipts": [{}], "shouldRetry": false
    }
  },
];

const sendRegisteredLetterBeTimeline = () => [
  ...eventsUpToSecondAttempt,
  {
    "elementId": "KQKX-WMDW-GDMU-202301-L-1_send_digital_feedback_0_source_PLATFORM_attempt_1",
    "timestamp": "2023-01-26T14:05:44.001161877Z",
    "legalFactsIds": [
      { "key": "mock-pec-failure-receipt-0-0", "category": LegalFactType.PEC_RECEIPT }
    ],
    "category": TimelineCategory.SEND_DIGITAL_FEEDBACK,
    "details": {
      "digitalAddress": { "type": "PEC", "address": "manudido86@gmail.com" }, 
      "recIndex": 0, "digitalAddressSource": "PLATFORM",
      "responseStatus": "KO",
      "notificationDate": "2023-01-26T13:57:43.001161877Z", "sendingReceipts": [{}]
    }
  },
  // digital failure
  {
    "elementId": "KQKX-WMDW-GDMU-202301-L-1_digital_failure_workflow_0",
    "category": TimelineCategory.DIGITAL_FAILURE_WORKFLOW,
    "timestamp": "2023-01-26T14:16:12.42843144Z",
    "legalFactsIds": [
      { "key": "digital-failure-0", "category": LegalFactType.DIGITAL_DELIVERY }
    ],
    "details": {
      "recIndex": 0, "digitalAddress": { "type": "PEC", "address": "manudido86@gmail.com" }
    }
  },
  {
    "elementId": "KQKX-WMDW-GDMU-202301-L-1_schedule_refinement_workflow_0",
    "category": TimelineCategory.SCHEDULE_REFINEMENT,
    "timestamp": "2023-01-26T14:17:16.525827086Z",
    "legalFactsIds": [],
    "details": { "recIndex": 0 }
  },
  {
    "elementId": "KQKX-WMDW-GDMU-202301-L-1_prepare_simple_registered_letter_0",
    "category": TimelineCategory.PREPARE_SIMPLE_REGISTERED_LETTER,
    "timestamp": "2023-01-26T14:17:18.525827086Z",
    "legalFactsIds": [],
    "details": {
      "recIndex": 0,
      "physicalAddress": {
        "at": "", "address": "via prova 45", "addressDetails": "", "zip": "20121", 
        "municipality": "milano", "province": "milano"
      }
    }
  },
  {
    "elementId": "KQKX-WMDW-GDMU-202301-L-1_send_simple_registered_letter_0",
    "category": TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER,
    "timestamp": "2023-01-26T14:20:20.525827086Z",
    "legalFactsIds": [],
    "details": {
      "recIndex": 0,
      "physicalAddress": {
        "at": "", "address": "via prova 45", "addressDetails": "", "zip": "20121", 
        "municipality": "milano", "province": "milano"
      },
      "productType": "RN_RS"
    }
  },
];

const digitalSendOkSecondAttemptBeTimeline = () => [
  ...eventsUpToSecondAttempt,
  {
    "elementId": "KQKX-WMDW-GDMU-202301-L-1_send_digital_feedback_0_source_PLATFORM_attempt_1",
    "timestamp": "2023-01-26T14:05:44.001161877Z",
    "legalFactsIds": [
      { "key": "mock-pec-failure-receipt-0-0", "category": LegalFactType.PEC_RECEIPT }
    ],
    "category": TimelineCategory.SEND_DIGITAL_FEEDBACK,
    "details": {
      "digitalAddress": { "type": "PEC", "address": "manudido86@gmail.com" }, 
      "recIndex": 0, "digitalAddressSource": "PLATFORM",
      "responseStatus": "OK",
      "notificationDate": "2023-01-26T13:57:43.001161877Z", "sendingReceipts": [{}]
    }
  },
  // digital success
  {
    "elementId": "KQKX-WMDW-GDMU-202301-L-1_digital_success_workflow_0",
    "category": TimelineCategory.DIGITAL_SUCCESS_WORKFLOW,
    "timestamp": "2023-01-26T14:16:12.42843144Z",
    "legalFactsIds": [
      { "key": "digital-success-0", "category": LegalFactType.DIGITAL_DELIVERY }
    ],
    "details": {
      "recIndex": 0, "digitalAddress": { "type": "PEC", "address": "manudido86@gmail.com" }
    }
  },
  {
    "elementId": "KQKX-WMDW-GDMU-202301-L-1_schedule_refinement_workflow_0",
    "category": TimelineCategory.SCHEDULE_REFINEMENT,
    "timestamp": "2023-01-26T14:17:16.525827086Z",
    "legalFactsIds": [],
    "details": { "recIndex": 0 }
  },
];

const justFailedAttemptsBeTimeline = () => [
  ...eventsUpToSecondAttempt,
  {
    "elementId": "KQKX-WMDW-GDMU-202301-L-1_send_digital_feedback_0_source_PLATFORM_attempt_1",
    "timestamp": "2023-01-26T14:05:44.001161877Z",
    "legalFactsIds": [
      { "key": "mock-pec-failure-receipt-0-0", "category": LegalFactType.PEC_RECEIPT }
    ],
    "category": TimelineCategory.SEND_DIGITAL_FEEDBACK,
    "details": {
      "digitalAddress": { "type": "PEC", "address": "manudido86@gmail.com" }, 
      "recIndex": 0, "digitalAddressSource": "PLATFORM",
      "responseStatus": "KO",
      "notificationDate": "2023-01-26T13:57:43.001161877Z", "sendingReceipts": [{}]
    }
  },
];


const beStatusHistoryUpToDelivering = () => [
  {
    status: NotificationStatus.ACCEPTED,
    activeFrom: '2023-01-26T13:55:15.975574085Z',
    relatedTimelineElements: [
      "KQKX-WMDW-GDMU-202301-L-1_request_accepted",
      "KQKX-WMDW-GDMU-202301-L-1_aar_gen_0",
    ],
  },
  {
    status: NotificationStatus.DELIVERING,
    activeFrom: '2023-01-26T13:55:52.651901435Z',
    relatedTimelineElements: [
      // first attempt
      "KQKX-WMDW-GDMU-202301-L-1_send_digital_domicile_0_source_PLATFORM_attempt_0",
      "KQKX-WMDW-GDMU-202301-L-1_digital_delivering_progress_0_source_PLATFORM_attempt_0_progidx_1",
      "KQKX-WMDW-GDMU-202301-L-1_send_digital_feedback_0_source_PLATFORM_attempt_0",
      "KQKX-WMDW-GDMU-202301-L-1_schedule_digital_workflow_0_source_PLATFORM_retry_0",
      // second attempt
      "KQKX-WMDW-GDMU-202301-L-1_send_digital_domicile_0_source_PLATFORM_attempt_1",
      "KQKX-WMDW-GDMU-202301-L-1_digital_delivering_progress_0_source_PLATFORM_attempt_1_progidx_1",
      "KQKX-WMDW-GDMU-202301-L-1_send_digital_feedback_0_source_PLATFORM_attempt_1",
    ],
  },
];

const sendRegisteredLetterBeStatusHistory = () => [
  ...beStatusHistoryUpToDelivering(),
  {
    status: NotificationStatus.DELIVERED,
    activeFrom: '2023-01-26T14:16:12.42843144Z',
    relatedTimelineElements: [
      "KQKX-WMDW-GDMU-202301-L-1_digital_failure_workflow_0",
      "KQKX-WMDW-GDMU-202301-L-1_schedule_refinement_workflow_0",
      "KQKX-WMDW-GDMU-202301-L-1_prepare_simple_registered_letter_0",
      "KQKX-WMDW-GDMU-202301-L-1_send_simple_registered_letter_0",
    ],
  },
];

const digitalSendOkSecondAttemptStatusHistory = () => [
  ...beStatusHistoryUpToDelivering(),
  {
    status: NotificationStatus.DELIVERED,
    activeFrom: '2023-01-26T14:16:12.42843144Z',
    relatedTimelineElements: [
      "KQKX-WMDW-GDMU-202301-L-1_digital_success_workflow_0",
      "KQKX-WMDW-GDMU-202301-L-1_schedule_refinement_workflow_0",
    ],
  },
];

const justFailedAttemptsStatusHistory = () => [
  ...beStatusHistoryUpToDelivering(),
  {
    status: NotificationStatus.DELIVERED,
    activeFrom: '2023-01-26T14:16:12.42843144Z',
    relatedTimelineElements: [ ],
  },
];

describe('parseNotificationDetail scenarios - single recipient', () => {
  it('send simple registered letter scenario - should shift timeline events from DELIVERED to DELIVERING', () => {
    const notificationBe = flexibleNotificationFromBE(
      NotificationStatus.DELIVERED, sendRegisteredLetterBeStatusHistory(), sendRegisteredLetterBeTimeline()
    );
    const notificationFe = parseNotificationDetail(notificationBe);
    expect(notificationFe.notificationStatus).toEqual(NotificationStatus.DELIVERED);
    const deliveredStatus = notificationFe.notificationStatusHistory[0];
    expect(deliveredStatus.status).toEqual(NotificationStatus.DELIVERED);
    expect(deliveredStatus.deliveryMode).toEqual(NotificationDeliveryMode.ANALOG);
    expect(deliveredStatus.steps).toHaveLength(0);
    expect(deliveredStatus.activeFrom).toEqual("2023-01-26T14:20:20.525827086Z");
    const deliveringStatus = notificationFe.notificationStatusHistory[1];
    expect(deliveringStatus.status).toEqual(NotificationStatus.DELIVERING);
    expect(deliveringStatus.steps).toHaveLength(13); // also the steps from ACCEPTED are copied
    expect(deliveringStatus.steps && deliveringStatus.steps[0]?.category).toEqual(TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER);
    expect(deliveringStatus.steps && deliveringStatus.steps[3]?.category).toEqual(TimelineCategory.DIGITAL_FAILURE_WORKFLOW);
    expect(deliveringStatus.steps && deliveringStatus.steps[4]?.category).toEqual(TimelineCategory.SEND_DIGITAL_FEEDBACK);
    expect((deliveringStatus.steps && deliveringStatus.steps[4]?.details as any).responseStatus).toEqual("KO");
    expect(deliveringStatus.steps && deliveringStatus.steps[5]?.category).toEqual(TimelineCategory.SEND_DIGITAL_PROGRESS);
    expect((deliveringStatus.steps && deliveringStatus.steps[5]?.details as any).retryNumber).toEqual(1);
    expect(deliveringStatus.steps && deliveringStatus.steps[10]?.category).toEqual(TimelineCategory.SEND_DIGITAL_DOMICILE);
  });

  it('ok second digital send attempt scenario - should not shift timeline events', () => {
    const notificationBe = flexibleNotificationFromBE(
      NotificationStatus.DELIVERED, digitalSendOkSecondAttemptStatusHistory(), digitalSendOkSecondAttemptBeTimeline()
    );
    const notificationFe = parseNotificationDetail(notificationBe);
    expect(notificationFe.notificationStatus).toEqual(NotificationStatus.DELIVERED);
    const deliveredStatus = notificationFe.notificationStatusHistory[0];
    expect(deliveredStatus.status).toEqual(NotificationStatus.DELIVERED);
    expect(deliveredStatus.deliveryMode).toEqual(NotificationDeliveryMode.DIGITAL);
    expect(deliveredStatus.steps).toHaveLength(2);
    expect(deliveredStatus.activeFrom).toEqual("2023-01-26T14:16:12.42843144Z");
    expect(deliveredStatus.steps && deliveredStatus.steps[1]?.category).toEqual(TimelineCategory.DIGITAL_SUCCESS_WORKFLOW);
    const deliveringStatus = notificationFe.notificationStatusHistory[1];
    expect(deliveringStatus.status).toEqual(NotificationStatus.DELIVERING);
    expect(deliveringStatus.steps).toHaveLength(9); // the steps from ACCEPTED are copied
    expect(deliveringStatus.steps && deliveringStatus.steps[0]?.category).toEqual(TimelineCategory.SEND_DIGITAL_FEEDBACK);
  });

  it('just attempts (scenario for multirecipient and delivered to another recipient) - should not have delivered status', () => {
    const notificationBe = flexibleNotificationFromBE(
      NotificationStatus.DELIVERED, justFailedAttemptsStatusHistory(), justFailedAttemptsBeTimeline()
    );
    const notificationFe = parseNotificationDetail(notificationBe);
    const deliveredStatus = notificationFe.notificationStatusHistory[0];
    expect(deliveredStatus.status).toEqual(NotificationStatus.DELIVERED);
    expect(deliveredStatus.deliveryMode).toBeUndefined();
  });

  it('AAR documents should not contains denomination and tax id recipients in titles', () => {
    const notificationBe = flexibleNotificationFromBE(
      NotificationStatus.DELIVERED, sendRegisteredLetterBeStatusHistory(), sendRegisteredLetterBeTimeline()
    );
    const notificationFe = parseNotificationDetail(notificationBe);
    for(const aar of notificationFe.otherDocuments!) {
      expect(aar.title).toEqual('Avviso di avvenuta ricezione');
    }
  });
});
