import _ from 'lodash';

import { paymentInfo } from '../../__mocks__/ExternalRegistry.mock';
import {
  getTimelineElem,
  notificationDTO,
  notificationDTOMultiRecipient,
  notificationToFe,
  notificationToFeMultiRecipient,
  payments,
} from '../../__mocks__/NotificationDetail.mock';
import { initLocalization } from '../../services';
import { initLocalizationForTest } from '../../test-utils';
import {
  DigitalDomicileType,
  LegalFactType,
  NotificationDeliveryMode,
  NotificationDetailRecipient,
  NotificationStatus,
  NotificationStatusHistory,
  RecipientType,
  SendDigitalDetails,
  TimelineCategory,
} from '../../types';
import {
  AarDetails,
  AppIoCourtesyMessageEventType,
  INotificationDetailTimeline,
  PagoPAPaymentFullDetails,
  PaidDetails,
  PaymentDetails,
  PaymentStatus,
  PaymentsData,
  ViewedDetails,
} from '../../types/NotificationDetail';
import { TimelineStepFactory } from '../TimelineUtils/TimelineStepFactory';
import { formatDate } from '../date.utility';
import {
  getF24Payments,
  getLegalFactLabel,
  getNotificationStatusInfos,
  getNotificationTimelineStatusInfos,
  getPagoPaF24Payments,
  parseNotificationDetail,
  populatePaymentsPagoPaF24,
} from '../notification.utility';

function testNotificationStatusInfos(
  expectedColor:
    | 'warning'
    | 'error'
    | 'success'
    | 'info'
    | 'default'
    | 'primary'
    | 'secondary'
    | undefined,
  expectedLabel: string,
  expectedTooltip: string,
  expectedDescription: string,
  status: NotificationStatus | NotificationStatusHistory,
  options?: { recipients: Array<NotificationDetailRecipient | string> }
) {
  const { color, label, tooltip, description } = getNotificationStatusInfos(status, options);
  expect(color).toBe(expectedColor);
  expect(label).toStrictEqual(expectedLabel);
  expect(tooltip).toStrictEqual(expectedTooltip);
  expect(description).toStrictEqual(expectedDescription);
}

