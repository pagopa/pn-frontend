import _ from 'lodash';

import { formatDate } from '../services';
import { getLocalizedOrDefaultLabel } from '../services/localization.service';
import {
  INotificationDetailTimeline,
  SendCourtesyMessageDetails,
  SendDigitalDetails,
  AnalogWorkflowDetails,
  TimelineCategory,
  PhysicalCommunicationType,
  SendPaperDetails,
  NotificationDetailRecipient,
  DigitalDomicileType,
  NotificationDetail,
  NotHandledDetails,
  GetNotificationsParams,
  NotificationStatus,
} from '../types';

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

export const NotificationAllowedStatus = () => [
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

function localizeTimelineStatus(
  category: string,
  defaultLabel: string,
  defaultDescription: string,
  data?: { [key: string]: string | undefined }
): { label: string; description: string } {
  return {
    label: getLocalizedOrDefaultLabel('notifications', `detail.timeline.${category}`, defaultLabel),
    description: getLocalizedOrDefaultLabel(
      'notifications',
      `detail.timeline.${category}-description`,
      defaultDescription,
      data
    ),
  };
}

/**
 * Returns the mapping between current notification timeline status and its label and descriptive message.
 * @param  {INotificationDetailTimeline} step
 * @param {Array<NotificationDetailRecipient>} recipients
 * @returns object
 */
export function getNotificationTimelineStatusInfos(
  step: INotificationDetailTimeline,
  recipients: Array<NotificationDetailRecipient>
): {
  label: string;
  description: string;
  linkText?: string;
  recipient?: string;
} | null {
  const recipient = !_.isNil(step.details.recIndex) ? recipients[step.details.recIndex] : undefined;
  const legalFactLabel = getLocalizedOrDefaultLabel(
    'notifications',
    `detail.legalfact`,
    'Attestazione opponibile a terzi'
  );
  const receiptLabel = getLocalizedOrDefaultLabel(
    'notifications',
    `detail.timeline.view-receipt`,
    'Vedi la ricevuta'
  );
  const recipientLabel = `${recipient?.taxId} - ${recipient?.denomination}`;

  switch (step.category) {
    case TimelineCategory.SCHEDULE_ANALOG_WORKFLOW:
      return {
        ...localizeTimelineStatus(
          'schedule-analog-workflow',
          'Invio per via cartacea',
          "È in corso l'invio della notifica per via cartacea."
        ),
        linkText: legalFactLabel,
        recipient: recipientLabel,
      };
    case TimelineCategory.SCHEDULE_DIGITAL_WORKFLOW:
      return {
        ...localizeTimelineStatus(
          'schedule-digital-workflow',
          'Invio per via digitale',
          "È in corso l'invio della notifica per via digitale."
        ),
        linkText: legalFactLabel,
        recipient: recipientLabel,
      };
    case TimelineCategory.SEND_COURTESY_MESSAGE:
      const type =
        (step.details as SendCourtesyMessageDetails).digitalAddress.type ===
        DigitalDomicileType.EMAIL
          ? 'email'
          : 'sms';
      return {
        ...localizeTimelineStatus(
          'send-courtesy-message',
          'Invio del messaggio di cortesia',
          `È in corso l'invio del messaggio di cortesia a ${recipient?.denomination} tramite ${type}`,
          {
            name: recipient?.denomination,
            type,
          }
        ),
        recipient: recipientLabel,
      };
    case TimelineCategory.SEND_DIGITAL_DOMICILE:
      if (!(step.details as SendDigitalDetails).digitalAddress?.address) {
        // if digital domicile is undefined
        return null;
      }
      return {
        ...localizeTimelineStatus(
          'send-digital-domicile',
          'Invio via PEC',
          `È in corso l'invio della notifica a ${recipient?.denomination} all'indirizzo PEC ${
            (step.details as SendDigitalDetails).digitalAddress?.address
          }`,
          {
            name: recipient?.denomination,
            address: (step.details as SendDigitalDetails).digitalAddress?.address,
          }
        ),
        recipient: recipientLabel,
      };
    case TimelineCategory.SEND_DIGITAL_DOMICILE_FEEDBACK:
      const digitalDomicileFeedbackErrors = (step.details as SendDigitalDetails).errors;
      if (digitalDomicileFeedbackErrors && digitalDomicileFeedbackErrors.length > 0) {
        return {
          ...localizeTimelineStatus(
            'send-digital-domicile-error',
            'Invio via PEC fallito',
            `L'invio della notifica a ${recipient?.denomination} all'indirizzo PEC ${
              (step.details as SendDigitalDetails).digitalAddress?.address
            } non è riuscito.`,
            {
              name: recipient?.denomination,
              address: (step.details as SendDigitalDetails).digitalAddress?.address,
            }
          ),
          linkText: legalFactLabel,
          recipient: recipientLabel,
        };
      }
      return {
        ...localizeTimelineStatus(
          'send-digital-domicile-success',
          'Invio via PEC riuscito',
          `L' invio della notifica a ${recipient?.denomination} all'indirizzo PEC ${
            (step.details as SendDigitalDetails).digitalAddress?.address
          } è riuscito.`,
          {
            name: recipient?.denomination,
            address: (step.details as SendDigitalDetails).digitalAddress?.address,
          }
        ),
        linkText: legalFactLabel,
        recipient: recipientLabel,
      };
    case TimelineCategory.SEND_DIGITAL_FEEDBACK:
      const digitalFeedbackErrors = (step.details as SendDigitalDetails).errors;
      if (digitalFeedbackErrors && digitalFeedbackErrors.length > 0) {
        return {
          ...localizeTimelineStatus(
            'send-digital-error',
            'Invio per via digitale fallito',
            `L'invio della notifica a ${recipient?.denomination} per via digitale non è riuscito.`,
            {
              name: recipient?.denomination,
            }
          ),
          linkText: legalFactLabel,
          recipient: recipientLabel,
        };
      }
      return {
        ...localizeTimelineStatus(
          'send-digital-success',
          'Invio per via digitale riuscito',
          `L'invio della notifica a ${recipient?.denomination} per via digitale è riuscito.`,
          {
            name: recipient?.denomination,
          }
        ),
        linkText: legalFactLabel,
        recipient: recipientLabel,
      };
    case TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER:
      return {
        ...localizeTimelineStatus(
          'send-simple-registered-letter',
          'Invio via raccomandata semplice',
          `È in corso l'invio della notifica a ${recipient?.denomination} all'indirizzo ${
            (step.details as AnalogWorkflowDetails).physicalAddress?.address
          } tramite raccomandata semplice.`,
          {
            name: recipient?.denomination,
            address: (step.details as AnalogWorkflowDetails).physicalAddress?.address,
          }
        ),
        linkText: legalFactLabel,
        recipient: recipientLabel,
      };
    case TimelineCategory.SEND_ANALOG_DOMICILE:
      if (
        (step.details as SendPaperDetails).serviceLevel ===
        PhysicalCommunicationType.REGISTERED_LETTER_890
      ) {
        return {
          ...localizeTimelineStatus(
            'send-analog-domicile-890',
            'Invio via raccomandata 890',
            `È in corso l'invio della notifica a ${recipient?.denomination} all'indirizzo ${
              (step.details as AnalogWorkflowDetails).physicalAddress?.address
            } tramite raccomandata 890.`,
            {
              name: recipient?.denomination,
              address: (step.details as AnalogWorkflowDetails).physicalAddress?.address,
            }
          ),
          linkText: receiptLabel,
          recipient: recipientLabel,
        };
      }
      return {
        ...localizeTimelineStatus(
          'send-analog-domicile-ar',
          'Invio via raccomandata A/R',
          `È in corso l'invio della notifica a ${recipient?.denomination} all'indirizzo ${
            (step.details as AnalogWorkflowDetails).physicalAddress?.address
          } tramite raccomandata A/R.`,
          {
            name: recipient?.denomination,
            address: (step.details as AnalogWorkflowDetails).physicalAddress?.address,
          }
        ),
        linkText: receiptLabel,
        recipient: recipientLabel,
      };
    case TimelineCategory.SEND_PAPER_FEEDBACK:
      return {
        ...localizeTimelineStatus(
          'send-paper-feedback',
          'Aggiornamento stato raccomandata',
          `Si allega un aggiornamento dello stato della raccomandata.`,
          {
            name: recipient?.denomination,
          }
        ),
        linkText: receiptLabel,
        recipient: `${recipient?.taxId} - ${recipient?.denomination}`,
      };
    // PN-1647
    case TimelineCategory.NOT_HANDLED:
      if (
        (step.details as NotHandledDetails).reasonCode === '001' &&
        (step.details as NotHandledDetails).reason === 'Paper message not handled'
      ) {
        return {
          label: 'Annullata',
          description: `La notifica è stata inviata per via cartacea, dopo un tentativo di invio per via digitale durante il collaudo della piattaforma.`,
        };
      }
      return null;
    default:
      return {
        label: 'Non definito',
        description: 'Stato sconosciuto',
      };
  }
}

const TimelineAllowedStatus = [
  TimelineCategory.SCHEDULE_ANALOG_WORKFLOW,
  TimelineCategory.SCHEDULE_DIGITAL_WORKFLOW,
  TimelineCategory.SEND_DIGITAL_DOMICILE,
  TimelineCategory.SEND_DIGITAL_DOMICILE_FEEDBACK,
  TimelineCategory.SEND_DIGITAL_FEEDBACK,
  TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER,
  TimelineCategory.SEND_ANALOG_DOMICILE,
  TimelineCategory.SEND_PAPER_FEEDBACK,
  // PN-1647
  TimelineCategory.NOT_HANDLED,
];

/**
 * Parse notification detail repsonse before sent it to fe.
 * @param  {NotificationDetail} notificationDetail
 * @returns NotificationDetail
 */
export function parseNotificationDetail(
  notificationDetail: NotificationDetail
): NotificationDetail {
  const parsedNotification = {
    ...notificationDetail,
    sentAt: formatDate(notificationDetail.sentAt),
  };
  /* eslint-disable functional/immutable-data */
  /* eslint-disable functional/no-let */
  // set which elements are visible
  parsedNotification.timeline = parsedNotification.timeline.map((t) => ({
    ...t,
    hidden: !TimelineAllowedStatus.includes(t.category),
  }));
  let isEffectiveDateStatus = false;
  let acceptedStatusItems: Array<string> = [];
  // populate notification macro step with corresponding timeline micro steps
  for (const status of parsedNotification.notificationStatusHistory) {
    // if status accepted has items, move them to the next state
    if (status.status === NotificationStatus.ACCEPTED && status.relatedTimelineElements.length) {
      acceptedStatusItems = status.relatedTimelineElements;
      status.relatedTimelineElements = [];
    } else if (acceptedStatusItems.length) {
      status.relatedTimelineElements.unshift(...acceptedStatusItems);
      acceptedStatusItems = [];
    }
    status.steps = [];
    // find timeline steps that are linked with current status
    for (const timelineElement of status.relatedTimelineElements) {
      const step = parsedNotification.timeline.find((t) => t.elementId === timelineElement);
      if (step) {
        status.steps.push(step);
      }
    }
    // order step by time
    status.steps.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    // change status if current is VIEWED and before there is a status EFFECTIVE_DATE
    if (status.status === NotificationStatus.EFFECTIVE_DATE) {
      isEffectiveDateStatus = true;
    }
    if (status.status === NotificationStatus.VIEWED && isEffectiveDateStatus) {
      status.status = NotificationStatus.VIEWED_AFTER_DEADLINE;
    }
  }
  // order elements by date
  parsedNotification.notificationStatusHistory.sort(
    (a, b) => new Date(b.activeFrom).getTime() - new Date(a.activeFrom).getTime()
  );
  parsedNotification.timeline.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  /* eslint-enable functional/immutable-data */
  /* eslint-enable functional/no-let */
  return parsedNotification;
}

/**
 * Get legalFact label based on timeline category.
 * @param {TimelineCategory} category Timeline category
 * @param {attestation: string; receipt: string} legalFactLabels Attestation and Receipt
 * @returns {string} attestation or receipt
 */
export function getLegalFactLabel(
  category: TimelineCategory,
  legalFactLabels: { attestation: string; receipt: string }
): string {
  if (category === TimelineCategory.SEND_PAPER_FEEDBACK) {
    return legalFactLabels.receipt;
  }
  return legalFactLabels.attestation;
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
