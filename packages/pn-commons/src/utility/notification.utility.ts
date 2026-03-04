/* eslint-disable sonarjs/cognitive-complexity */

/* eslint-disable complexity */

/* eslint-disable functional/immutable-data */
import { isNil, omit } from 'lodash-es';

import {
  AnalogWorkflowDetails,
  ExtRegistriesPaymentDetails,
  F24PaymentDetails,
  INotificationDetailTimeline,
  LegalFactType,
  NotificationDetailDocument,
  NotificationDetailOtherDocument,
  NotificationDetailPayment,
  NotificationDetailRecipient,
  NotificationDetailTimelineDetails,
  NotificationStatusHistory,
  PagoPAPaymentFullDetails,
  PaidDetails,
  PaymentDetails,
  PaymentStatus,
  ResponseStatus,
  SendDigitalDetails,
  SendPaperDetails,
  TimelineCategory,
} from '../models/NotificationDetail';
import { NotificationStatus } from '../models/NotificationStatus';
import { getLocalizedOrDefaultLabel } from '../utility/localization.utility';
import { TimelineStepInfo } from './TimelineUtils/TimelineStep';
import { TimelineStepFactory } from './TimelineUtils/TimelineStepFactory';

type StatusInfo = {
  label: string;
  tooltip: string;
  description: string;
};

/*
 * Besides the values used in the generation of the final messages,
 * data can include an isMultiRecipient attribute, which refers to the notification.
 * If set to true, the "-tooltip-multirecipient" and "-description-multirecipient"
 * (instead of just "-tooltip" and "-description")
 * entries will be looked for in the i18n catalog.
 */
function localizeStatus(status: string, data?: { [key: string]: any }): StatusInfo {
  const isMultiRecipient = data?.isMultiRecipient;
  // eslint-disable-next-line functional/no-let
  let filteredData: any = omit(data, ['isMultiRecipient']);
  if (Object.keys(filteredData).length === 0) {
    filteredData = undefined;
  }

  return {
    label: getLocalizedOrDefaultLabel(
      'notifications',
      `status.${status}${isMultiRecipient ? '-multirecipient' : ''}`
    ),
    tooltip: getLocalizedOrDefaultLabel(
      'notifications',
      `status.${status}-tooltip${isMultiRecipient ? '-multirecipient' : ''}`,
      undefined,
      filteredData
    ),
    description: getLocalizedOrDefaultLabel(
      'notifications',
      `status.${status}-description${isMultiRecipient ? '-multirecipient' : ''}`,
      undefined,
      filteredData
    ),
  };
}

/*
 * Returns the mapping between current notification delivered status, label and descriptive message for PA
 * @param  {NotificationStatus} status
 * @returns object
 */