describe('notification status texts', () => {
  beforeAll(() => {
    initLocalizationForTest();
  });

  it('return notification status infos - DELIVERED - single recipient - analog shipment', () => {
    testNotificationStatusInfos(
      'default',
      `notifiche - status.delivered`,
      `notifiche - status.delivered-tooltip`,
      `notifiche - status.delivered-description-with-delivery-mode - ${JSON.stringify({
        deliveryMode: `notifiche - status.deliveryMode.${NotificationDeliveryMode.ANALOG}`,
      })}`,
      {
        status: NotificationStatus.DELIVERED,
        activeFrom: '2023-01-26T13:57:16.42843144Z',
        relatedTimelineElements: [],
        deliveryMode: NotificationDeliveryMode.ANALOG,
      },
      {
        recipients: notificationToFe.recipients,
      }
    );
  });

  it('return notification status infos - DELIVERED - single recipient - digital shipment', () => {
    testNotificationStatusInfos(
      'default',
      `notifiche - status.delivered`,
      `notifiche - status.delivered-tooltip`,
      `notifiche - status.delivered-description-with-delivery-mode - ${JSON.stringify({
        deliveryMode: `notifiche - status.deliveryMode.${NotificationDeliveryMode.DIGITAL}`,
      })}`,
      {
        status: NotificationStatus.DELIVERED,
        activeFrom: '2023-01-26T13:57:16.42843144Z',
        relatedTimelineElements: [],
        deliveryMode: NotificationDeliveryMode.DIGITAL,
      },
      {
        recipients: notificationToFe.recipients,
      }
    );
  });

  it('return notification status infos - DELIVERED - single recipient - no delivery mode specified', () => {
    testNotificationStatusInfos(
      'default',
      `notifiche - status.delivered`,
      `notifiche - status.delivered-tooltip`,
      `notifiche - status.delivered-description-with-delivery-mode - ${JSON.stringify({
        deliveryMode: `notifiche - status.deliveryMode.${NotificationDeliveryMode.DIGITAL}`,
      })}`,
      {
        status: NotificationStatus.DELIVERED,
        activeFrom: '2023-01-26T13:57:16.42843144Z',
        relatedTimelineElements: [],
        deliveryMode: NotificationDeliveryMode.DIGITAL,
      },
      {
        recipients: notificationToFe.recipients,
      }
    );
  });

  it('return notification status infos - DELIVERED - multi recipient - analog shipment', () => {
    testNotificationStatusInfos(
      'default',
      `notifiche - status.delivered-multirecipient`,
      `notifiche - status.delivered-tooltip-multirecipient`,
      `notifiche - status.delivered-description-multirecipient`,
      {
        status: NotificationStatus.DELIVERED,
        activeFrom: '2023-01-26T13:57:16.42843144Z',
        relatedTimelineElements: [],
        deliveryMode: NotificationDeliveryMode.ANALOG,
      },
      {
        recipients: notificationToFeMultiRecipient.recipients,
      }
    );
  });

  it('return notification status infos - DELIVERED - multi recipient - digital shipment', () => {
    testNotificationStatusInfos(
      'default',
      `notifiche - status.delivered-multirecipient`,
      `notifiche - status.delivered-tooltip-multirecipient`,
      `notifiche - status.delivered-description-multirecipient`,
      {
        status: NotificationStatus.DELIVERED,
        activeFrom: '2023-01-26T13:57:16.42843144Z',
        relatedTimelineElements: [],
        deliveryMode: NotificationDeliveryMode.DIGITAL,
      },
      {
        recipients: notificationToFeMultiRecipient.recipients,
      }
    );
  });

  it('return notification status infos - DELIVERING', () => {
    testNotificationStatusInfos(
      'default',
      `notifiche - status.delivering`,
      `notifiche - status.delivering-tooltip`,
      `notifiche - status.delivering-description`,
      {
        status: NotificationStatus.DELIVERING,
        activeFrom: '2023-01-26T13:57:16.42843144Z',
        relatedTimelineElements: [],
        deliveryMode: NotificationDeliveryMode.DIGITAL,
      }
    );
  });

  it('return notification status infos - DELIVERING - passing the status only', () => {
    testNotificationStatusInfos(
      'default',
      `notifiche - status.delivering`,
      `notifiche - status.delivering-tooltip`,
      `notifiche - status.delivering-description`,
      NotificationStatus.DELIVERING
    );
  });

  it('return notification status infos - UNREACHABLE - single recipient - passing the status only', () => {
    testNotificationStatusInfos(
      'error',
      `notifiche - status.unreachable`,
      `notifiche - status.unreachable-tooltip`,
      `notifiche - status.unreachable-description`,
      NotificationStatus.UNREACHABLE,
      { recipients: notificationToFe.recipients }
    );
  });

  it('return notification status infos - UNREACHABLE - multi recipient - passing the status only', () => {
    testNotificationStatusInfos(
      'error',
      `notifiche - status.unreachable-multirecipient`,
      `notifiche - status.unreachable-tooltip-multirecipient`,
      `notifiche - status.unreachable-description-multirecipient`,
      NotificationStatus.UNREACHABLE,
      { recipients: notificationToFeMultiRecipient.recipients }
    );
  });

  it('return notification status infos - PAID - passing the status only', () => {
    testNotificationStatusInfos(
      'success',
      `notifiche - status.paid`,
      `notifiche - status.paid-tooltip`,
      `notifiche - status.paid-description`,
      NotificationStatus.PAID
    );
  });

  it('return notification status infos - ACCEPTED', () => {
    testNotificationStatusInfos(
      'default',
      `notifiche - status.accepted`,
      `notifiche - status.accepted-tooltip`,
      `notifiche - status.accepted-description`,
      NotificationStatus.ACCEPTED
    );
  });

  it('return notification status infos - EFFECTIVE_DATE - single recipient', () => {
    testNotificationStatusInfos(
      'info',
      `notifiche - status.effective-date`,
      `notifiche - status.effective-date-tooltip`,
      `notifiche - status.effective-date-description`,
      NotificationStatus.EFFECTIVE_DATE,
      { recipients: notificationToFe.recipients }
    );
  });

  it('return notification status infos - EFFECTIVE_DATE - multi recipient', () => {
    testNotificationStatusInfos(
      'info',
      `notifiche - status.effective-date-multirecipient`,
      `notifiche - status.effective-date-tooltip-multirecipient`,
      `notifiche - status.effective-date-description-multirecipient`,
      NotificationStatus.EFFECTIVE_DATE,
      { recipients: notificationToFeMultiRecipient.recipients }
    );
  });

  it('return notification status infos - VIEWED - single recipient - no delegate', () => {
    testNotificationStatusInfos(
      'success',
      `notifiche - status.viewed`,
      `notifiche - status.viewed-tooltip - ${JSON.stringify({
        subject: `notifiche - status.recipient`,
      })}`,
      `notifiche - status.viewed-description - ${JSON.stringify({
        subject: `notifiche - status.recipient`,
      })}`,
      {
        status: NotificationStatus.VIEWED,
        activeFrom: '2023-01-26T13:57:16.42843144Z',
        relatedTimelineElements: [],
      },
      { recipients: notificationToFe.recipients }
    );
  });

  it('return notification status infos - VIEWED - single recipient - including delegate', () => {
    testNotificationStatusInfos(
      'success',
      `notifiche - status.viewed`,
      `notifiche - status.viewed-tooltip - ${JSON.stringify({
        subject: `notifiche - status.delegate - ${JSON.stringify({
          name: notificationToFe.recipients[0].denomination,
        })}`,
      })}`,
      `notifiche - status.viewed-description - ${JSON.stringify({
        subject: `notifiche - status.delegate - ${JSON.stringify({
          name: notificationToFe.recipients[0].denomination,
        })}`,
      })}`,
      {
        status: NotificationStatus.VIEWED,
        activeFrom: '2023-01-26T13:57:16.42843144Z',
        relatedTimelineElements: [],
        recipient: notificationToFe.recipients[0].denomination,
      },
      { recipients: notificationToFe.recipients }
    );
  });

  it('return notification status infos - VIEWED - multi recipient - no delegate', () => {
    testNotificationStatusInfos(
      'success',
      `notifiche - status.viewed-multirecipient`,
      `notifiche - status.viewed-tooltip-multirecipient - ${JSON.stringify({
        subject: `notifiche - status.recipient`,
      })}`,
      `notifiche - status.viewed-description-multirecipient - ${JSON.stringify({
        subject: `notifiche - status.recipient`,
      })}`,
      {
        status: NotificationStatus.VIEWED,
        activeFrom: '2023-01-26T13:57:16.42843144Z',
        relatedTimelineElements: [],
      },
      { recipients: notificationToFeMultiRecipient.recipients }
    );
  });

  it('return notification status infos - CANCELLED - passing status only', () => {
    testNotificationStatusInfos(
      'warning',
      `notifiche - status.canceled`,
      `notifiche - status.canceled-tooltip`,
      `notifiche - status.canceled-description`,
      NotificationStatus.CANCELLED
    );
  });

  it('return notification status infos - CANCELLATION_IN_PROGRESS - passing status only', () => {
    testNotificationStatusInfos(
      'warning',
      `notifiche - status.cancellation-in-progress`,
      `notifiche - status.cancellation-in-progress-tooltip`,
      `notifiche - status.cancellation-in-progress-description`,
      NotificationStatus.CANCELLATION_IN_PROGRESS
    );
  });
});

