import { paymentInfo } from '../../__mocks__/ExternalRegistry.mock';
import {
  getTimelineElem,
  notificationDTO,
  notificationDTOMultiRecipient,
  payments,
} from '../../__mocks__/NotificationDetail.mock';
import {
  F24PaymentDetails,
  INotificationDetailTimeline,
  LegalFactType,
  NotificationDeliveryMode,
  NotificationDetailRecipient,
  NotificationStatusHistory,
  PagoPAPaymentFullDetails,
  PaidDetails,
  PaymentDetails,
  PaymentStatus,
  PaymentsData,
  SendDigitalDetails,
  TimelineCategory,
} from '../../models/NotificationDetail';
import { NotificationStatus } from '../../models/NotificationStatus';
import { initLocalizationForTest } from '../../test-utils';
import { TimelineStepFactory } from '../TimelineUtils/TimelineStepFactory';
import {
  getF24Payments,
  getLegalFactLabel,
  getNotificationStatusInfos,
  getNotificationTimelineStatusInfos,
  getPagoPaF24Payments,
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
        recipients: notificationDTO.recipients,
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
        recipients: notificationDTO.recipients,
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
        recipients: notificationDTO.recipients,
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
        recipients: notificationDTOMultiRecipient.recipients,
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
        recipients: notificationDTOMultiRecipient.recipients,
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
      { recipients: notificationDTO.recipients }
    );
  });

  it('return notification status infos - UNREACHABLE - multi recipient - passing the status only', () => {
    testNotificationStatusInfos(
      'error',
      `notifiche - status.unreachable-multirecipient`,
      `notifiche - status.unreachable-tooltip-multirecipient`,
      `notifiche - status.unreachable-description-multirecipient`,
      NotificationStatus.UNREACHABLE,
      { recipients: notificationDTOMultiRecipient.recipients }
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
      { recipients: notificationDTO.recipients }
    );
  });

  it('return notification status infos - EFFECTIVE_DATE - multi recipient', () => {
    testNotificationStatusInfos(
      'info',
      `notifiche - status.effective-date-multirecipient`,
      `notifiche - status.effective-date-tooltip-multirecipient`,
      `notifiche - status.effective-date-description-multirecipient`,
      NotificationStatus.EFFECTIVE_DATE,
      { recipients: notificationDTOMultiRecipient.recipients }
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
      { recipients: notificationDTO.recipients }
    );
  });

  it('return notification status infos - VIEWED - single recipient - including delegate', () => {
    testNotificationStatusInfos(
      'success',
      `notifiche - status.viewed`,
      `notifiche - status.viewed-tooltip - ${JSON.stringify({
        subject: `notifiche - status.delegate - ${JSON.stringify({
          name: notificationDTO.recipients[0].denomination,
        })}`,
      })}`,
      `notifiche - status.viewed-description - ${JSON.stringify({
        subject: `notifiche - status.delegate - ${JSON.stringify({
          name: notificationDTO.recipients[0].denomination,
        })}`,
      })}`,
      {
        status: NotificationStatus.VIEWED,
        activeFrom: '2023-01-26T13:57:16.42843144Z',
        relatedTimelineElements: [],
        recipient: notificationDTO.recipients[0].denomination,
      },
      { recipients: notificationDTO.recipients }
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
      { recipients: notificationDTOMultiRecipient.recipients }
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
          category: LegalFactType.PEC_RECEIPT,
        },
      ],
    };
    const label = getLegalFactLabel(timelineElem, LegalFactType.PEC_RECEIPT, 'legal-fact-1');
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
          category: LegalFactType.DIGITAL_DELIVERY,
        },
      ],
    };
    let label = getLegalFactLabel(timelineElem, LegalFactType.DIGITAL_DELIVERY, 'legal-fact-1');
    expect(label).toBe('notifiche - detail.timeline.analog-workflow-attachment-kind.23L');
    // no attachments
    label = getLegalFactLabel(
      { ...timelineElem, details: {} },
      LegalFactType.DIGITAL_DELIVERY,
      'legal-fact-1'
    );
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
      details: {
        generatedAarUrl: 'https://aar-fake-url.com',
      },
    };
    const label = getLegalFactLabel(timelineElem);
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
    let result = getNotificationTimelineStatusInfos(timelineElem, notificationDTO.recipients);
    expect(result).toStrictEqual(
      TimelineStepFactory.createTimelineStep(timelineElem).getTimelineStepInfo({
        step: timelineElem,
        recipient: notificationDTO.recipients[0],
        isMultiRecipient: false,
      })
    );
    // multi recipient
    result = getNotificationTimelineStatusInfos(
      timelineElem,
      notificationDTOMultiRecipient.recipients
    );
    expect(result).toStrictEqual(
      TimelineStepFactory.createTimelineStep(timelineElem).getTimelineStepInfo({
        step: timelineElem,
        recipient: notificationDTOMultiRecipient.recipients[0],
        isMultiRecipient: true,
      })
    );
    timelineElem = getTimelineElem(TimelineCategory.NOT_HANDLED, { recIndex: 1 });
    result = getNotificationTimelineStatusInfos(
      timelineElem,
      notificationDTOMultiRecipient.recipients
    );
    expect(result).toStrictEqual(
      TimelineStepFactory.createTimelineStep(timelineElem).getTimelineStepInfo({
        step: timelineElem,
        recipient: notificationDTOMultiRecipient.recipients[1],
        isMultiRecipient: true,
      })
    );
  });
});

