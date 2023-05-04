/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
/* eslint-disable functional/immutable-data */
import _ from 'lodash';

import { formatDate } from '../utils';
import { getLocalizedOrDefaultLabel } from '../services/localization.service';
import {
  INotificationDetailTimeline,
  TimelineCategory,
  NotificationDetailRecipient,
  NotificationDetail,
  NotificationStatus,
  NotificationStatusHistory,
  AarDetails,
  LegalFactType,
  NotificationDetailDocument,
  SendDigitalDetails,
  ViewedDetails,
  SendPaperDetails,
  NotificationDeliveryMode,
  SendCourtesyMessageDetails,
  DigitalDomicileType,
  PaidDetails,
  PaymentHistory,
} from '../types';
import { AppIoCourtesyMessageEventType } from '../types/NotificationDetail';
import { TimelineStepInfo } from './TimelineUtils/TimelineStep';
import { TimelineStepFactory } from './TimelineUtils/TimelineStepFactory';

/*
 * Besides the values used in the generation of the final messages,
 * data can include an isMultiRecipient attribute, which refers to the notification.
 * If set to true, the "-tooltip-multirecipient" and "-description-multirecipient"
 * (instead of just "-tooltip" and "-description")
 * entries will be looked for in the i18n catalog.
 */
function localizeStatus(
  status: string,
  defaultLabel: string,
  defaultTooltip: string,
  defaultDescription: string,
  data?: { [key: string]: any }
): {
  label: string;
  tooltip: string;
  description: string;
} {
  const isMultiRecipient = data && data.isMultiRecipient;
  // eslint-disable-next-line functional/no-let
  let filteredData: any = _.omit(data, ['isMultiRecipient']);
  if (Object.keys(filteredData).length === 0) {
    filteredData = undefined;
  }

  return {
    label: getLocalizedOrDefaultLabel(
      'notifications',
      `status.${status}${isMultiRecipient ? '-multirecipient' : ''}`,
      defaultLabel
    ),
    tooltip: getLocalizedOrDefaultLabel(
      'notifications',
      `status.${status}-tooltip${isMultiRecipient ? '-multirecipient' : ''}`,
      defaultTooltip,
      filteredData
    ),
    description: getLocalizedOrDefaultLabel(
      'notifications',
      `status.${status}-description${isMultiRecipient ? '-multirecipient' : ''}`,
      defaultDescription,
      filteredData
    ),
  };
}

/**
 * Returns the mapping between current notification status and its color, label and descriptive message.
 * @param  {NotificationStatus} status
 * @returns object
 */