function getNotificationDeliveredInfosForPA(
  statusInfos: StatusInfo,
  statusObject: NotificationStatusHistory | undefined,
  statusHistory: Array<NotificationStatusHistory>
): StatusInfo {
  if (!statusObject) {
    return statusInfos;
  }
  // the timeline event that tells us if there is a stock and its status can be in the DELIVERED status and also in the DELIVERING one.
  // we have to get the DELIVERING STATUS and get only those events that are cronologically before the DELIVERED status
  // for each status we have the activeFrom property that is the date from witch the status starts to take effect
  const activeFrom = new Date(statusObject.activeFrom);
  // the timeline can be corrected and so we can have multiple DELIVERED statuses
  // in this case we have to get only those DELIVERING events that are releated to the current DELIVERED status
  // to do this, we have to check if there is a DELIVERED status next to the current (beacuse the events are ordered from most recent to the oldest)
  const nextDeliveredStatus = statusHistory.find(
    (status) =>
      status.status === NotificationStatus.DELIVERED && new Date(status.activeFrom) < activeFrom
  );
  // calc when the next status starts to take effect
  const activeTo = nextDeliveredStatus ? new Date(nextDeliveredStatus.activeFrom) : null;
  // get delivering status and filter out those events that are from the date of delivered status activation
  // and the date of the next status activation (i.e. the date from witch the delivered status ends to take effect)
  const deliveringStatus = statusHistory.find(
    (history) => history.status === NotificationStatus.DELIVERING
  );
  const deliveringStepsBeforeDelivered = deliveringStatus?.steps?.filter((step) =>
    activeTo
      ? new Date(step.timestamp) <= activeFrom && new Date(step.timestamp) > activeTo
      : new Date(step.timestamp) <= activeFrom
  );
  const stepsToCheck = [...(statusObject.steps || []), ...(deliveringStepsBeforeDelivered ?? [])];
  const isStock = stepsToCheck.find(
    (step) =>
      (step.category === TimelineCategory.SEND_ANALOG_PROGRESS &&
        (step.details as SendPaperDetails).deliveryDetailCode === 'RECRN003C') ||
      (step.details as SendPaperDetails).deliveryDetailCode === 'RECRN011'
  );
  const isWithdrawnStock = stepsToCheck.find(
    (step) =>
      (step.category === TimelineCategory.SEND_ANALOG_PROGRESS &&
        (step.details as SendPaperDetails).deliveryDetailCode === 'RECAG005C') ||
      (step.details as SendPaperDetails).deliveryDetailCode === 'RECAG006C'
  );
  const isExpiredStock = stepsToCheck.find(
    (step) =>
      step.category === TimelineCategory.SEND_ANALOG_PROGRESS &&
      (step.details as SendPaperDetails).deliveryDetailCode === 'RECAG008C'
  );
  // case giacenza
  if (isStock) {
    statusInfos.label = getLocalizedOrDefaultLabel('notifications', 'status.delivered-stock');
    statusInfos.description = getLocalizedOrDefaultLabel(
      'notifications',
      'status.delivered-stock-description'
    );
  } else if (isWithdrawnStock) {
    // case withdraw stock
    statusInfos.label = getLocalizedOrDefaultLabel(
      'notifications',
      'status.delivered-withdrawn-stock'
    );
    statusInfos.description = getLocalizedOrDefaultLabel(
      'notifications',
      'status.delivered-withdrawn-stock-description'
    );
  } else if (isExpiredStock) {
    // case expired stock
    statusInfos.label = getLocalizedOrDefaultLabel(
      'notifications',
      'status.delivered-expired-stock'
    );
    statusInfos.description = getLocalizedOrDefaultLabel(
      'notifications',
      'status.delivered-expired-stock-description'
    );
  } else {
    statusInfos.label = getLocalizedOrDefaultLabel(
      'notifications',
      'status.delivered-monorecipient'
    );
  }
  return statusInfos;
}

/**
 * Returns the mapping between current notification status and its color, label and descriptive message.
 * @param  {NotificationStatus} status
 * @returns object
 */