describe('Populate pagoPA and F24 payments', () => {
  const paymentsData: PaymentsData = {
    pagoPaF24: getPagoPaF24Payments(payments, 0),
    f24Only: getF24Payments(payments, 0),
  };

  it('return empty array if user payments is an empty array', () => {
    const mappedPayments = populatePaymentsPagoPaF24(notificationDTO.timeline, [], paymentInfo);
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

        const timelineEvent = notificationDTO.timeline.find(
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
      notificationDTO.timeline,
      paymentsData.pagoPaF24,
      [singlePaymentInfo]
    );

    expect(mappedPayments).toHaveLength(res.length);
    expect(mappedPayments).toStrictEqual(res);
  });

  it('With empty external registry it should return the mapped array with only timeline info', () => {
    const res: Array<PaymentDetails> = paymentsData.pagoPaF24.map((item) => {
      const timelineEvent = notificationDTO.timeline.find(
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
      notificationDTO.timeline,
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

      const timelineEvent = notificationDTO.timeline.find(
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
      notificationDTO.timeline,
      paymentsData.pagoPaF24,
      paymentInfo
    );

    expect(mappedPayments).toStrictEqual(res);
  });

  it('If timeline has some undefined keys it should return the mapped array with the ext registry values of the undefined timeline keys', () => {
    const timeline: INotificationDetailTimeline[] = notificationDTO.timeline.map((item) => ({
      ...item,
      amount: undefined,
    }));

    const res: Array<PaymentDetails> = paymentsData.pagoPaF24.map((item, index) => {
      const checkoutSucceded =
        item.pagoPa && paymentInfo[index].status === PaymentStatus.SUCCEEDED
          ? paymentInfo[index]
          : undefined;

      const timelineEvent = notificationDTO.timeline.find(
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

  it('should populate the F24 payments with recipientIdx using getF24Payments', () => {
    const onlyF24 = true;
    const recIndex = 2;

    const res = payments.reduce((arr, payment, index) => {
      if (payment.f24 && ((onlyF24 && !payment.pagoPa) || !onlyF24)) {
        // eslint-disable-next-line functional/immutable-data
        arr.push({
          ...payment.f24,
          attachmentIdx: index,
          recIndex,
        });
      }
      return arr;
    }, [] as Array<F24PaymentDetails>);

    const f24Payments = getF24Payments(payments, recIndex, onlyF24);

    expect(f24Payments).toStrictEqual(res);
  });

  it('should populate the PagoPa payments with recipientIdx using getPagoPaF24Payments', () => {
    const recIndex = 1;
    const res = payments.reduce((arr, payment, index) => {
      if (payment.pagoPa) {
        // eslint-disable-next-line functional/immutable-data
        arr.push({
          pagoPa: {
            ...payment.pagoPa,
            attachmentIdx: index,
            recIndex,
          } as PagoPAPaymentFullDetails,
          f24: payment.f24 ? { ...payment.f24, attachmentIdx: index, recIndex } : undefined,
        });
      }
      return arr;
    }, [] as Array<PaymentDetails>);

    const pagoPaF24Payments = getPagoPaF24Payments(payments, recIndex);

    expect(pagoPaF24Payments).toStrictEqual(res);
  });
});