export function getNotificationStatusInfos(
  status: NotificationStatus | NotificationStatusHistory,
  options?: { recipients: Array<NotificationDetailRecipient | string> }
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
    case NotificationStatus.DELIVERED:
      const statusInfos = localizeStatus(
        'delivered',
        'Consegnata',
        `La notifica è stata consegnata`,
        'La notifica è stata consegnata.',
        { isMultiRecipient }
      );
      // if the deliveryMode is defined, then change the description for a more specific one ...
      const deliveryMode = statusObject && statusObject.deliveryMode;
      // ... only for single-recipient notifications!
      if (deliveryMode && !isMultiRecipient) {
        const deliveryModeDescription = getLocalizedOrDefaultLabel(
          'notifications',
          `status.deliveryMode.${deliveryMode}`,
          `${deliveryMode}`
        );
        statusInfos.description = getLocalizedOrDefaultLabel(
          'notifications',
          'status.delivered-description-with-delivery-mode',
          `La notifica è stata consegnata per via ${
            deliveryMode === NotificationDeliveryMode.ANALOG ? 'analogica' : 'digitale'
          }.`,
          { deliveryMode: deliveryModeDescription }
        );
      }
      // set the color at the end to avoid a type error since the color is defined as an union among some well-known strings
      return { color: 'default', ...statusInfos };
    case NotificationStatus.DELIVERING:
      return {
        color: 'default',
        ...localizeStatus(
          'delivering',
          'Invio in corso',
          "L'invio della notifica è in corso",
          "L'invio della notifica è in corso"
        ),
      };
    case NotificationStatus.UNREACHABLE:
      return {
        color: 'error',
        ...localizeStatus(
          'unreachable',
          'Destinatario irreperibile',
          'Il destinatario non è reperibile',
          'Il destinatario non è reperibile',
          { isMultiRecipient }
        ),
      };
    case NotificationStatus.PAID:
      return {
        color: 'success',
        ...localizeStatus(
          'paid',
          'Pagata',
          'Il destinatario ha pagato i costi della notifica',
          'Il destinatario ha pagato i costi della notifica'
        ),
      };
    case NotificationStatus.ACCEPTED:
      return {
        color: 'default',
        ...localizeStatus(
          'accepted',
          'Depositata',
          "L'ente ha depositato la notifica",
          "L'ente ha depositato la notifica"
        ),
      };
    case NotificationStatus.EFFECTIVE_DATE:
      return {
        color: 'info',
        ...localizeStatus(
          'effective-date',
          'Perfezionata per decorrenza termini',
          'Il destinatario non ha letto la notifica',
          'Il destinatario non ha letto la notifica entro il termine stabilito',
          { isMultiRecipient }
        ),
      };
    case NotificationStatus.VIEWED:
      if (statusObject && statusObject.recipient) {
        subject = getLocalizedOrDefaultLabel(
          'notifications',
          `status.delegate`,
          `delegato ${statusObject.recipient}`,
          { name: statusObject.recipient }
        );
      }
      return {
        color: 'info',
        ...localizeStatus(
          'viewed',
          'Avvenuto accesso',
          `Il ${subject} ha letto la notifica`,
          `Il ${subject} ha letto la notifica`,
          { subject, isMultiRecipient }
        ),
      };
    case NotificationStatus.CANCELLED:
      return {
        color: 'warning',
        ...localizeStatus(
          'canceled',
          'Annullata',
          "L'ente ha annullato l'invio della notifica",
          "L'ente ha annullato l'invio della notifica"
        ),
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
    label: getLocalizedOrDefaultLabel('notifications', 'status.all', 'Tutti gli stati'),
  },
  {
    value: NotificationStatus.ACCEPTED,
    label: getLocalizedOrDefaultLabel('notifications', 'status.accepted', 'Depositata'),
  },
  {
    value: NotificationStatus.DELIVERING,
    label: getLocalizedOrDefaultLabel('notifications', 'status.delivering', 'Invio in corso'),
  },
  {
    value: NotificationStatus.DELIVERED,
    label: getLocalizedOrDefaultLabel('notifications', 'status.delivered', 'Consegnata'),
  },
  {
    value: NotificationStatus.EFFECTIVE_DATE,
    label: getLocalizedOrDefaultLabel(
      'notifications',
      'status.effective-date',
      'Perfezionata per decorrenza termini'
    ),
  },
  {
    value: NotificationStatus.VIEWED,
    label: getLocalizedOrDefaultLabel('notifications', 'status.viewed', 'Avvenuto accesso'),
  },
  {
    value: NotificationStatus.CANCELLED,
    label: getLocalizedOrDefaultLabel('notifications', 'status.canceled', 'Annullata'),
  },
  {
    value: NotificationStatus.UNREACHABLE,
    label: getLocalizedOrDefaultLabel(
      'notifications',
      'status.unreachable',
      'Destinatario irreperibile'
    ),
  },
];


function legalFactTypeForAnalogEvent(timelineStep: INotificationDetailTimeline, legalFactKey?: string) {
  const attachments = (timelineStep.details as SendPaperDetails).attachments;
  const matchingAttachment = legalFactKey && attachments && attachments.find(att => att.url === legalFactKey);
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
  legalFactType?: LegalFactType,
  legalFactKey?: string,
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

  // For the SEND_ANALOG_PROGRESS / SIMPLE_REGISTERED_LETTER_PROGRESS events,
  // the text depend on the kind of document ... that is not indicated in legalFactType,
  // but rather inside the "attachments" attribute present in the detail of the timeline step
  // -------------------------
  // Carlos Lombardi
  if (
    timelineStep.category === TimelineCategory.SEND_ANALOG_PROGRESS || 
    timelineStep.category === TimelineCategory.SIMPLE_REGISTERED_LETTER_PROGRESS
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
      'Deposito di avvenuta ricezione'
    );
  } else if (
    timelineStep.category === TimelineCategory.ANALOG_FAILURE_WORKFLOW && 
    legalFactType === LegalFactType.AAR
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
    if ((timelineStep.details as SendDigitalDetails).responseStatus === 'OK') {
      return `${receiptLabel} ${getLocalizedOrDefaultLabel(
        'notifications',
        'detail.timeline.legalfact.pec-receipt-delivered',
        'di consegna PEC'
      )}`;
    } else if ((timelineStep.details as SendDigitalDetails).responseStatus === 'KO') {
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

  // this is (at least in the examples I've seen)
  // related to the category NOTIFICATION_VIEWED
  } else if (legalFactType === LegalFactType.RECIPIENT_ACCESS) {
    return `${legalFactLabel}: ${getLocalizedOrDefaultLabel(
      'notifications',
      'detail.timeline.legalfact.recipient-access',
      'avvenuto accesso'
    )}`;
  }
  return legalFactLabel;
}