describe('timeline legal fact link text', () => {
  beforeAll(() => {
    initLocalizationForTest();
  });

  it('return legalFact label - default', () => {
    const timelineElem = {
      elementId: 'GET_ADDRESS.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1.SOURCE_SPECIAL.ATTEMPT_0',
      timestamp: '2023-08-25T09:35:37.467148235Z',
      category: TimelineCategory.GET_ADDRESS,
      details: {},
    };
    const label = getLegalFactLabel(timelineElem);
    expect(label).toBe('notifiche - detail.legalfact');
  });

  it('return legalFact label - SEND_ANALOG_PROGRESS', () => {
    const timelineElem = {
      elementId:
        'SEND_ANALOG_PROGRESS.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1.SOURCE_SPECIAL.ATTEMPT_0',
      timestamp: '2023-08-25T09:35:37.467148235Z',
      category: TimelineCategory.SEND_ANALOG_PROGRESS,
      details: {
        attachments: [{ documentType: 'Plico', url: 'legal-fact-1', id: 'attachment-id-1' }],
      },
      legalFactsIds: [
        {
          key: 'legal-fact-1',
          category: LegalFactType.AAR,
        },
      ],
    };
    const label = getLegalFactLabel(timelineElem, LegalFactType.AAR, 'legal-fact-1');
    expect(label).toBe('notifiche - detail.timeline.analog-workflow-attachment-kind.Plico');
  });

  it('return legalFact label - SEND_SIMPLE_REGISTERED_LETTER_PROGRESS', () => {
    const timelineElem = {
      elementId:
        'SEND_SIMPLE_REGISTERED_LETTER_PROGRESS.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1.SOURCE_SPECIAL.ATTEMPT_0',
      timestamp: '2023-08-25T09:35:37.467148235Z',
      category: TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER_PROGRESS,
      details: {
        attachments: [{ documentType: '23L', url: 'legal-fact-1', id: 'attachment-id-1' }],
      },
      legalFactsIds: [
        {
          key: 'legal-fact-1',
          category: LegalFactType.AAR,
        },
      ],
    };
    let label = getLegalFactLabel(timelineElem, LegalFactType.AAR, 'legal-fact-1');
    expect(label).toBe('notifiche - detail.timeline.analog-workflow-attachment-kind.23L');
    // no attachments
    label = getLegalFactLabel({ ...timelineElem, details: {} }, LegalFactType.AAR, 'legal-fact-1');
    expect(label).toBe('notifiche - detail.timeline.analog-workflow-attachment-kind.generic');
  });

  it('return legalFact label - COMPLETELY_UNREACHABLE', () => {
    const timelineElem = {
      elementId:
        'COMPLETELY_UNREACHABLE.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1.SOURCE_SPECIAL.ATTEMPT_0',
      timestamp: '2023-08-25T09:35:37.467148235Z',
      category: TimelineCategory.COMPLETELY_UNREACHABLE,
      details: {},
    };
    const label = getLegalFactLabel(timelineElem, LegalFactType.ANALOG_FAILURE_DELIVERY);
    expect(label).toBe('notifiche - detail.timeline.legalfact.analog-failure-delivery');
  });

  it('return legalFact label - ANALOG_FAILURE_WORKFLOW', () => {
    const timelineElem = {
      elementId:
        'ANALOG_FAILURE_WORKFLOW.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1.SOURCE_SPECIAL.ATTEMPT_0',
      timestamp: '2023-08-25T09:35:37.467148235Z',
      category: TimelineCategory.ANALOG_FAILURE_WORKFLOW,
      details: {},
    };
    const label = getLegalFactLabel(timelineElem, LegalFactType.AAR);
    expect(label).toBe('notifiche - detail.timeline.aar-document');
  });

  it('return legalFact label - SEND_DIGITAL_PROGRESS (success) - PEC_RECEIPT', () => {
    const timelineElem = {
      elementId:
        'SEND_DIGITAL_PROGRESS.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1.SOURCE_SPECIAL.ATTEMPT_0',
      timestamp: '2023-08-25T09:35:37.467148235Z',
      category: TimelineCategory.SEND_DIGITAL_PROGRESS,
      details: {
        deliveryDetailCode: 'C001',
      },
    };
    // C001
    let label = getLegalFactLabel(timelineElem, LegalFactType.PEC_RECEIPT);
    expect(label).toBe(
      'notifiche - detail.receipt notifiche - detail.timeline.legalfact.pec-receipt-accepted'
    );
    // DP00
    label = getLegalFactLabel(
      {
        ...timelineElem,
        details: {
          deliveryDetailCode: 'DP00',
        },
      },
      LegalFactType.PEC_RECEIPT
    );
    expect(label).toBe(
      'notifiche - detail.receipt notifiche - detail.timeline.legalfact.pec-receipt-accepted'
    );
  });

  it('return legalFact label - SEND_DIGITAL_PROGRESS (failure) - PEC_RECEIPT', () => {
    const timelineElem = {
      elementId:
        'SEND_DIGITAL_PROGRESS.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1.SOURCE_SPECIAL.ATTEMPT_0',
      timestamp: '2023-08-25T09:35:37.467148235Z',
      category: TimelineCategory.SEND_DIGITAL_PROGRESS,
      details: {
        deliveryDetailCode: 'C008',
      },
    };
    // C008
    let label = getLegalFactLabel(timelineElem, LegalFactType.PEC_RECEIPT);
    expect(label).toBe(
      'notifiche - detail.receipt notifiche - detail.timeline.legalfact.pec-receipt-not-accepted'
    );
    // C010
    label = getLegalFactLabel(
      {
        ...timelineElem,
        details: {
          deliveryDetailCode: 'C010',
        },
      },
      LegalFactType.PEC_RECEIPT
    );
    expect(label).toBe(
      'notifiche - detail.receipt notifiche - detail.timeline.legalfact.pec-receipt-not-accepted'
    );
    // DP10
    label = getLegalFactLabel(
      {
        ...timelineElem,
        details: {
          deliveryDetailCode: 'DP10',
        },
      },
      LegalFactType.PEC_RECEIPT
    );
    expect(label).toBe(
      'notifiche - detail.receipt notifiche - detail.timeline.legalfact.pec-receipt-not-accepted'
    );
  });

  it('return legalFact label - SEND_DIGITAL_FEEDBACK - PEC_RECEIPT', () => {
    const timelineElem = {
      elementId:
        'SEND_DIGITAL_FEEDBACK.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1.SOURCE_SPECIAL.ATTEMPT_0',
      timestamp: '2023-08-25T09:35:37.467148235Z',
      category: TimelineCategory.SEND_DIGITAL_FEEDBACK,
      details: {
        responseStatus: 'OK',
      } as SendDigitalDetails,
    };
    // OK
    let label = getLegalFactLabel(timelineElem, LegalFactType.PEC_RECEIPT);
    expect(label).toBe(
      'notifiche - detail.receipt notifiche - detail.timeline.legalfact.pec-receipt-delivered'
    );
    // KO
    label = getLegalFactLabel(
      {
        ...timelineElem,
        details: {
          responseStatus: 'KO',
        } as SendDigitalDetails,
      },
      LegalFactType.PEC_RECEIPT
    );
    expect(label).toBe(
      'notifiche - detail.receipt notifiche - detail.timeline.legalfact.pec-receipt-not-delivered'
    );
  });

  it('return legalFact label - REQUEST_ACCEPTED - SENDER_ACK', () => {
    // In fact the timeline event category is not explicitly checked.
    // In the examples I've seen, such legal facts are associated to REQUEST_ACCEPTED events.
    // I set the category to avoid the scenario to be "caught up" by previous cases in the
    // legal fact switch, which check the timeline event category only.
    // ------------------------------------
    // Carlos Lombardi, 2023.02.28
    // ------------------------------------
    const timelineElem = {
      elementId:
        'REQUEST_ACCEPTED.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1.SOURCE_SPECIAL.ATTEMPT_0',
      timestamp: '2023-08-25T09:35:37.467148235Z',
      category: TimelineCategory.REQUEST_ACCEPTED,
      details: {},
    };
    const label = getLegalFactLabel(timelineElem, LegalFactType.SENDER_ACK);
    expect(label).toBe(
      'notifiche - detail.legalfact: notifiche - detail.timeline.legalfact.sender-ack'
    );
  });

  it('return legalFact label - DIGITAL_SUCCESS_WORKFLOW - DIGITAL_DELIVERY', () => {
    const timelineElem = {
      elementId:
        'DIGITAL_SUCCESS_WORKFLOW.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1.SOURCE_SPECIAL.ATTEMPT_0',
      timestamp: '2023-08-25T09:35:37.467148235Z',
      category: TimelineCategory.DIGITAL_SUCCESS_WORKFLOW,
      details: {},
    };
    const label = getLegalFactLabel(timelineElem, LegalFactType.DIGITAL_DELIVERY);
    expect(label).toBe(
      'notifiche - detail.legalfact: notifiche - detail.timeline.legalfact.digital-delivery-success'
    );
  });

  it('return legalFact label - DIGITAL_FAILURE_WORKFLOW - DIGITAL_DELIVERY', () => {
    const timelineElem = {
      elementId:
        'DIGITAL_FAILURE_WORKFLOW.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1.SOURCE_SPECIAL.ATTEMPT_0',
      timestamp: '2023-08-25T09:35:37.467148235Z',
      category: TimelineCategory.DIGITAL_FAILURE_WORKFLOW,
      details: {},
    };
    const label = getLegalFactLabel(timelineElem, LegalFactType.DIGITAL_DELIVERY);
    expect(label).toBe(
      'notifiche - detail.legalfact: notifiche - detail.timeline.legalfact.digital-delivery-failure'
    );
  });

  // Similar to the SENDER_ACK case above, in this case the timeline event category
  // associated but not explicitly verified in the code is NOTIFICATION_VIEWED
  // ------------------------------------
  // Carlos Lombardi, 2023.02.28
  // ------------------------------------
  it('return legalFact label - NOTIFICATION_VIEWED - RECIPIENT_ACCESS', () => {
    const timelineElem = {
      elementId:
        'NOTIFICATION_VIEWED.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1.SOURCE_SPECIAL.ATTEMPT_0',
      timestamp: '2023-08-25T09:35:37.467148235Z',
      category: TimelineCategory.NOTIFICATION_VIEWED,
      details: {},
    };
    const label = getLegalFactLabel(timelineElem, LegalFactType.RECIPIENT_ACCESS);
    expect(label).toBe(
      'notifiche - detail.legalfact: notifiche - detail.timeline.legalfact.recipient-access'
    );
  });
});