export function getNotificationStatusInfos(
  status: NotificationStatus | NotificationStatusHistory,
  options?: {
    statusHistory?: Array<NotificationStatusHistory>;
    recipients: Array<NotificationDetailRecipient | string>;
    isParty?: boolean;
  }
): {
  color: 'warning' | 'error' | 'success' | 'info' | 'default' | 'primary' | 'secondary' | undefined;
  label: string;
  tooltip: string;
  description: string;
} {
  const statusComesAsAnObject = !!(status as NotificationStatusHistory).status;
  const statusObject: NotificationStatusHistory | undefined = statusComesAsAnObject
    ? (status as NotificationStatusHistory)
    : undefined;
  const actualStatus: NotificationStatus = statusComesAsAnObject
    ? (status as NotificationStatusHistory).status
    : (status as NotificationStatus);
  const isMultiRecipient = options && options.recipients.length > 1;

  // the subject is either the recipient or (for the VIEWED)
  // the delegate who have seen the notification for first.
  // Hence the "let" is OK, in the particular cases inside the following switch statement
  // it will be reassigned if needed (i.e. if the value should reference a delegate instead).

  /* eslint-disable-next-line functional/no-let */
  let subject = getLocalizedOrDefaultLabel('notifications', `status.recipient`, 'destinatario');

  // beware!!
  // the isMultiRecipient attribute should be added to data (when calling localizeStatus)
  // **only** if the tooltip and copy for a state should differ for multi-recipient notification.
  // If copy and tooltip are the same for the mono and multi-recipient cases,
  // then this attribute should **not** be sent, so that the default/mono literals will be taken.
  // ---------------------------------------------------
  // Carlos Lombardi, 2023.02.23

  switch (actualStatus) {
    case NotificationStatus.DELIVERED: {
      const statusInfos = localizeStatus('delivered', { isMultiRecipient });
      // if the deliveryMode is defined, then change the description for a more specific one ...
      const deliveryMode = statusObject?.deliveryMode;
      // ... only for single-recipient notifications!
      if (deliveryMode && !isMultiRecipient && !options?.isParty) {
        const deliveryModeDescription = getLocalizedOrDefaultLabel(
          'notifications',
          `status.deliveryMode.${deliveryMode}`
        );
        statusInfos.description = getLocalizedOrDefaultLabel(
          'notifications',
          'status.delivered-description-with-delivery-mode',
          undefined,
          { deliveryMode: deliveryModeDescription }
        );
      }
      // if it is a PA, change the title and the description
      // ... only for single-recipient notifications!
      if (options?.isParty && !isMultiRecipient) {
        getNotificationDeliveredInfosForPA(statusInfos, statusObject, options.statusHistory || []);
      }
      // set the color at the end to avoid a type error since the color is defined as an union among some well-known strings
      return { color: 'default', ...statusInfos };
    }
    case NotificationStatus.DELIVERING:
      return {
        color: 'default',
        ...localizeStatus('delivering'),
      };
    case NotificationStatus.UNREACHABLE:
      return {
        color: 'error',
        ...localizeStatus('unreachable', { isMultiRecipient }),
      };
    case NotificationStatus.PAID:
      return {
        color: 'success',
        ...localizeStatus('paid'),
      };
    case NotificationStatus.ACCEPTED:
      return {
        color: 'default',
        ...localizeStatus('accepted'),
      };
    case NotificationStatus.EFFECTIVE_DATE:
      return {
        color: 'info',
        ...localizeStatus('effective-date', { isMultiRecipient }),
      };
    case NotificationStatus.VIEWED:
      if (statusObject?.recipient) {
        subject = getLocalizedOrDefaultLabel(
          'notifications',
          `status.delegate`,
          `delegato ${statusObject.recipient}`,
          { name: statusObject.recipient }
        );
      }
      return {
        color: 'success',
        ...localizeStatus('viewed', { subject, isMultiRecipient }),
      };
    case NotificationStatus.CANCELLED:
      return {
        color: 'warning',
        ...localizeStatus('canceled'),
      };
    case NotificationStatus.CANCELLATION_IN_PROGRESS:
      return {
        color: 'warning',
        ...localizeStatus('cancellation-in-progress'),
      };
    case NotificationStatus.RETURNED_TO_SENDER:
      return {
        color: 'warning',
        ...localizeStatus('returned-to-sender', { isMultiRecipient }),
      };
    case NotificationStatus.NOTIFICATION_TIMELINE_REWORKED:
      return {
        color: 'warning',
        ...localizeStatus('notification-timeline-reworked'),
      };
    default:
      return {
        color: 'default',
        label: 'Non definito',
        tooltip: 'Stato sconosciuto',
        description: 'Stato sconosciuto',
      };
  }
}

export const getNotificationAllowedStatus = () => [
  {
    value: 'All',
    label: getLocalizedOrDefaultLabel('notifications', 'status.all'),
  },
  {
    value: NotificationStatus.ACCEPTED,
    label: getLocalizedOrDefaultLabel('notifications', 'status.accepted'),
  },
  {
    value: NotificationStatus.DELIVERING,
    label: getLocalizedOrDefaultLabel('notifications', 'status.delivering'),
  },
  {
    value: NotificationStatus.DELIVERED,
    label: getLocalizedOrDefaultLabel('notifications', 'status.delivered'),
  },
  {
    value: NotificationStatus.EFFECTIVE_DATE,
    label: getLocalizedOrDefaultLabel('notifications', 'status.effective-date'),
  },
  {
    value: NotificationStatus.VIEWED,
    label: getLocalizedOrDefaultLabel('notifications', 'status.viewed'),
  },
  {
    value: NotificationStatus.CANCELLED,
    label: getLocalizedOrDefaultLabel('notifications', 'status.canceled'),
  },
  {
    value: NotificationStatus.UNREACHABLE,
    label: getLocalizedOrDefaultLabel('notifications', 'status.unreachable'),
  },
  {
    value: NotificationStatus.RETURNED_TO_SENDER,
    label: getLocalizedOrDefaultLabel('notifications', 'status.returned-to-sender'),
  },
];

function legalFactTypeForAnalogEvent(
  timelineStep: INotificationDetailTimeline,
  legalFactKey?: string
) {
  const attachments = (timelineStep.details as SendPaperDetails).attachments;
  const matchingAttachment = legalFactKey && attachments?.find((att) => att.url === legalFactKey);
  return matchingAttachment ? matchingAttachment.documentType : undefined;
}

/**
 * Get legalFact label based on timeline step and legalfact type.
 * @param {INotificationDetailTimeline} timelineStep Timeline step
 * @param {LegalFactType} legalFactType Legalfact type
 * @returns {string} attestation or receipt
 */