/**
 * Returns the mapping between current notification timeline status and its label and descriptive message.
 * @param  {INotificationDetailTimeline} step
 * @param {Array<NotificationDetailRecipient>} recipients
 * @returns {TimelineStepInfo | null}
 */
export function getNotificationTimelineStatusInfos(
  step: INotificationDetailTimeline,
  recipients: Array<NotificationDetailRecipient>,
  allStepsForThisStatus?: Array<INotificationDetailTimeline>
): TimelineStepInfo | null {
  const recipient = !_.isNil(step.details.recIndex) ? recipients[step.details.recIndex] : undefined;

  return TimelineStepFactory.createTimelineStep(step).getTimelineStepInfo({
    step,
    recipient,
    isMultiRecipient: recipients.length > 1,
    allStepsForThisStatus
  });
}

const TimelineAllowedStatus = [
  TimelineCategory.SCHEDULE_DIGITAL_WORKFLOW,
  TimelineCategory.SEND_DIGITAL_DOMICILE,
  TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER,
  TimelineCategory.SEND_ANALOG_DOMICILE,
  TimelineCategory.SEND_DIGITAL_FEEDBACK,
  TimelineCategory.SEND_DIGITAL_PROGRESS,
  // PN-2068
  TimelineCategory.SEND_COURTESY_MESSAGE,
  // PN-1647
  TimelineCategory.NOT_HANDLED,
  TimelineCategory.SEND_ANALOG_PROGRESS,
  TimelineCategory.SEND_ANALOG_FEEDBACK,
  TimelineCategory.SIMPLE_REGISTERED_LETTER_PROGRESS
];

const AnalogFlowAllowedCodes = [
  'CON080',
  'RECRN001C',
  'RECRN002C',
  'RECRN002F',
  'RECRN003C',
  'RECRN004C',
  'RECRN005C',
  'RECRN006',
  'RECAG001C',
  'RECAG002C',
  'RECAG003C',
  'RECAG003F',
  'RECAG004',
  'PNAG012',
  'RECAG005C',
  'RECAG006C',
  'RECAG007C',
  'RECAG008C',
  'RECRI003C',
  'RECRI004C',
  'RECRI005',
  // only to include the legal fact reference at the right point in the timeline
  'RECRN001B',
  'RECRN002B',
  'RECRN002E',
  'RECRN003B',
  'RECRN004B',
  'RECRN005B',
  'RECAG001B',
  'RECAG002B',
  'RECAG003B',
  'RECAG003E',
  'RECAG011B',
  'RECAG005B',
  'RECAG006B',
  'RECAG007B',
  'RECAG008B',
  'RECRI003B',
  'RECRI004B',
];

/*
 * PN-4484 - courtesy message through app IO only seen
 * if details.ioSendMessageResult = SENT_COURTESY
 * (cfr. definition of AppIoCourtesyMessageEventType)
 * so any other kind of message is deemed as internal.
 *
 * To preserve backward compatibility, if the attribute has no value,
 * the message is not considered internal (and thus shown).
 */