describe('timeline event description', () => {
  // the factory TimelineStepFactory and its methods are already tested, so here we test that the function is called correctly
  it('factory is called correctly', () => {
    let timelineElem = getTimelineElem(TimelineCategory.NOT_HANDLED, { recIndex: 0 });
    // mono recipient
    let result = getNotificationTimelineStatusInfos(timelineElem, notificationToFe.recipients);
    expect(result).toStrictEqual(
      TimelineStepFactory.createTimelineStep(timelineElem).getTimelineStepInfo({
        step: timelineElem,
        recipient: notificationToFe.recipients[0],
        isMultiRecipient: false,
      })
    );
    // multi recipient
    result = getNotificationTimelineStatusInfos(
      timelineElem,
      notificationToFeMultiRecipient.recipients
    );
    expect(result).toStrictEqual(
      TimelineStepFactory.createTimelineStep(timelineElem).getTimelineStepInfo({
        step: timelineElem,
        recipient: notificationToFeMultiRecipient.recipients[0],
        isMultiRecipient: true,
      })
    );
    timelineElem = getTimelineElem(TimelineCategory.NOT_HANDLED, { recIndex: 1 });
    result = getNotificationTimelineStatusInfos(
      timelineElem,
      notificationToFeMultiRecipient.recipients
    );
    expect(result).toStrictEqual(
      TimelineStepFactory.createTimelineStep(timelineElem).getTimelineStepInfo({
        step: timelineElem,
        recipient: notificationToFeMultiRecipient.recipients[1],
        isMultiRecipient: true,
      })
    );
  });
});

