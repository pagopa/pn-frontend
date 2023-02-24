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
  GetNotificationsParams,
  NotificationStatus,
  NotificationStatusHistory,
} from '../types';
import {
  AarDetails,
  LegalFactType,
  NotificationDetailDocument,
  SendDigitalDetails,
  ViewedDetails,
  SendPaperDetails,
  NotificationDeliveryMode,
  ResponseStatus,
} from '../types/NotificationDetail';
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

  console.log({ status, isMultiRecipient });

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
      data
    ),
    description: getLocalizedOrDefaultLabel(
      'notifications',
      `status.${status}-description${isMultiRecipient ? '-multirecipient' : ''}`,
      defaultDescription,
      data
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
  const statusComesAsAnObject = !!((status as NotificationStatusHistory).status);
  const statusObject: NotificationStatusHistory | undefined = statusComesAsAnObject ? status as NotificationStatusHistory : undefined;
  const actualStatus: NotificationStatus = statusComesAsAnObject ? (status as NotificationStatusHistory).status : (status as NotificationStatus);
  const isMultiRecipient = options && options.recipients.length > 1;

  // the subject is either the recipient or (for the VIEWED and VIEWED_AFTER_DEADLINE)
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
        statusInfos.description =  getLocalizedOrDefaultLabel(
          'notifications',
          'status.delivered-description-with-delivery-mode',
          `La notifica è stata consegnata per via ${deliveryMode === NotificationDeliveryMode.ANALOG ? 'analogica' : 'digitale'}.`,
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
          'Perfezionata per visione',
          `Il ${subject} ha letto la notifica`,
          `Il ${subject} ha letto la notifica entro il termine stabilito`,
          { subject, isMultiRecipient }
        ),
      };
    case NotificationStatus.VIEWED_AFTER_DEADLINE:
      if (statusObject && statusObject.recipient) {
        subject = getLocalizedOrDefaultLabel(
          'notifications',
          `status.delegate`,
          `delegato ${statusObject.recipient}`,
          { name: statusObject.recipient }
        );
      }
      return {
        color: 'success',
        ...localizeStatus(
          'viewed-after-deadline',
          'Visualizzata',
          `Il ${subject} ha visualizzato la notifica`,
          `Il ${subject} ha visualizzato la notifica`,
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
    label: getLocalizedOrDefaultLabel('notifications', 'status.viewed', 'Perfezionata per visione'),
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

/**
 * Get legalFact label based on timeline step and legalfact type.
 * @param {INotificationDetailTimeline} timelineStep Timeline step
 * @param {LegalFactType} legalFactType Legalfact type
 * @returns {string} attestation or receipt
 */
export function getLegalFactLabel(
  timelineStep: INotificationDetailTimeline,
  legalFactType?: LegalFactType
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
  // Carlos Lombardi, 2022.24.02
  if (timelineStep.category === TimelineCategory.SEND_ANALOG_FEEDBACK) {
    if ((timelineStep.details as SendPaperDetails).responseStatus === ResponseStatus.OK) {
      return `${receiptLabel} ${getLocalizedOrDefaultLabel(
        'notifications',
        'detail.timeline.legalfact.paper-receipt-delivered',
        'di consegna raccomandata'
      )}`;
    } else if ((timelineStep.details as SendPaperDetails).responseStatus === ResponseStatus.KO) {
      return `${receiptLabel} ${getLocalizedOrDefaultLabel(
        'notifications',
        'detail.timeline.legalfact.paper-receipt-not-delivered',
        'di mancata consegna raccomandata'
      )}`;
    }
    return receiptLabel;
  // To the moment I could access to no example of a legal fact associated to this
  // kind of events, neither to a documentation which indicates
  // the legalFactType to expect for such events.
  // Hence I keep the condition on the category only.
  // -------------------------
  // Carlos Lombardi, 2022.24.02
  } else if (timelineStep.category === TimelineCategory.SEND_ANALOG_PROGRESS) {
    return `${receiptLabel} ${getLocalizedOrDefaultLabel(
      'notifications',
      'detail.timeline.legalfact.paper-receipt-accepted',
      'di accettazione raccomandata'
    )}`;
  } else if (
    timelineStep.category === TimelineCategory.SEND_DIGITAL_PROGRESS &&
    legalFactType === LegalFactType.PEC_RECEIPT
  ) {
    if (
      (timelineStep.details as SendDigitalDetails).eventCode === 'C001' ||
      (timelineStep.details as SendDigitalDetails).eventCode === 'DP00'
    ) {
      return `${receiptLabel} ${getLocalizedOrDefaultLabel(
        'notifications',
        'detail.timeline.legalfact.pec-receipt-accepted',
        'di accettazione PEC'
      )}`;
    } else if (
      (timelineStep.details as SendDigitalDetails).eventCode === 'C008' ||
      (timelineStep.details as SendDigitalDetails).eventCode === 'C010' ||
      (timelineStep.details as SendDigitalDetails).eventCode === 'DP10'
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

    // this case is not needed, since the only legal fact arriving currently
    // regards the event type SEND_ANALOG_FEEDBACK
    // which is handled separately.
    // I prefer to keep it commented out, since the situation is not completely clear.
    // -------------------------
    // Carlos Lombardi, 2022.24.02
    // -------------------------
  // } else if (legalFactType === LegalFactType.ANALOG_DELIVERY) {
  //   return `${legalFactLabel}: ${getLocalizedOrDefaultLabel(
  //     'notifications',
  //     'detail.timeline.legalfact.analog-delivery',
  //     'conformità'
  //   )}`;
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
  recipients: Array<NotificationDetailRecipient>
): TimelineStepInfo | null {
  const recipient = !_.isNil(step.details.recIndex) ? recipients[step.details.recIndex] : undefined;
  const recipientLabel = `${recipient?.taxId} - ${recipient?.denomination}`;

  return TimelineStepFactory.createTimelineStep(step).getTimelineStepInfo({
    step,
    recipient,
    recipientLabel,
    isMultiRecipient: recipients.length > 1
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
];

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
  let isEffectiveDateStatus = false;
  let acceptedStatusItems: Array<string> = [];
  let deliveryMode: NotificationDeliveryMode | undefined;
  let deliveringStatus: NotificationStatusHistory | undefined;
  /* eslint-enable functional/no-let */

  /* eslint-disable functional/no-let */
  let lastDeliveredIndexToShift = -1;
  let lastDeliveredIndexToShiftIsFixed = false;
  let preventShiftFromDeliveredToDelivering = false;
  /* eslint-enable functional/no-let */

  const statusesToRemove: Array<NotificationStatus> = [];

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
      const step = populateMacroStep(parsedNotification, timelineElement, status, acceptedStatusItems);
      if (step) {
        // delivery mode: according to the first arrived 
        // between DIGITAL_SUCCESS_WORKFLOW and SEND_SIMPLE_REGISTERED_LETTER
        if (step.category === TimelineCategory.DIGITAL_SUCCESS_WORKFLOW && !deliveryMode) {
          deliveryMode = NotificationDeliveryMode.DIGITAL;
        } else if (step.category === TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER && !deliveryMode) {
          deliveryMode = NotificationDeliveryMode.ANALOG;
        } 

        // // if a DIGITAL_SUCCESS_WORKFLOW event is found in the DELIVERING status
        // // (since as of 2023.02.13 the jump from DELIVERING to DELIVERED could not be related to the *first* digital shipment resolution)
        // // then no shift is performed from DELIVERED to DELIVERING
        // // ... I prefer to still shift events up to the first DIGITAL_SUCCESS_WORKFLOW found in DELIVERED status ...
        // // keep the code just in case
        // if (status.status === NotificationStatus.DELIVERING && step.category === TimelineCategory.DIGITAL_SUCCESS_WORKFLOW) {
        //   preventShiftFromDeliveredToDelivering = true;
        // }

        // record the last timeline event from DELIVERED that must be shifted to DELIVERING
        // the rules: 
        // - up to the last DIGITAL_FAILURE_WORKFLOW or SEND_SIMPLE_REGISTERED_LETTER element,
        // - or the first DIGITAL_SUCCESS_WORKFLOW afterwards a DIGITAL_FAILURE_WORKFLOW or SEND_SIMPLE_REGISTERED_LETTER 
        //   (in this case, excluding it)
        // if a DIGITAL_SUCCESS_WORKFLOW is found before a DIGITAL_FAILURE_WORKFLOW or SEND_SIMPLE_REGISTERED_LETTER
        // then no shift has to be done
        if (status.status === NotificationStatus.DELIVERED && !preventShiftFromDeliveredToDelivering) {
          if ((step.category === TimelineCategory.DIGITAL_FAILURE_WORKFLOW 
              || step.category === TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER) && !lastDeliveredIndexToShiftIsFixed)
          {
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
    if (status.status === NotificationStatus.DELIVERED && deliveringStatus && deliveringStatus.steps
        && !preventShiftFromDeliveredToDelivering && lastDeliveredIndexToShift > -1 
    ) {
      const stepsToShift = status.steps.slice(0, lastDeliveredIndexToShift+1);
      stepsToShift.sort(fromLatestToEarliest);
      deliveringStatus.steps.unshift(...stepsToShift);
      status.steps = status.steps.slice(lastDeliveredIndexToShift+1);

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
      } else {
        // (a quite subtle detail)
        // if the logged user has no NOTIFICATION_VIEWED events related to the VIEWED state,
        // this means that:
        // 1. this is a multirecipient notification, and
        // 2. this particular recipient has not yet viewed the notification, i.e. other recipients
        //    have viewed the notification but not the currently logged one.
        // In this situation, the specification indicates that
        // - if at least one recipient has seen the notification before the earliest view deadline 
        //   (i.e. the notification never passed through the EFFECTIVE_DATE state)
        //   then the VIEWED state is shown without legal fact 
        //   (since there is no legal fact concerning the logged user)
        // - otherwise, i.e. if the notification passed through the EFFECTIVE_DATE state 
        //   before having reached the VIEWED state, 
        //   then the VIEWED_AFTER_DEADLINE should *not* be rendered for the current user,
        // I implement this in a rather tricky way, indicating that if the VIEWED status 
        // is transformed into VIEWED_AFTER_DEADLINE, then it must be removed after the 
        // status cycle.
        // -----------------------------------------
        // Carlos Lombardi, 2023.02.23  
        // -----------------------------------------
        statusesToRemove.push(NotificationStatus.VIEWED_AFTER_DEADLINE);
      }
    }
    // change status if current is VIEWED and before there is a status EFFECTIVE_DATE
    if (status.status === NotificationStatus.EFFECTIVE_DATE) {
      isEffectiveDateStatus = true;
    }
    if (status.status === NotificationStatus.VIEWED && isEffectiveDateStatus) {
      status.status = NotificationStatus.VIEWED_AFTER_DEADLINE;
    }
  }

  // now we are after the loop over the statuses
  // maybe some statuses are to be removed
  // at the moment, the only case is the VIEWED_AFTER_DEADLINE for recipients who 
  // haven't yet viewed the notification (cfr. the huge comment right above)
  parsedNotification.notificationStatusHistory = parsedNotification.notificationStatusHistory.filter(
    status => !statusesToRemove.includes(status.status)
  );
}

/**
 * Parse notification detail repsonse before sent it to fe.
 * @param  {NotificationDetail} notificationDetail
 * @returns NotificationDetail
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

export function parseNotificationDetail(
  notificationDetail: NotificationDetail
): NotificationDetail {
  const parsedNotification = {
    ...notificationDetail,
    otherDocuments: populateOtherDocuments(notificationDetail.timeline),
    sentAt: formatDate(notificationDetail.sentAt),
  };
  /* eslint-disable functional/immutable-data */
  /* eslint-disable functional/no-let */
  // set which elements are visible
  parsedNotification.timeline = parsedNotification.timeline.map((t) => ({
    ...t,
    hidden: !TimelineAllowedStatus.includes(t.category),
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
  // Non dovrebbe essere necessario perchè l'oggetto timeline non viene usato nel layer di presentazione.
  /*
  parsedNotification.timeline.sort((a, b) => {
    if (new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime() >= 0) {
      return 1;
    }
    return -1;
  });
  */
  /* eslint-enable functional/immutable-data */
  /* eslint-enable functional/no-let */
  return parsedNotification;
}

/**
 * Returns the number of filters applied
 * @param  prevFilters GetNotificationsParams
 * @param  emptyValues GetNotificationsParams
 * @returns number
 */
export function filtersApplied(
  prevFilters: GetNotificationsParams,
  emptyValues: GetNotificationsParams
): number {
  return Object.entries(prevFilters).reduce((c: number, element: [string, any]) => {
    if (element[0] in emptyValues && element[1] !== (emptyValues as any)[element[0]]) {
      return c + 1;
    }
    return c;
  }, 0);
}