function isInternalAppIoEvent(step: INotificationDetailTimeline): boolean {
  if (step.category === TimelineCategory.SEND_COURTESY_MESSAGE) {
    const details = step.details as SendCourtesyMessageDetails;
    return (
      details.digitalAddress.type === DigitalDomicileType.APPIO &&
      !!details.ioSendMessageResult &&
      details.ioSendMessageResult !== AppIoCourtesyMessageEventType.SENT_COURTESY
    );
  } else {
    return false;
  }
}

/**
 * Populate timeline macro steps
 * @param  {NotificationDetail} parsedNotification
 * @param  {string} timelineElement
 * @param  {NotificationStatusHistory} status
 * @param  {Array<string>} acceptedStatusItems
 * @returns the found step, which is sometimes useful in populatedMacroSteps (i.e. the function calling this one)
 */
function populateMacroStep(
  parsedNotification: NotificationDetail,
  timelineElement: string,
  status: NotificationStatusHistory,
  acceptedStatusItems: Array<string>
): INotificationDetailTimeline | undefined {
  const step = parsedNotification.timeline.find((t) => t.elementId === timelineElement);
  if (step) {
    // hide accepted status micro steps
    if (status.status === NotificationStatus.ACCEPTED) {
      status.steps!.push({ ...step, hidden: true });
      // PN-4484 - hide the internal events related to the courtesy messages sent through app IO
    } else if (isInternalAppIoEvent(step)) {
      status.steps!.push({ ...step, hidden: true });
    // add legal facts for ANALOG_FAILURE_WORKFLOW steps with linked generatedAarUrl
    // since the AAR for such steps must be shown in timeline exactly the same way as legalFacts.
    // Cfr. comment in the definition of INotificationDetailTimeline in src/types/NotificationDetail.ts.
    } else if (step.category === TimelineCategory.ANALOG_FAILURE_WORKFLOW && (step.details as AarDetails).generatedAarUrl) {
      status.steps!.push({ 
        ...step, 
        legalFactsIds: [{ documentId: (step.details as AarDetails).generatedAarUrl as string, documentType: LegalFactType.AAR }] 
      });
    // remove legal facts for those microsteps that are releated to accepted status
    } else if (acceptedStatusItems.length && acceptedStatusItems.indexOf(step.elementId) > -1) {
      status.steps!.push({ ...step, legalFactsIds: [] });
      // default case
    } else {
      status.steps!.push(step);
    }
  }
  return step;
}

function fromLatestToEarliest(a: INotificationDetailTimeline, b: INotificationDetailTimeline) {
  if (new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime() >= 0) {
    return 1;
  }
  return -1;
}

