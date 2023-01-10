/* eslint-disable functional/immutable-data */
import _ from 'lodash';

import { formatDate } from '../services';
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
import { AarDetails, LegalFactType, NotificationDetailOtherDocument, SendDigitalDetails } from '../types/NotificationDetail';
import { TimelineStepInfo } from './TimelineUtils/TimelineStep';
import { TimelineStepFactory } from './TimelineUtils/TimelineStepFactory';

function localizeStatus(
  status: string,
  defaultLabel: string,
  defaultTooltip: string,
  defaultDescription: string
): {
  label: string;
  tooltip: string;
  description: string;
} {
  return {
    label: getLocalizedOrDefaultLabel('notifications', `status.${status}`, defaultLabel),
    tooltip: getLocalizedOrDefaultLabel(
      'notifications',
      `status.${status}-tooltip`,
      defaultTooltip
    ),
    description: getLocalizedOrDefaultLabel(
      'notifications',
      `status.${status}-description`,
      defaultDescription
    ),
  };
}

/**
 * Returns the mapping between current notification status and its color, label and descriptive message.
 * @param  {NotificationStatus} status
 * @returns object
 */
export function getNotificationStatusInfos(status: NotificationStatus): {
  color: 'warning' | 'error' | 'success' | 'info' | 'default' | 'primary' | 'secondary' | undefined;
  label: string;
  tooltip: string;
  description: string;
} {
  switch (status) {
    case NotificationStatus.DELIVERED:
      return {
        color: 'default',
        ...localizeStatus(
          'delivered',
          'Consegnata',
          'La notifica è stata consegnata',
          'La notifica è stata consegnata'
        ),
      };
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
          'Il destinatario non è reperibile'
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
          'Il destinatario non ha letto la notifica entro il termine stabilito'
        ),
      };
    case NotificationStatus.VIEWED:
      return {
        color: 'info',
        ...localizeStatus(
          'viewed',
          'Perfezionata per visione',
          'Il destinatario ha letto la notifica',
          'Il destinatario ha letto la notifica entro il termine stabilito'
        ),
      };
    case NotificationStatus.VIEWED_AFTER_DEADLINE:
      return {
        color: 'success',
        ...localizeStatus(
          'viewed-after-deadline',
          'Visualizzata',
          'Il destinatario ha visualizzato la notifica',
          'Il destinatario ha visualizzato la notifica'
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
    value: NotificationStatus.PAID,
    label: getLocalizedOrDefaultLabel('notifications', 'status.paid', 'Pagata'),
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
  if (timelineStep.category === TimelineCategory.SEND_PAPER_FEEDBACK) {
    return receiptLabel;
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
      (timelineStep.details as SendDigitalDetails).eventCode === 'C010'
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
  } else if (legalFactType === LegalFactType.ANALOG_DELIVERY) {
    return `${legalFactLabel}: ${getLocalizedOrDefaultLabel(
      'notifications',
      'detail.timeline.legalfact.analog-delivery',
      'conformità'
    )}`;
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
  recipients: Array<NotificationDetailRecipient>
): TimelineStepInfo | null {
  const recipient = !_.isNil(step.details.recIndex) ? recipients[step.details.recIndex] : undefined;
  const recipientLabel = `${recipient?.taxId} - ${recipient?.denomination}`;

  return TimelineStepFactory.createTimelineStep(step).getTimelineStepInfo({
    step,
    recipient,
    recipientLabel,
  });
}

const TimelineAllowedStatus = [
  TimelineCategory.SCHEDULE_ANALOG_WORKFLOW,
  TimelineCategory.SCHEDULE_DIGITAL_WORKFLOW,
  TimelineCategory.SEND_DIGITAL_DOMICILE,
  TimelineCategory.SEND_DIGITAL_DOMICILE_FEEDBACK,
  TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER,
  TimelineCategory.SEND_ANALOG_DOMICILE,
  TimelineCategory.SEND_DIGITAL_FEEDBACK,
  TimelineCategory.SEND_DIGITAL_PROGRESS,
  TimelineCategory.SEND_PAPER_FEEDBACK,
  TimelineCategory.DIGITAL_FAILURE_WORKFLOW,
  // PN-2068
  TimelineCategory.SEND_COURTESY_MESSAGE,
  // PN-1647
  TimelineCategory.NOT_HANDLED,
];

/**
 * Populate timeline macro steps
 * @param  {NotificationDetail} parsedNotification
 * @param  {string} timelineElement
 * @param  {NotificationStatusHistory} status
 * @param  {Array<string>} acceptedStatusItems
 */
function populateMacroStep(
  parsedNotification: NotificationDetail,
  timelineElement: string,
  status: NotificationStatusHistory,
  acceptedStatusItems: Array<string>
) {
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
}

/**
 * Populate timeline macro steps
 * @param  {NotificationDetail} parsedNotification
 */
function populateMacroSteps(parsedNotification: NotificationDetail) {
  let isEffectiveDateStatus = false;
  let acceptedStatusItems: Array<string> = [];
  for (const status of parsedNotification.notificationStatusHistory) {
    // if status accepted has items, move them to the next state, but preserve legalfacts
    if (status.status === NotificationStatus.ACCEPTED && status.relatedTimelineElements.length) {
      acceptedStatusItems = status.relatedTimelineElements;
    } else if (acceptedStatusItems.length) {
      status.relatedTimelineElements.unshift(...acceptedStatusItems);
    }
    status.steps = [];
    // find timeline steps that are linked with current status
    for (const timelineElement of status.relatedTimelineElements) {
      populateMacroStep(parsedNotification, timelineElement, status, acceptedStatusItems);
    }
    // order step by time
    status.steps.sort((a, b) => {
      if (new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime() >= 0) {
        return 1;
      }
      return -1;
    });
    if (status.status !== NotificationStatus.ACCEPTED && acceptedStatusItems.length) {
      acceptedStatusItems = [];
    }
    // change status if current is VIEWED and before there is a status EFFECTIVE_DATE
    if (status.status === NotificationStatus.EFFECTIVE_DATE) {
      isEffectiveDateStatus = true;
    }
    if (status.status === NotificationStatus.VIEWED && isEffectiveDateStatus) {
      status.status = NotificationStatus.VIEWED_AFTER_DEADLINE;
    }
  }
}

/**
 * Parse notification detail repsonse before sent it to fe.
 * @param  {NotificationDetail} notificationDetail
 * @returns NotificationDetail
 */
const populateOtherDocuments = (timeline: Array<INotificationDetailTimeline>): Array<NotificationDetailOtherDocument> => {
  const timelineFiltered = timeline.filter(t => t.category === TimelineCategory.AAR_GENERATION);
  if (timelineFiltered.length>0) {
    return timelineFiltered.map(t => ({
      documentId: (t.details as AarDetails).generatedAarUrl as string,
      documentType: LegalFactType.AAR,
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