describe('parse notification & filters', () => {
  // override the default translate function setted in setupTests.ts
  beforeEach(() => {
    initLocalization(() => '');
  });

  it('return parsed notification detail response', () => {
    const calculatedParsedNotification = parseNotificationDetail(
      _.cloneDeep(notificationDTOMultiRecipient)
    );
    expect(calculatedParsedNotification).toStrictEqual(notificationToFeMultiRecipient);
    // check sentAt date format
    expect(calculatedParsedNotification.sentAt).toBe(
      formatDate(notificationDTOMultiRecipient.sentAt)
    );
    // check the order
    let previousStepTimestamp: string | null = null;
    for (const status of calculatedParsedNotification.notificationStatusHistory) {
      if (previousStepTimestamp) {
        expect(new Date(status.activeFrom).getTime()).toBeLessThan(
          new Date(previousStepTimestamp).getTime()
        );
      }
      previousStepTimestamp = status.activeFrom;
    }
    // check the timeline extra data
    calculatedParsedNotification.timeline.forEach((tm, index) => {
      expect(tm.index).toBe(index);
      expect(tm.hidden).toBeDefined();
    });
  });

  it('check filling of the otherDocuments', () => {
    // no AAR -> empty otherDocuments
    const noAARNotification = {
      ..._.cloneDeep(notificationDTOMultiRecipient),
      timeline: notificationDTOMultiRecipient.timeline.filter(
        (tm) => tm.category !== TimelineCategory.AAR_GENERATION
      ),
    };
    let calculatedParsedNotification = parseNotificationDetail(noAARNotification);
    expect(calculatedParsedNotification.otherDocuments).toHaveLength(0);
    // AAR -> filled otherDocuments
    // mono recipient
    let AARTimelineElems = notificationDTO.timeline.filter(
      (tm) => tm.category === TimelineCategory.AAR_GENERATION
    );
    calculatedParsedNotification = parseNotificationDetail(_.cloneDeep(notificationDTO));
    expect(calculatedParsedNotification.otherDocuments).toHaveLength(1);
    expect(calculatedParsedNotification.otherDocuments![0]).toStrictEqual({
      recIndex: 0,
      documentId: (AARTimelineElems[0].details as AarDetails).generatedAarUrl,
      documentType: LegalFactType.AAR,
      title: 'Avviso di avvenuta ricezione',
      digests: {
        sha256: '',
      },
      ref: {
        key: '',
        versionToken: '',
      },
      contentType: '',
    });
    // multi recipients
    AARTimelineElems = notificationDTOMultiRecipient.timeline.filter(
      (tm) => tm.category === TimelineCategory.AAR_GENERATION
    );
    calculatedParsedNotification = parseNotificationDetail(
      _.cloneDeep(notificationDTOMultiRecipient)
    );
    expect(calculatedParsedNotification.otherDocuments).toHaveLength(AARTimelineElems.length);
    AARTimelineElems.forEach((aar, index) => {
      expect(calculatedParsedNotification.otherDocuments![index]).toStrictEqual({
        recIndex: aar.details.recIndex,
        documentId: (aar.details as AarDetails).generatedAarUrl,
        documentType: LegalFactType.AAR,
        title: `Avviso di avvenuta ricezione - ${
          notificationDTOMultiRecipient.recipients[aar.details.recIndex!].denomination
        } (${notificationDTOMultiRecipient.recipients[aar.details.recIndex!].taxId})`,
        digests: {
          sha256: '',
        },
        ref: {
          key: '',
          versionToken: '',
        },
        contentType: '',
      });
    });
  });

  it('insert cancellation status', () => {
    const cancellationInProgressNotification = {
      ..._.cloneDeep(notificationDTO),
      timeline: [
        ...notificationDTO.timeline,
        getTimelineElem(TimelineCategory.NOTIFICATION_CANCELLATION_REQUEST, {}),
      ],
    };
    const calculatedParsedNotification = parseNotificationDetail(
      cancellationInProgressNotification
    );
    const cancellationInProgressStatusHistory =
      calculatedParsedNotification.notificationStatusHistory.find(
        (sh) => sh.status === NotificationStatus.CANCELLATION_IN_PROGRESS
      );
    expect(cancellationInProgressStatusHistory).not.toBeUndefined();
    expect(calculatedParsedNotification.notificationStatus).toBe(
      NotificationStatus.CANCELLATION_IN_PROGRESS
    );
  });

  it('hide analog timeline steps', () => {
    const sendAnalogProgress = getTimelineElem(TimelineCategory.SEND_ANALOG_PROGRESS, {
      recIndex: 0,
    });
    const sendAnalogFeedback = getTimelineElem(TimelineCategory.SEND_ANALOG_FEEDBACK, {
      recIndex: 0,
      deliveryDetailCode: 'RECAG003C',
    });
    const sendAnalogRegisteredLetter = getTimelineElem(
      TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER_PROGRESS,
      { recIndex: 0, deliveryDetailCode: 'NTINCLCD' }
    );
    const analogNotification = {
      ..._.cloneDeep(notificationDTO),
      timeline: [
        ...notificationDTO.timeline,
        sendAnalogProgress,
        sendAnalogFeedback,
        sendAnalogRegisteredLetter,
      ],
    };
    const calculatedParsedNotification = parseNotificationDetail(analogNotification);
    const sendAnalogProgressElem = calculatedParsedNotification.timeline.find(
      (tm) => tm.category === TimelineCategory.SEND_ANALOG_PROGRESS
    );
    expect(sendAnalogProgressElem?.hidden).toBeTruthy();
    const sendAnalogFeedbackElem = calculatedParsedNotification.timeline.find(
      (tm) => tm.category === TimelineCategory.SEND_ANALOG_FEEDBACK
    );
    expect(sendAnalogFeedbackElem?.hidden).toBeFalsy();
    const sendAnalogRegisteredLetterElem = calculatedParsedNotification.timeline.find(
      (tm) => tm.category === TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER_PROGRESS
    );
    expect(sendAnalogRegisteredLetterElem?.hidden).toBeTruthy();
  });

  it('check filling of macro steps', () => {
    const calculatedParsedNotification = parseNotificationDetail(_.cloneDeep(notificationDTO));
    // do the checks
    let previousStateisAccepted = false;
    let acceptedItems: Array<string> = [];
    for (const status of calculatedParsedNotification.notificationStatusHistory.reverse()) {
      // in the transformation, the relatedTimelineElements of the accepted status are mooved to the next state
      if (status.status === NotificationStatus.ACCEPTED) {
        previousStateisAccepted = true;
        acceptedItems = notificationDTO.notificationStatusHistory.find(
          (sh) => sh.status === NotificationStatus.ACCEPTED
        )!.relatedTimelineElements;
        // all items are hidden and legalfacts emptied
        for (const step of status.steps!) {
          expect(step.hidden).toBeTruthy();
          expect(step.legalFactsIds).toHaveLength(0);
        }
        continue;
      }
      if (previousStateisAccepted) {
        const currentItems = notificationDTO.notificationStatusHistory.find(
          (sh) => sh.status === status.status
        )!.relatedTimelineElements;
        previousStateisAccepted = false;
        expect(status.relatedTimelineElements).toStrictEqual([...acceptedItems, ...currentItems]);
      }
      // default case
      let previousStepTimestamp: string | null = null;
      for (const step of status.steps!) {
        const timelineStep = calculatedParsedNotification.timeline.find(
          (tm) => tm.elementId === step.elementId
        );
        expect(step).toStrictEqual(timelineStep);
        // check the order
        if (previousStepTimestamp) {
          expect(new Date(step.timestamp).getTime()).toBeLessThan(
            new Date(previousStepTimestamp).getTime()
          );
        }
        previousStepTimestamp = step.timestamp;
      }
    }
  });

  it('hide app IO event', () => {
    const sendCourtesy = getTimelineElem(TimelineCategory.SEND_COURTESY_MESSAGE, {
      recIndex: 0,
      digitalAddress: {
        type: DigitalDomicileType.APPIO,
        address: '',
      },
      ioSendMessageResult: AppIoCourtesyMessageEventType.SENT_OPTIN,
    });
    const ioNotification = {
      ..._.cloneDeep(notificationDTO),
      timeline: [...notificationDTO.timeline, sendCourtesy],
    };
    const acceptedStatus = ioNotification.notificationStatusHistory.find(
      (sh) => sh.status === NotificationStatus.ACCEPTED
    );
    acceptedStatus?.relatedTimelineElements.push(sendCourtesy.elementId);
    const calculatedParsedNotification = parseNotificationDetail(ioNotification);
    let ioStep;
    for (const status of calculatedParsedNotification.notificationStatusHistory) {
      ioStep = status.steps?.find((st) => st.elementId === sendCourtesy.elementId);
      if (ioStep) {
        expect(ioStep.hidden).toBeTruthy();
        break;
      }
    }
    if (!ioStep) {
      fail('No io event found in the parsed notification');
    }
  });

  it('populate the lagalFacts of the ANALOG_FAILURE_WORKFLOW step', () => {
    const analogFailure = getTimelineElem(TimelineCategory.ANALOG_FAILURE_WORKFLOW, {
      recIndex: 0,
      generatedAarUrl: 'https://www.aar.com',
    });
    const analogNotification = {
      ..._.cloneDeep(notificationDTO),
      timeline: [...notificationDTO.timeline, analogFailure],
    };
    let deliveredStatus = analogNotification.notificationStatusHistory.find(
      (sh) => sh.status === NotificationStatus.DELIVERED
    );
    deliveredStatus?.relatedTimelineElements.push(analogFailure.elementId);
    const calculatedParsedNotification = parseNotificationDetail(analogNotification);
    deliveredStatus = calculatedParsedNotification.notificationStatusHistory.find(
      (sh) => sh.status === NotificationStatus.DELIVERED
    );
    const analogFailureStep = deliveredStatus?.steps!.find(
      (s) => s.elementId === analogFailure.elementId
    );
    expect(analogFailureStep?.legalFactsIds).toStrictEqual([
      {
        documentId: 'https://www.aar.com',
        documentType: LegalFactType.AAR,
      },
    ]);
  });

  it('deliveryMode DIGITAL', () => {
    const calculatedParsedNotification = parseNotificationDetail(_.cloneDeep(notificationDTO));
    const deliveredStep = calculatedParsedNotification.notificationStatusHistory.find(
      (st) => st.status === NotificationStatus.DELIVERED
    );
    expect(deliveredStep?.deliveryMode).toBe(NotificationDeliveryMode.DIGITAL);
  });

  it('deliveryMode ANALOG', () => {
    // change the category of the DIGITAL_SUCCESS_WORKFLOW timeline event to SEND_SIMPLE_REGISTERED_LETTER
    const clonedNotification = _.cloneDeep(notificationDTO);
    const digitalSuccess = clonedNotification.timeline.find(
      (tm) => tm.category === TimelineCategory.DIGITAL_SUCCESS_WORKFLOW
    );
    digitalSuccess!.category = TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER;
    const calculatedParsedNotification = parseNotificationDetail(clonedNotification);
    const deliveredStep = calculatedParsedNotification.notificationStatusHistory.find(
      (st) => st.status === NotificationStatus.DELIVERED
    );
    expect(deliveredStep?.deliveryMode).toBe(NotificationDeliveryMode.ANALOG);
  });

  it('deliveryMode not assigned', () => {
    // remove the DIGITAL_SUCCESS_WORKFLOW timeline event
    const clonedNotification = _.cloneDeep(notificationDTO);
    clonedNotification.timeline = clonedNotification.timeline.filter(
      (tm) => tm.category !== TimelineCategory.DIGITAL_SUCCESS_WORKFLOW
    );
    const calculatedParsedNotification = parseNotificationDetail(clonedNotification);
    const deliveredStep = calculatedParsedNotification.notificationStatusHistory.find(
      (st) => st.status === NotificationStatus.DELIVERED
    );
    expect(deliveredStep?.deliveryMode).toBeFalsy();
  });

  it('shift steps from DELIVERED to DELIVERING', () => {
    // change the category of the DIGITAL_SUCCESS_WORKFLOW timeline event to DIGITAL_FAILURE_WORKFLOW
    const digitalFailure = getTimelineElem(TimelineCategory.DIGITAL_FAILURE_WORKFLOW, {
      recIndex: 0,
    });
    const clonedNotification = _.cloneDeep(notificationDTO);
    const digitalSuccessIndex = clonedNotification.timeline.findIndex(
      (tm) => tm.category === TimelineCategory.DIGITAL_SUCCESS_WORKFLOW
    );
    // add PREPARE_SIMPLE_REGISTERED_LETTER / SEND_SIMPLE_REGISTERED_LETTER
    const prepareLetter = getTimelineElem(TimelineCategory.PREPARE_SIMPLE_REGISTERED_LETTER, {
      recIndex: 0,
      productType: 'RN_RS',
      physicalAddress: { address: 'Via Rosas 1829', zip: '98036', municipality: 'Graniti' },
    });
    const sendLetter = getTimelineElem(TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER, {
      recIndex: 0,
      productType: 'RN_RS',
      physicalAddress: { address: 'Via Rosas 1829', zip: '98036', municipality: 'Graniti' },
    });
    // change the status history accordingly
    const prevDeliveredStatus = clonedNotification.notificationStatusHistory.find(
      (sh) => sh.status === NotificationStatus.DELIVERED
    );
    const digitalSuccessElIndex = prevDeliveredStatus!.relatedTimelineElements.findIndex(
      (el) => el === clonedNotification.timeline[digitalSuccessIndex].elementId
    );
    prevDeliveredStatus!.relatedTimelineElements[digitalSuccessElIndex] = digitalFailure.elementId;
    prevDeliveredStatus!.relatedTimelineElements.splice(
      digitalSuccessElIndex + 1,
      0,
      prepareLetter.elementId,
      sendLetter.elementId
    );
    const deliveredCount = prevDeliveredStatus!.relatedTimelineElements.length;
    // change timeline
    clonedNotification.timeline[digitalSuccessIndex] = digitalFailure;
    clonedNotification.timeline.splice(digitalSuccessIndex + 1, 0, prepareLetter, sendLetter);
    // now the test
    const calculatedParsedNotification = parseNotificationDetail(clonedNotification);
    const deliveredStatus = calculatedParsedNotification.notificationStatusHistory.find(
      (st) => st.status === NotificationStatus.DELIVERED
    );
    const deliveringStatus = calculatedParsedNotification.notificationStatusHistory.find(
      (st) => st.status === NotificationStatus.DELIVERING
    );
    // delivered status is emptied
    // we remove all the steps from the start to the last element that match the condition
    // step.category === TimelineCategory.DIGITAL_FAILURE_WORKFLOW || step.category === TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER || step.category === TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER_PROGRESS
    // we now that the last element index is the DIGITAL_SUCCESS_WORKFLOW + num of elements that we add + 1 because the index is 0 based
    expect(deliveredStatus?.steps).toHaveLength(deliveredCount - digitalSuccessElIndex - 3);
    // delivering status is filled with delivered elements
    const prepareLetterEl = deliveringStatus!.steps!.find(
      (s) => s.elementId === prepareLetter.elementId
    );
    const sendLetterEl = deliveringStatus!.steps!.find((s) => s.elementId === sendLetter.elementId);
    const digitalFailureEl = deliveringStatus!.steps!.find(
      (s) => s.elementId === digitalFailure.elementId
    );
    expect(prepareLetterEl).toBeDefined();
    expect(sendLetterEl).toBeDefined();
    expect(digitalFailureEl).toBeDefined();
  });

  it('recipient in VIEWED status - no delegate', () => {
    // add a VIEWED status with one NOTIFICATION_VIEWED element - no delegate
    const clonedNotification = _.cloneDeep(notificationDTO);
    const viewedElement = getTimelineElem(TimelineCategory.NOTIFICATION_VIEWED, {
      recIndex: 0,
    });
    // add element to timeline
    clonedNotification.timeline.push(viewedElement);
    // asd element to status history
    const viewedStatus: NotificationStatusHistory = {
      status: NotificationStatus.VIEWED,
      activeFrom: viewedElement.timestamp,
      relatedTimelineElements: [viewedElement.elementId],
    };
    clonedNotification.notificationStatusHistory.push(viewedStatus);
    // parse
    const calculatedParsedNotification = parseNotificationDetail(clonedNotification);
    // ----------- checks
    const viewwedStep = calculatedParsedNotification.notificationStatusHistory.find(
      (st) => st.status === NotificationStatus.VIEWED
    );
    expect(viewwedStep?.steps).toHaveLength(1);
    expect(viewwedStep?.recipient).toBeUndefined();
  });

  it('recipient in VIEWED status - with delegate', () => {
    // add a VIEWED status with one NOTIFICATION_VIEWED element - no delegate
    const clonedNotification = _.cloneDeep(notificationDTO);
    const viewedElement = getTimelineElem(TimelineCategory.NOTIFICATION_VIEWED, {
      recIndex: 0,
      delegateInfo: {
        internalId: 'mocked-delegate-internal-id',
        taxId: 'GLLGLL64B15G702I',
        operatorUuid: 'mocked-delegate-uuid',
        mandateId: '7c69e30a-23cd-4ef2-9b95-98c5a9f4e636',
        denomination: 'galileo galilei',
        delegateType: RecipientType.PF,
      },
    });
    // add element to timeline
    clonedNotification.timeline.push(viewedElement);
    // asd element to status history
    const viewedStatus: NotificationStatusHistory = {
      status: NotificationStatus.VIEWED,
      activeFrom: viewedElement.timestamp,
      relatedTimelineElements: [viewedElement.elementId],
    };
    clonedNotification.notificationStatusHistory.push(viewedStatus);
    // parse
    const calculatedParsedNotification = parseNotificationDetail(clonedNotification);
    // ----------- checks
    const viewwedStep = calculatedParsedNotification.notificationStatusHistory.find(
      (st) => st.status === NotificationStatus.VIEWED
    );
    expect(viewwedStep?.steps).toHaveLength(1);
    expect(viewwedStep?.recipient).toBe(
      `${(viewedElement.details as ViewedDetails).delegateInfo!.denomination} (${
        (viewedElement.details as ViewedDetails).delegateInfo!.taxId
      })`
    );
  });
});