function populateMacroSteps(parsedNotification: NotificationDetail) {
  /* eslint-disable functional/no-let */
  let acceptedStatusItems: Array<string> = [];
  let deliveryMode: NotificationDeliveryMode | undefined;
  let deliveringStatus: NotificationStatusHistory | undefined;
  /* eslint-enable functional/no-let */

  /* eslint-disable functional/no-let */
  let lastDeliveredIndexToShift = -1;
  let lastDeliveredIndexToShiftIsFixed = false;
  let preventShiftFromDeliveredToDelivering = false;
  /* eslint-enable functional/no-let */

  for (const status of parsedNotification.notificationStatusHistory) {
    // keep pointer to delivering status for eventual later use
    if (status.status === NotificationStatus.DELIVERING) {
      deliveringStatus = status;
    }
    // if status accepted has items, move them to the next state, but preserve legalfacts
    if (status.status === NotificationStatus.ACCEPTED && status.relatedTimelineElements.length) {
      acceptedStatusItems = status.relatedTimelineElements;
    } else if (acceptedStatusItems.length) {
      status.relatedTimelineElements.unshift(...acceptedStatusItems);
    }
    status.steps = [];

    // find timeline steps that are linked with current status
    status.relatedTimelineElements.forEach((timelineElement, ix) => {
      const step = populateMacroStep(
        parsedNotification,
        timelineElement,
        status,
        acceptedStatusItems
      );
      if (step) {
        // delivery mode: according to the first arrived
        // between DIGITAL_SUCCESS_WORKFLOW, SEND_SIMPLE_REGISTERED_LETTER and ANALOG_SUCCESS_WORKFLOW
        if (!deliveryMode && step.category === TimelineCategory.DIGITAL_SUCCESS_WORKFLOW) {
          deliveryMode = NotificationDeliveryMode.DIGITAL;
        } else if (
          !deliveryMode &&
          (step.category === TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER ||
            step.category === TimelineCategory.ANALOG_SUCCESS_WORKFLOW)
        ) {
          deliveryMode = NotificationDeliveryMode.ANALOG;
        }

        // if a DIGITAL_SUCCESS_WORKFLOW event is found in the DELIVERING status
        // (since as of 2023.02.13 the jump from DELIVERING to DELIVERED could not be related to the *first* digital shipment resolution)
        // then no shift is performed from DELIVERED to DELIVERING
        // ... I prefer to still shift events up to the first DIGITAL_SUCCESS_WORKFLOW found in DELIVERED status ...
        // keep the code just in case
        // if (status.status === NotificationStatus.DELIVERING && step.category === TimelineCategory.DIGITAL_SUCCESS_WORKFLOW) {
        //   preventShiftFromDeliveredToDelivering = true;
        // }

        // record the last timeline event from DELIVERED that must be shifted to DELIVERING
        // the rules:
        // - up to the last DIGITAL_FAILURE_WORKFLOW or SEND_SIMPLE_REGISTERED_LETTER or SIMPLE_REGISTERED_LETTER_PROGRESS element,
        // - or the first DIGITAL_SUCCESS_WORKFLOW afterwards a DIGITAL_FAILURE_WORKFLOW or SEND_SIMPLE_REGISTERED_LETTER or SIMPLE_REGISTERED_LETTER_PROGRESS
        //   (in this case, excluding it)
        // if a DIGITAL_SUCCESS_WORKFLOW is found before a DIGITAL_FAILURE_WORKFLOW or SEND_SIMPLE_REGISTERED_LETTER
        // then no shift has to be done
        if (
          status.status === NotificationStatus.DELIVERED &&
          !preventShiftFromDeliveredToDelivering
        ) {
          if (
            (step.category === TimelineCategory.DIGITAL_FAILURE_WORKFLOW 
              || step.category === TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER 
              || step.category === TimelineCategory.SIMPLE_REGISTERED_LETTER_PROGRESS) &&
            !lastDeliveredIndexToShiftIsFixed
          ) {
            lastDeliveredIndexToShift = ix;
          } else if (step.category === TimelineCategory.DIGITAL_SUCCESS_WORKFLOW) {
            if (lastDeliveredIndexToShift > -1) {
              lastDeliveredIndexToShift = ix - 1;
              lastDeliveredIndexToShiftIsFixed = true;
            } else {
              preventShiftFromDeliveredToDelivering = true;
            }
          }
        }
      }
    });

    // shift steps from DELIVERED to DELIVERING
    // this is the reason why the pointer to the DELIVERING status is kept, recall that
    if (
      status.status === NotificationStatus.DELIVERED &&
      deliveringStatus &&
      deliveringStatus.steps &&
      !preventShiftFromDeliveredToDelivering &&
      lastDeliveredIndexToShift > -1
    ) {
      const stepsToShift = status.steps.slice(0, lastDeliveredIndexToShift + 1);
      stepsToShift.sort(fromLatestToEarliest);
      deliveringStatus.steps.unshift(...stepsToShift);
      status.steps = status.steps.slice(lastDeliveredIndexToShift + 1);

      status.activeFrom = deliveringStatus.steps[0].timestamp;
    }

    // order step by time, latest first
    status.steps.sort(fromLatestToEarliest);
    if (status.status !== NotificationStatus.ACCEPTED && acceptedStatusItems.length) {
      acceptedStatusItems = [];
    }
    // sets the delivery mode for DELIVERED status
    if (status.status === NotificationStatus.DELIVERED && deliveryMode) {
      status.deliveryMode = deliveryMode;
    }
    // check if there are information about the user that chahnged the status and populate recipient object
    if (status.status === NotificationStatus.VIEWED) {
      const viewedSteps = status.steps.filter(
        (s) => s.category === TimelineCategory.NOTIFICATION_VIEWED
      );
      if (viewedSteps.length) {
        // get last step, that is the first chronologically
        const mostOldViewedStep = viewedSteps[viewedSteps.length - 1];
        if (
          mostOldViewedStep.details &&
          (mostOldViewedStep.details as ViewedDetails).delegateInfo
        ) {
          const { denomination, taxId } = (mostOldViewedStep.details as ViewedDetails)
            .delegateInfo!;
          status.recipient = `${denomination} (${taxId})`;
        }
      }
    }
  }
}