export function getLegalFactLabel(
  timelineStep: INotificationDetailTimeline,
  legalFactType?: LegalFactType | 'AAR',
  legalFactKey?: string
): string {
  const legalFactLabel = getLocalizedOrDefaultLabel(
    'notifications',
    `detail.legalfact`,
    'Attestazione opponibile a terzi'
  );
  const receiptLabel = getLocalizedOrDefaultLabel('notifications', `detail.receipt`, 'Ricevuta');
  // TODO: localize in pn_ga branch

  // To the moment the examples of legal facts associated to this
  // kind of events have ANALOG_DELIVERY as legalFactType, but I'm not sure this is OK,
  // I already asked to BE colleagues.
  // Moreover, I found no documentation which indicates
  // the legalFactType to expect for such events.
  // Hence I keep the condition on the category only.
  // -------------------------
  // Update as of 2023.04.21
  //
  // As far as the new specification seems to indicate,
  // the attachments for the analog flow will be always linked to
  // SEND_ANALOG_PROGRESS events and not to SEND_ANALOG_FEEDBACK ones.
  // As this is quite recent and maybe not that stable, I prefer to keep this code commented out
  // for a while
  // -------------------------
  // Carlos Lombardi
  // -------------------------
  // if (timelineStep.category === TimelineCategory.SEND_ANALOG_FEEDBACK) {
  //   if ((timelineStep.details as SendPaperDetails).responseStatus === ResponseStatus.OK) {
  //     return `${receiptLabel} ${getLocalizedOrDefaultLabel(
  //       'notifications',
  //       'detail.timeline.legalfact.paper-receipt-delivered',
  //       'di consegna raccomandata'
  //     )}`;
  //   } else if ((timelineStep.details as SendPaperDetails).responseStatus === ResponseStatus.KO) {
  //     return `${receiptLabel} ${getLocalizedOrDefaultLabel(
  //       'notifications',
  //       'detail.timeline.legalfact.paper-receipt-not-delivered',
  //       'di mancata consegna raccomandata'
  //     )}`;
  //   }
  //   return receiptLabel;

  // For the SEND_ANALOG_PROGRESS / SEND_SIMPLE_REGISTERED_LETTER_PROGRESS events,
  // the text depend on the kind of document ... that is not indicated in legalFactType,
  // but rather inside the "attachments" attribute present in the detail of the timeline step
  // -------------------------
  // Carlos Lombardi
  if (
    timelineStep.category === TimelineCategory.SEND_ANALOG_PROGRESS ||
    timelineStep.category === TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER_PROGRESS
  ) {
    const type = legalFactTypeForAnalogEvent(timelineStep, legalFactKey) || 'generic';
    // eslint-disable-next-line functional/no-let
    let text = getLocalizedOrDefaultLabel(
      'notifications',
      `detail.timeline.analog-workflow-attachment-kind.${type}`,
      ''
    );
    if (text.length === 0) {
      text = getLocalizedOrDefaultLabel(
        'notifications',
        'detail.timeline.analog-workflow-attachment-kind.generic',
        `Documento allegato all'evento`
      );
    }
    return text;
    // Carlos Lombardi

    // PN-5484
  } else if (
    timelineStep.category === TimelineCategory.COMPLETELY_UNREACHABLE &&
    legalFactType === LegalFactType.ANALOG_FAILURE_DELIVERY
  ) {
    return getLocalizedOrDefaultLabel(
      'notifications',
      'detail.timeline.legalfact.analog-failure-delivery',
      'Deposito avviso di avvenuta ricezione'
    );
  } else if (
    timelineStep.category === TimelineCategory.ANALOG_FAILURE_WORKFLOW &&
    (timelineStep.details as AnalogWorkflowDetails).generatedAarUrl
  ) {
    return getLocalizedOrDefaultLabel(
      'notifications',
      'detail.timeline.aar-document',
      'Avviso di avvenuta ricezione'
    );
  } else if (
    timelineStep.category === TimelineCategory.SEND_DIGITAL_PROGRESS &&
    legalFactType === LegalFactType.PEC_RECEIPT
  ) {
    if (
      (timelineStep.details as SendDigitalDetails).deliveryDetailCode === 'C001' ||
      (timelineStep.details as SendDigitalDetails).deliveryDetailCode === 'DP00'
    ) {
      return `${receiptLabel} ${getLocalizedOrDefaultLabel(
        'notifications',
        'detail.timeline.legalfact.pec-receipt-accepted',
        'di accettazione PEC'
      )}`;
    } else if (
      (timelineStep.details as SendDigitalDetails).deliveryDetailCode === 'C008' ||
      (timelineStep.details as SendDigitalDetails).deliveryDetailCode === 'C010' ||
      (timelineStep.details as SendDigitalDetails).deliveryDetailCode === 'DP10'
    ) {
      return `${receiptLabel} ${getLocalizedOrDefaultLabel(
        'notifications',
        'detail.timeline.legalfact.pec-receipt-not-accepted',
        'di mancata accettazione PEC'
      )}`;
    }
  } else if (
    timelineStep.category === TimelineCategory.SEND_DIGITAL_FEEDBACK &&
    legalFactType === LegalFactType.PEC_RECEIPT
  ) {
    if ((timelineStep.details as SendDigitalDetails).responseStatus === ResponseStatus.OK) {
      return `${receiptLabel} ${getLocalizedOrDefaultLabel(
        'notifications',
        'detail.timeline.legalfact.pec-receipt-delivered',
        'di consegna PEC'
      )}`;
    } else if ((timelineStep.details as SendDigitalDetails).responseStatus === ResponseStatus.KO) {
      return `${receiptLabel} ${getLocalizedOrDefaultLabel(
        'notifications',
        'detail.timeline.legalfact.pec-receipt-not-delivered',
        'di mancata consegna PEC'
      )}`;
    }
    // this is (at least in the examples I've seen)
    // related to the category REQUEST_ACCEPTED
  } else if (legalFactType === LegalFactType.SENDER_ACK) {
    return `${legalFactLabel}: ${getLocalizedOrDefaultLabel(
      'notifications',
      'detail.timeline.legalfact.sender-ack',
      'notifica presa in carico'
    )}`;
  } else if (
    legalFactType === LegalFactType.DIGITAL_DELIVERY &&
    timelineStep.category === TimelineCategory.DIGITAL_SUCCESS_WORKFLOW
  ) {
    return `${legalFactLabel}: ${getLocalizedOrDefaultLabel(
      'notifications',
      'detail.timeline.legalfact.digital-delivery-success',
      'notifica digitale'
    )}`;
  } else if (
    legalFactType === LegalFactType.DIGITAL_DELIVERY &&
    timelineStep.category === TimelineCategory.DIGITAL_FAILURE_WORKFLOW
  ) {
    return `${legalFactLabel}: ${getLocalizedOrDefaultLabel(
      'notifications',
      'detail.timeline.legalfact.digital-delivery-failure',
      'mancato recapito digitale'
    )}`;

    // this is(at least in the examples I've seen)
    // related to the category NOTIFICATION_VIEWED
  } else if (legalFactType === LegalFactType.RECIPIENT_ACCESS) {
    return `${legalFactLabel}: ${getLocalizedOrDefaultLabel(
      'notifications',
      'detail.timeline.legalfact.recipient-access',
      'avvenuto accesso'
    )}`;
  } else if (legalFactType === LegalFactType.NOTIFICATION_CANCELLED) {
    return `${getLocalizedOrDefaultLabel(
      'notifications',
      'detail.timeline.notification-cancelled-document',
      'Dichiarazione annullamento notifica'
    )}`;
  }
  return legalFactLabel;
}