describe('Populate pagoPA and F24 payments', () => {
  const paymentsData: PaymentsData = {
    pagoPaF24: getPagoPaF24Payments(payments, 0),
    f24Only: getF24Payments(payments, 0),
  };

  it('return empty array if user payments is an empty array', () => {
    const mappedPayments = populatePaymentsPagoPaF24(notificationToFe.timeline, [], paymentInfo);
    expect(mappedPayments).toStrictEqual([]);
  });

  it('With empty timeline it should return the mapped array with only external registry info', () => {
    const res: Array<PaymentDetails> = paymentsData.pagoPaF24.map((item, index) => {
      return {
        pagoPa: item.pagoPa ? { ...item.pagoPa, ...paymentInfo[index] } : undefined,
        f24: item.f24,
      } as PaymentDetails;
    });

    const mappedPayments = populatePaymentsPagoPaF24([], paymentsData.pagoPaF24, paymentInfo);
    expect(mappedPayments).toStrictEqual(res);
  });

  it('When populatePaymentHistory receive only one payment from checkout it should map only this payment', () => {
    let res: Array<PaymentDetails> = [];
    let singlePaymentInfo = paymentInfo[0];

    paymentsData.pagoPaF24.forEach((item, index) => {
      if (
        singlePaymentInfo?.creditorTaxId === item.pagoPa?.creditorTaxId &&
        singlePaymentInfo.noticeCode === item.pagoPa?.noticeCode
      ) {
        const checkoutSucceded =
          paymentInfo[index].status === PaymentStatus.SUCCEEDED ? paymentInfo[index] : undefined;

        const timelineEvent = notificationToFe.timeline.find(
          (event) =>
            event.category === TimelineCategory.PAYMENT &&
            (event.details as PaidDetails).creditorTaxId === checkoutSucceded?.creditorTaxId &&
            (event.details as PaidDetails).noticeCode === checkoutSucceded.noticeCode
        )?.details;

        res = [
          ...res,
          {
            pagoPa: { ...item.pagoPa, ...paymentInfo[index], ...timelineEvent },
            f24: item.f24,
          } as PaymentDetails,
        ];
      }
      if (!item.pagoPa && item.f24) {
        res = [
          ...res,
          {
            pagoPa: undefined,
            f24: item.f24,
          } as PaymentDetails,
        ];
      }
    });

    const mappedPayments = populatePaymentsPagoPaF24(
      notificationToFe.timeline,
      paymentsData.pagoPaF24,
      [singlePaymentInfo]
    );

    expect(mappedPayments).toHaveLength(res.length);
    expect(mappedPayments).toStrictEqual(res);
  });

  it('With empty external registry it should return the mapped array with only timeline info', () => {
    const res: Array<PaymentDetails> = paymentsData.pagoPaF24.map((item, index) => {
      const timelineEvent = notificationToFe.timeline.find(
        (event) =>
          event.category === TimelineCategory.PAYMENT &&
          (event.details as PaidDetails).creditorTaxId === item.pagoPa?.creditorTaxId &&
          (event.details as PaidDetails).noticeCode === item.pagoPa?.noticeCode
      )?.details;

      const pagoPAPayment = item.pagoPa
        ? ({ ...item.pagoPa, ...timelineEvent } as PagoPAPaymentFullDetails)
        : undefined;
      if (timelineEvent && pagoPAPayment) {
        pagoPAPayment.status = PaymentStatus.SUCCEEDED;
      }

      return {
        pagoPa: pagoPAPayment,
        f24: item.f24,
      } as PaymentDetails;
    });

    const mappedPayments = populatePaymentsPagoPaF24(
      notificationToFe.timeline,
      paymentsData.pagoPaF24,
      []
    );

    expect(mappedPayments).toStrictEqual(res);
  });

  it('If timeline has some elements it should return the mapped array with the timeline element over the external registry info', () => {
    const res: Array<PaymentDetails> = paymentsData.pagoPaF24.map((item, index) => {
      const checkoutSucceded =
        item.pagoPa && paymentInfo[index].status === PaymentStatus.SUCCEEDED
          ? paymentInfo[index]
          : undefined;

      const timelineEvent = notificationToFe.timeline.find(
        (event) =>
          event.category === TimelineCategory.PAYMENT &&
          (event.details as PaidDetails).creditorTaxId === checkoutSucceded?.creditorTaxId &&
          (event.details as PaidDetails).noticeCode === checkoutSucceded.noticeCode
      )?.details;

      return {
        pagoPa: item.pagoPa
          ? { ...item.pagoPa, ...paymentInfo[index], ...timelineEvent }
          : undefined,
        f24: item.f24,
      } as PaymentDetails;
    });

    const mappedPayments = populatePaymentsPagoPaF24(
      notificationToFe.timeline,
      paymentsData.pagoPaF24,
      paymentInfo
    );

    expect(mappedPayments).toStrictEqual(res);
  });

  it('If timeline has some undefined keys it should return the mapped array with the ext registry values of the undefined timeline keys', () => {
    const timeline: INotificationDetailTimeline[] = notificationToFe.timeline.map((item) => ({
      ...item,
      amount: undefined,
    }));

    const res: Array<PaymentDetails> = paymentsData.pagoPaF24.map((item, index) => {
      const checkoutSucceded =
        item.pagoPa && paymentInfo[index].status === PaymentStatus.SUCCEEDED
          ? paymentInfo[index]
          : undefined;

      const timelineEvent = notificationToFe.timeline.find(
        (item) =>
          item.category === TimelineCategory.PAYMENT &&
          (item.details as PaidDetails).creditorTaxId === checkoutSucceded?.creditorTaxId &&
          (item.details as PaidDetails).noticeCode === checkoutSucceded.noticeCode
      )?.details;

      return {
        pagoPa: item.pagoPa
          ? { ...item.pagoPa, ...paymentInfo[index], ...timelineEvent }
          : undefined,
        f24: item.f24,
      } as PaymentDetails;
    });

    const mappedPayments = populatePaymentsPagoPaF24(timeline, paymentsData.pagoPaF24, paymentInfo);

    expect(mappedPayments).toStrictEqual(res);
  });
});