/**
 * Populate other documents array before send notification to fe.
 * @param  {Array<INotificationDetailTimeline>} timeline
 * @returns Array<NotificationDetailDocument>
 */
const populateOtherDocuments = (
  timeline: Array<INotificationDetailTimeline>
): Array<NotificationDetailDocument> => {
  const timelineFiltered = timeline.filter((t) => t.category === TimelineCategory.AAR_GENERATION);
  if (timelineFiltered.length > 0) {
    return timelineFiltered.map((t) => ({
      recIndex: t.details.recIndex,
      documentId: (t.details as AarDetails).generatedAarUrl as string,
      documentType: LegalFactType.AAR,
      title: getLocalizedOrDefaultLabel(
        'notifications',
        'detail.timeline.aar-document',
        'Avviso di avvenuta ricezione'
      ),
      digests: {
        sha256: '',
      },
      ref: {
        key: '',
        versionToken: '',
      },
      contentType: '',
    }));
  }
  return [];
};

/**
 * Populate payment history array before send notification to fe.
 * @param  {Array<INotificationDetailTimeline>} timeline
 * @param  {Array<NotificationDetailRecipient>} recipients
 * @returns Array<NotificationDetailDocument>
 */
const populatePaymentHistory = (
  timeline: Array<INotificationDetailTimeline>,
  recipients: Array<NotificationDetailRecipient>
): Array<PaymentHistory> => {
  const paymentHistory: Array<PaymentHistory> = [];
  // get all timeline steps that have category payment
  const paymentTimelineStep = timeline.filter((t) => t.category === TimelineCategory.PAYMENT);
  // populate payment history array with the informations from timeline and related recipients
  if (paymentTimelineStep.length > 0) {
    for (const payment of paymentTimelineStep) {
      const recIndex = payment.details.recIndex;
      if (recIndex !== null && recIndex !== undefined) {
        const recipient = recipients[recIndex];
        /* eslint-disable-next-line functional/immutable-data */
        paymentHistory.push({
          ...(payment.details as PaidDetails),
          recipientDenomination: recipient.denomination,
          recipientTaxId: recipient.taxId,
        });
      }
    }
  }

  return paymentHistory;
};



function timelineElementMustBeShown(t: INotificationDetailTimeline): boolean {
  if (
    t.category === TimelineCategory.SEND_ANALOG_PROGRESS || 
    t.category === TimelineCategory.SEND_ANALOG_FEEDBACK || 
    t.category === TimelineCategory.SIMPLE_REGISTERED_LETTER_PROGRESS
  ) {
    const deliveryDetailCode = (t.details as SendPaperDetails).deliveryDetailCode;
    return !!deliveryDetailCode && AnalogFlowAllowedCodes.includes(deliveryDetailCode);
  }
  return TimelineAllowedStatus.includes(t.category);
}

export function parseNotificationDetail(
  notificationDetail: NotificationDetail
): NotificationDetail {
  const parsedNotification = {
    ...notificationDetail,
    otherDocuments: populateOtherDocuments(notificationDetail.timeline),
    paymentHistory: populatePaymentHistory(
      notificationDetail.timeline,
      notificationDetail.recipients
    ),
    sentAt: formatDate(notificationDetail.sentAt),
  };
  /* eslint-disable functional/immutable-data */
  /* eslint-disable functional/no-let */
  // set which elements are visible
  parsedNotification.timeline = parsedNotification.timeline.map((t) => ({
    ...t,
    hidden: !timelineElementMustBeShown(t),
  }));
  // populate notification macro steps with corresponding timeline micro steps
  populateMacroSteps(parsedNotification);
  // order elements by date
  parsedNotification.notificationStatusHistory.sort((a, b) => {
    if (new Date(b.activeFrom).getTime() - new Date(a.activeFrom).getTime() >= 0) {
      return 1;
    }
    return -1;
  });
  /* eslint-enable functional/immutable-data */
  /* eslint-enable functional/no-let */
  return parsedNotification;
}
