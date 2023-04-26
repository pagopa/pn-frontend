import { LegalFactType, NotificationStatus, TimelineCategory } from "../../types";
import { NotificationDeliveryMode } from "../../types/NotificationDetail";
import { parseNotificationDetail } from "../notification.utility";
import { flexibleNotificationFromBE } from "./test-utils";

const multiTimeline = (digital1IsOK: boolean, sendDeliveredTo1 = false) => {
  const upToFirstAttempt = [
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
    {
      "elementId": "KQKX-WMDW-GDMU-202301-L-1_aar_gen_1",
      "category": TimelineCategory.AAR_GENERATION,
      "timestamp": "2023-01-26T13:55:22.755640353Z",
      "legalFactsIds": [],
      "details": { "recIndex": 1, "numberOfPages": 1, "generatedAarUrl": "safestorage://PN_AAR-0002-GO6M-7RQG-8PB7-YAFF" }
    },
    // send attempt - recipient 0
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
    // send attempt - recipient 1 - OK or KO depending on param
    {
      "elementId": "KQKX-WMDW-GDMU-202301-L-1_send_digital_domicile_1_source_PLATFORM_attempt_0",
      "category": TimelineCategory.SEND_DIGITAL_DOMICILE,
      "timestamp": "2023-01-26T13:57:06.651901435Z",
      "legalFactsIds": [],
      "details": {
        "digitalAddress": { "type": "PEC", "address": "toto86@gmail.com" },
        "recIndex": 1, "digitalAddressSource": "PLATFORM", "retryNumber": 0
      }
    },
    {
      "elementId": "KQKX-WMDW-GDMU-202301-L-1_digital_delivering_progress_1_source_PLATFORM_attempt_0_progidx_1",
      "category": TimelineCategory.SEND_DIGITAL_PROGRESS,
      "timestamp": "2023-01-26T13:57:14.000870007Z",
      "legalFactsIds": [
        { "key": "mock-pec-accepted-receipt-1-0", "category": LegalFactType.PEC_RECEIPT, }
      ],
      "details": {
        "digitalAddress": { "type": "PEC", "address": "toto86@gmail.com" },
        "recIndex": 1, "digitalAddressSource": "PLATFORM", "retryNumber": 1,
        "deliveryDetailCode": "C001",
        "notificationDate": "2023-01-26T13:57:12.224667703Z", "sendingReceipts": [{}], "shouldRetry": false
      }
    },
    {
      "elementId": "KQKX-WMDW-GDMU-202301-L-1_send_digital_feedback_1_source_PLATFORM_attempt_0",
      "category": TimelineCategory.SEND_DIGITAL_FEEDBACK,
      "timestamp": "2023-01-26T13:57:18.001161877Z",
      "legalFactsIds": [
        { "key": "mock-pec-failure-receipt-1-0", "category": LegalFactType.PEC_RECEIPT }
      ],
      "details": {
        "digitalAddress": { "type": "PEC", "address": "toto86@gmail.com" },
        "recIndex": 1, "digitalAddressSource": "PLATFORM", 
        "responseStatus": digital1IsOK ? "OK" : "KO",
        "notificationDate": "2023-01-26T13:57:17.3033Z", "sendingReceipts": [{}],
      }
    },
  ];

  const digitalSuccess1 = [
    {
      "elementId": "KQKX-WMDW-GDMU-202301-L-1_digital_success_workflow_1",
      "category": TimelineCategory.DIGITAL_SUCCESS_WORKFLOW,
      "timestamp": "2023-01-26T13:59:12.42843144Z",
      "legalFactsIds": [
        { "key": "digital-success-1", "category": LegalFactType.DIGITAL_DELIVERY }
      ],
      "details": {
        "recIndex": 1, "digitalAddress": { "type": "PEC", "address": "toto86@gmail.com" }
      }
    },
    {
      "elementId": "KQKX-WMDW-GDMU-202301-L-1_schedule_refinement_workflow_1",
      "category": TimelineCategory.SCHEDULE_REFINEMENT,
      "timestamp": "2023-01-26T13:59:16.525827086Z",
      "legalFactsIds": [],
      "details": { "recIndex": 1 }
    },
  ];

  const sendDelivered1 = [
    {
      "elementId": "KQKX-WMDW-GDMU-202301-L-1_digital_failure_workflow_1",
      "category": TimelineCategory.DIGITAL_FAILURE_WORKFLOW,
      "timestamp": "2023-01-26T14:06:12.42843144Z",
      "legalFactsIds": [
        { "key": "digital-failure-1", "category": LegalFactType.DIGITAL_DELIVERY }
      ],
      "details": {
        "recIndex": 1, "digitalAddress": { "type": "PEC", "address": "toto86@gmail.com" }
      }
    },
    {
      "elementId": "KQKX-WMDW-GDMU-202301-L-1_schedule_refinement_workflow_1",
      "category": TimelineCategory.SCHEDULE_REFINEMENT,
      "timestamp": "2023-01-26T14:07:16.525827086Z",
      "legalFactsIds": [],
      "details": { "recIndex": 1 }
    },
    {
      "elementId": "KQKX-WMDW-GDMU-202301-L-1_prepare_simple_registered_letter_1",
      "category": TimelineCategory.PREPARE_SIMPLE_REGISTERED_LETTER,
      "timestamp": "2023-01-26T14:07:18.525827086Z",
      "legalFactsIds": [],
      "details": {
        "recIndex": 1,
        "physicalAddress": {
          "at": "", "address": "Via Roma 145", "addressDetails": "", "zip": "98036", 
          "municipality": "Graniti", "province": "Messina"
        },
      }
    },
    {
      "elementId": "KQKX-WMDW-GDMU-202301-L-1_send_simple_registered_letter_1",
      "category": TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER,
      "timestamp": "2023-01-26T14:20:10.525827086Z",
      "legalFactsIds": [],
      "details": {
        "recIndex": 1,
        "physicalAddress": {
          "at": "", "address": "Via Roma 145", "addressDetails": "", "zip": "98036", 
          "municipality": "Graniti", "province": "Messina"
        },
        "productType": "RN_RS"
      }
    },
  ];

  return [
    ...upToFirstAttempt,
    // inject success of digital workflow for recipient 1 if required
    ...(digital1IsOK ? digitalSuccess1 : []),
    // inject send registered letter for recipient 1 if required
    ...(sendDeliveredTo1 ? sendDelivered1 : []),
    // send registered letter for recipient 0
    {
      "elementId": "KQKX-WMDW-GDMU-202301-L-1_digital_failure_workflow_0",
      "category": TimelineCategory.DIGITAL_FAILURE_WORKFLOW,
      "timestamp": "2023-01-26T14:16:12.42843144Z",
      "legalFactsIds": [
        { "key": "digital-failure-0", "category": LegalFactType.DIGITAL_DELIVERY }
      ],
      "details": {
        "recIndex": 0, "digitalAddress": { "type": "PEC", "address": "manudido99@gmail.com" }
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
  ]
};

const multiHistory = (digital1IsOK: boolean, sendRegisteredTo1 = false, deliveredStartsWithSuccess = false) => {
  if (deliveredStartsWithSuccess && !digital1IsOK) {
    throw new Error("wrong configuration - delivered status cannot start with success if success is not included!");
  }

  const digitalSuccess1 = [
    "KQKX-WMDW-GDMU-202301-L-1_digital_success_workflow_1",
    "KQKX-WMDW-GDMU-202301-L-1_schedule_refinement_workflow_1",
  ];

  const sendRegisteredLetter0 = [
    "KQKX-WMDW-GDMU-202301-L-1_digital_failure_workflow_0",
    "KQKX-WMDW-GDMU-202301-L-1_schedule_refinement_workflow_0",
    "KQKX-WMDW-GDMU-202301-L-1_prepare_simple_registered_letter_0",
    "KQKX-WMDW-GDMU-202301-L-1_send_simple_registered_letter_0",
  ];

  const sendRegisteredLetter1 = [
    "KQKX-WMDW-GDMU-202301-L-1_digital_failure_workflow_1",
    "KQKX-WMDW-GDMU-202301-L-1_schedule_refinement_workflow_1",
    "KQKX-WMDW-GDMU-202301-L-1_prepare_simple_registered_letter_1",
    "KQKX-WMDW-GDMU-202301-L-1_send_simple_registered_letter_1",
  ];

  const deliveredStatus =     {
    status: NotificationStatus.DELIVERED,
    activeFrom: digital1IsOK && deliveredStartsWithSuccess 
      ? '2023-01-26T13:59:12.42843144Z' 
      : (sendRegisteredTo1 ? "2023-01-26T14:06:12.42843144Z" : "2023-01-26T14:16:12.42843144Z"),
    relatedTimelineElements: [
      // possibly the digital success for recipient 1
      ...(digital1IsOK && deliveredStartsWithSuccess ? digitalSuccess1 : []),
      ...sendRegisteredLetter0
    ],
  };

  return [
    {
      status: NotificationStatus.ACCEPTED,
      activeFrom: '2023-01-26T13:55:15.975574085Z',
      relatedTimelineElements: [
        "KQKX-WMDW-GDMU-202301-L-1_request_accepted",
        "KQKX-WMDW-GDMU-202301-L-1_aar_gen_0",
        "KQKX-WMDW-GDMU-202301-L-1_aar_gen_1",
      ],
    },
    {
      status: NotificationStatus.DELIVERING,
      activeFrom: '2023-01-26T13:55:52.651901435Z',
      relatedTimelineElements: [
        // attempt recipient 0
        "KQKX-WMDW-GDMU-202301-L-1_send_digital_domicile_0_source_PLATFORM_attempt_0",
        "KQKX-WMDW-GDMU-202301-L-1_digital_delivering_progress_0_source_PLATFORM_attempt_0_progidx_1",
        "KQKX-WMDW-GDMU-202301-L-1_send_digital_feedback_0_source_PLATFORM_attempt_0",
        // attempt recipient 1
        "KQKX-WMDW-GDMU-202301-L-1_send_digital_domicile_1_source_PLATFORM_attempt_0",
        "KQKX-WMDW-GDMU-202301-L-1_digital_delivering_progress_1_source_PLATFORM_attempt_0_progidx_1",
        "KQKX-WMDW-GDMU-202301-L-1_send_digital_feedback_1_source_PLATFORM_attempt_0",
        // possibly the digital success for recipient 1
        ...(digital1IsOK && !deliveredStartsWithSuccess ? digitalSuccess1 : []),
        // possibly send simple registered letter for recipient 1
        ...(sendRegisteredTo1 ? sendRegisteredLetter1 : []),
        // possibly failure & send simple registered letter for recipient 0
        ...(digital1IsOK || sendRegisteredTo1 ? [] : sendRegisteredLetter0),
      ],
    },
    ...(digital1IsOK || sendRegisteredTo1 ? [deliveredStatus] : [])
  ]
};

describe('parseNotificationDetail scenarios - multi recipient', () => {
  // even if this scenario is not possible because at the moment the notification 
  // passes to DELIVERED with the *last* delivery outcome, 
  // I prefer to test it nonetheless ... just in case
  // ---------------------------------------------------------
  // Carlos Lombardi, 2023.02.14
  // ---------------------------------------------------------
  it('rec0 simple registered letter, rec1 digital success - digital success in DELIVERED', () => {
    const notificationBe = flexibleNotificationFromBE(
      NotificationStatus.DELIVERED, multiHistory(true, false, true), multiTimeline(true), 2
    );
    const notificationFe = parseNotificationDetail(notificationBe);
    const deliveredStatus = notificationFe.notificationStatusHistory[0];
    expect(deliveredStatus.deliveryMode).toEqual(NotificationDeliveryMode.DIGITAL);
    expect(deliveredStatus.activeFrom).toEqual('2023-01-26T13:59:12.42843144Z');
    expect(deliveredStatus.steps).toHaveLength(6);
    expect(deliveredStatus.steps && deliveredStatus.steps[0].category).toEqual(TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER);
    expect(deliveredStatus.steps && deliveredStatus.steps[5].category).toEqual(TimelineCategory.DIGITAL_SUCCESS_WORKFLOW);
  });

  // this is the actual scenario given the current specifications about the notification workflow
  it('rec0 simple registered letter, rec1 digital success - digital success in DELIVERING', () => {
    const notificationBe = flexibleNotificationFromBE(
      NotificationStatus.DELIVERED, multiHistory(true, false, false), multiTimeline(true), 2
    );
    const notificationFe = parseNotificationDetail(notificationBe);
    const deliveredStatus = notificationFe.notificationStatusHistory[0];
    const deliveringStatus = notificationFe.notificationStatusHistory[1];
    expect(deliveredStatus.deliveryMode).toEqual(NotificationDeliveryMode.DIGITAL);
    expect(deliveredStatus.activeFrom).toEqual('2023-01-26T14:20:20.525827086Z');
    expect(deliveredStatus.steps).toHaveLength(0);
    expect(deliveringStatus.steps).toHaveLength(15);
    expect(deliveringStatus.steps && deliveringStatus.steps[0].category).toEqual(TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER);
    expect(deliveringStatus.steps && deliveringStatus.steps[5].category).toEqual(TimelineCategory.DIGITAL_SUCCESS_WORKFLOW);
    expect(deliveringStatus.steps && deliveringStatus.steps[6].category).toEqual(TimelineCategory.SEND_DIGITAL_FEEDBACK);
    expect((deliveringStatus.steps && deliveringStatus.steps[6].details as any).responseStatus).toEqual("OK");
  });

  it('rec0 simple registered letter, rec1 still delivering', () => {
    const notificationBe = flexibleNotificationFromBE(
      NotificationStatus.DELIVERED, multiHistory(false, false), multiTimeline(false, false), 2
    );
    const notificationFe = parseNotificationDetail(notificationBe);
    const deliveringStatus = notificationFe.notificationStatusHistory[0];
    expect(deliveringStatus.status).toEqual(NotificationStatus.DELIVERING);
    expect(deliveringStatus.steps).toHaveLength(13);
    expect(deliveringStatus.steps && deliveringStatus.steps[0].category).toEqual(TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER);
    expect(deliveringStatus.steps && deliveringStatus.steps[4].category).toEqual(TimelineCategory.SEND_DIGITAL_FEEDBACK);
    expect((deliveringStatus.steps && deliveringStatus.steps[4].details as any).responseStatus).toEqual("KO");
  });

  it('both rec0 and rec1 simple registered letter', () => {
    const notificationBe = flexibleNotificationFromBE(
      NotificationStatus.DELIVERED, multiHistory(false, true), multiTimeline(false, true), 2
    );
    const notificationFe = parseNotificationDetail(notificationBe);
    const deliveredStatus = notificationFe.notificationStatusHistory[0];
    const deliveringStatus = notificationFe.notificationStatusHistory[1];
    expect(deliveredStatus.deliveryMode).toEqual(NotificationDeliveryMode.ANALOG);
    expect(deliveredStatus.activeFrom).toEqual('2023-01-26T14:20:20.525827086Z');
    expect(deliveredStatus.steps).toHaveLength(0);
    expect(deliveringStatus.steps).toHaveLength(17);
    expect(deliveringStatus.steps && deliveringStatus.steps[0].category).toEqual(TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER);
    expect(deliveringStatus.steps && deliveringStatus.steps[0].details.recIndex).toEqual(0);
    expect(deliveringStatus.steps && deliveringStatus.steps[4].category).toEqual(TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER);
    expect(deliveringStatus.steps && deliveringStatus.steps[4].details.recIndex).toEqual(1);
    expect(deliveringStatus.steps && deliveringStatus.steps[8].category).toEqual(TimelineCategory.SEND_DIGITAL_FEEDBACK);
    expect((deliveringStatus.steps && deliveringStatus.steps[8].details as any).responseStatus).toEqual("KO");
    expect(deliveringStatus.steps && deliveringStatus.steps[8].details.recIndex).toEqual(1);
  });  
});