/**
 * Returns the mapping between current notification timeline status and its label and descriptive message.
 * @param  {INotificationDetailTimeline} step
 * @param {Array<NotificationDetailRecipient>} recipients
 * @returns {TimelineStepInfo | null }
 */
export function getNotificationTimelineStatusInfos(
  step: INotificationDetailTimeline,
  recipients: Array<NotificationDetailRecipient>,
  allStepsForThisStatus?: Array<INotificationDetailTimeline>
): TimelineStepInfo | null {
  const recipient = isNil(step.details.recIndex)
    ? undefined
    : // For the accesses from recipient apps (cittadino / impresa)
    // the API response will probably (in some future) include only the info about the requester recipient,
    // i.e. recipients will be an array with exactly one element, disregarding how many recipients are included
    // in the notification being requested.
    // In that case, we don't consider the recIndex indicated in each timeline step,
    // but otherwise take all steps as related with the only recipient included in the API response.
    recipients.length === 1
    ? recipients[0]
    : recipients[step.details.recIndex];

  // we show the multirecipient versions of the step descriptions
  // only if the array of recipients include more than one "full" element
  // (i.e. an element including the full data about the recipient, instead of being included
  // just to preserve the correlation with the recIndex in each step).
  // We consider a recipient description to be "full" if it includes recipientType, taxId and denomination.
  // -------------------------------------
  // Carlos Lombardi, 2023.05.17
  // cfr. PN-5911
  // -------------------------------------
  return TimelineStepFactory.createTimelineStep(step).getTimelineStepInfo({
    step,
    recipient,
    isMultiRecipient:
      recipients.filter(
        (recDescription) =>
          recDescription.denomination && recDescription.taxId && recDescription.recipientType
      ).length > 1,
    allStepsForThisStatus,
  });
}

export const getF24Payments = (
  payments: Array<NotificationDetailPayment>,
  recIndex: number,
  onlyF24: boolean = true
): Array<F24PaymentDetails> =>
  payments.reduce((arr, payment, index) => {
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

export const getPagoPaF24Payments = (
  payments: Array<NotificationDetailPayment>,
  recIndex: number,
  withLoading: boolean = false
): Array<PaymentDetails> =>
  payments.reduce((arr, payment, index) => {
    if (payment.pagoPa) {
      // eslint-disable-next-line functional/immutable-data
      arr.push({
        pagoPa: {
          ...payment.pagoPa,
          attachmentIdx: index,
          recIndex,
        } as PagoPAPaymentFullDetails,
        f24: payment.f24 ? { ...payment.f24, attachmentIdx: index, recIndex } : undefined,
        ...(withLoading && { isLoading: true }),
      });
    }
    return arr;
  }, [] as Array<PaymentDetails>);

/**
 * Populate only pagoPA(with eventual f24 associated) payment history array before send notification to fe.
 * @param  {Array<INotificationDetailTimeline>} timeline
 * @param  {Array<PaymentDetails>} pagoPaF24Payments
 * @param  {Array<ExtRegistriesPaymentDetails>} checkoutPayments
 * @returns Array<PaymentDetails>
 */
export const populatePaymentsPagoPaF24 = (
  timeline: Array<INotificationDetailTimeline>,
  pagoPaF24Payments: Array<PaymentDetails> | Array<NotificationDetailPayment>,
  checkoutPayments: Array<ExtRegistriesPaymentDetails>
): Array<PaymentDetails> => {
  const paymentDetails: Array<PaymentDetails> = [];

  if (!pagoPaF24Payments || pagoPaF24Payments.length === 0) {
    return [];
  }

  // 1. Get all timeline steps that have category payment
  const paymentTimelineStep = timeline.filter((t) => t.category === TimelineCategory.PAYMENT);

  // 2. populate payment history array with the informations from timeline and related recipients
  for (const userPayment of pagoPaF24Payments) {
    if (!userPayment.pagoPa) {
      continue;
    }

    if (
      checkoutPayments.length &&
      checkoutPayments?.findIndex(
        (payment) =>
          payment.creditorTaxId === userPayment.pagoPa?.creditorTaxId &&
          payment.noticeCode === userPayment.pagoPa?.noticeCode
      ) === -1
    ) {
      continue;
    }

    // 3. Get payment by creditorTaxId and noticeCode from checkout
    const checkoutPayment = checkoutPayments.find(
      (p) =>
        p.creditorTaxId === userPayment?.pagoPa?.creditorTaxId &&
        p.noticeCode === userPayment?.pagoPa?.noticeCode
    );

    const timelineEvent = paymentTimelineStep.find((item) => {
      const paymentDetails = item.details as PaidDetails;

      return (
        paymentDetails.creditorTaxId === userPayment?.pagoPa?.creditorTaxId &&
        paymentDetails.noticeCode === userPayment?.pagoPa?.noticeCode
      );
    })?.details;

    if (timelineEvent) {
      (Object.keys(timelineEvent) as Array<keyof NotificationDetailTimelineDetails>).forEach(
        (key) => (timelineEvent[key] === undefined ? delete timelineEvent[key] : {})
      );
    }

    const pagoPAPayment = {
      ...userPayment.pagoPa,
      ...checkoutPayment,
      ...timelineEvent,
    };

    if (timelineEvent && !checkoutPayment) {
      // from timeline we have only succeded payments
      pagoPAPayment.status = PaymentStatus.SUCCEEDED;
    }

    paymentDetails.push({
      pagoPa: pagoPAPayment,
      f24: userPayment.f24,
    } as PaymentDetails);
  }

  return paymentDetails;
};

export const isNotificationDetailOtherDocument = (
  value: NotificationDetailDocument | NotificationDetailOtherDocument
): value is NotificationDetailOtherDocument => value.documentType === 'AAR';
