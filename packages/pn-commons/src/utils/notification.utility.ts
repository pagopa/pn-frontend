import _ from 'lodash';
import { formatDate } from '../services/date.service';
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
  DigitalDetails,
  AnalogDetails,
} from '../types/NotificationDetail';
import { GetNotificationsParams } from '../types/Notifications';
import { NotificationStatus } from '../types/NotificationStatus';

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
        label: 'Consegnata',
        tooltip: 'La notifica è stata consegnata',
        description: 'La notifica è stata consegnata',
      };
    case NotificationStatus.DELIVERING:
      return {
        color: 'default',
        label: 'Invio in corso',
        tooltip: "L'invio della notifica è in corso",
        description: "L'invio della notifica è in corso",
      };
    case NotificationStatus.UNREACHABLE:
      return {
        color: 'error',
        label: 'Destinatario irreperibile',
        tooltip: 'Il destinatario non è reperibile',
        description: 'Il destinatario non è reperibile',
      };
    case NotificationStatus.PAID:
      return {
        color: 'success',
        label: 'Pagata',
        tooltip: 'Il destinatario ha pagato i costi della notifica',
        description: 'Il destinatario ha pagato i costi della notifica',
      };
    case NotificationStatus.ACCEPTED:
      return {
        color: 'default',
        label: 'Depositata',
        tooltip: "L'ente ha depositato la notifica",
        description: "L'ente ha depositato la notifica",
      };
    case NotificationStatus.EFFECTIVE_DATE:
      return {
        color: 'info',
        label: 'Perfezionata per decorrenza termini',
        tooltip: 'Il destinatario non ha letto la notifica',
        description: 'Il destinatario non ha letto la notifica entro il termine stabilito',
      };
    case NotificationStatus.VIEWED:
      return {
        color: 'info',
        label: 'Perfezionata per visione',
        tooltip: 'Il destinatario ha letto la notifica',
        description: 'Il destinatario ha letto la notifica entro il termine stabilito',
      };
    case NotificationStatus.VIEWED_AFTER_DEADLINE:
      return {
        color: 'success',
        label: 'Visualizzata',
        tooltip: 'Il destinatario ha visualizzato la notifica',
        description: 'Il destinatario ha visualizzato la notifica',
      };
    case NotificationStatus.CANCELED:
      return {
        color: 'warning',
        label: 'Annullata',
        tooltip: "L'ente ha annullato l'invio della notifica",
        description: "L'ente ha annullato l'invio della notifica",
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

export const NotificationAllowedStatus = [
  { value: 'All', label: 'Tutti gli stati' },
  { value: NotificationStatus.ACCEPTED, label: 'Depositata' },
  { value: NotificationStatus.DELIVERED, label: 'Consegnata' },
  { value: NotificationStatus.DELIVERING, label: 'In inoltro' },
  { value: NotificationStatus.EFFECTIVE_DATE, label: 'Perfezionata per decorrenza termini' },
  { value: NotificationStatus.VIEWED, label: 'Perfezionata per visione' },
  { value: NotificationStatus.PAID, label: 'Pagata' },
  { value: NotificationStatus.CANCELED, label: 'Annullata' },
  { value: NotificationStatus.UNREACHABLE, label: 'Destinatario irreperibile' },
];

function getRecipientByAddress(
  step: INotificationDetailTimeline,
  ricipients: Array<NotificationDetailRecipient>
): NotificationDetailRecipient | undefined {
  return ricipients.find((r) => {
    if (r.digitalDomicile && (step.details as DigitalDetails).digitalAddress) {
      return _.isEqual(r.digitalDomicile, (step.details as DigitalDetails).digitalAddress);
    } else if (r.physicalAddress && (step.details as AnalogDetails).physicalAddress) {
      return _.isEqual(r.physicalAddress, (step.details as AnalogDetails).physicalAddress);
    }
    return false;
  });
}

/**
 * Returns the mapping between current notification timeline status and its label and descriptive message.
 * @param  {TimelineCategory} status
 * @returns object
 */
export function getNotificationTimelineStatusInfos(
  step: INotificationDetailTimeline,
  ricipients: Array<NotificationDetailRecipient>
): {
  label: string;
  description: string;
  linkText?: string;
  recipient?: string;
} | null {
  const recipient = getRecipientByAddress(step, ricipients);
  switch (step.category) {
    case TimelineCategory.SCHEDULE_ANALOG_WORKFLOW:
      return {
        label: 'Invio per via cartacea',
        description: "È in corso l'invio della notifica per via cartacea.",
        linkText: 'Attestazione opponibile a terzi',
        recipient: `${recipient?.taxId} - ${recipient?.denomination}`,
      };
    case TimelineCategory.SCHEDULE_DIGITAL_WORKFLOW:
      return {
        label: 'Invio per via digitale',
        description: "È in corso l'invio della notifica per via digitale.",
        linkText: 'Attestazione opponibile a terzi',
        recipient: `${recipient?.taxId} - ${recipient?.denomination}`,
      };
    case TimelineCategory.SEND_COURTESY_MESSAGE:
      const type =
        (step.details as SendCourtesyMessageDetails).digitalAddress.type ===
        DigitalDomicileType.EMAIL
          ? 'email'
          : 'sms';
      return {
        label: 'Invio del messaggio di cortesia',
        description: `È in corso l'invio del messaggio di cortesia a ${recipient?.denomination} tramite ${type}`,
        recipient: `${recipient?.taxId} - ${recipient?.denomination}`,
      };
    case TimelineCategory.SEND_DIGITAL_DOMICILE:
      if (!(step.details as SendDigitalDetails).digitalAddress?.address) {
        // if digital domicile is undefined
        return null;
      }
      return {
        label: 'Invio via PEC',
        description: `È in corso l'invio della notifica a ${
          recipient?.denomination
        } all'indirizzo PEC ${(step.details as SendDigitalDetails).digitalAddress?.address}`,
        recipient: `${recipient?.taxId} - ${recipient?.denomination}`,
      };
    case TimelineCategory.SEND_DIGITAL_DOMICILE_FEEDBACK:
      const digitalDomicileFeedbackErrors = (step.details as SendDigitalDetails).errors;
      if (digitalDomicileFeedbackErrors && digitalDomicileFeedbackErrors.length > 0) {
        return {
          label: 'Invio via PEC fallito',
          description: `L'invio della notifica a ${recipient?.denomination} all'indirizzo PEC ${
            (step.details as SendDigitalDetails).digitalAddress?.address
          } non è riuscito.`,
          linkText: 'Attestazione opponibile a terzi',
          recipient: `${recipient?.taxId} - ${recipient?.denomination}`,
        };
      }
      return {
        label: 'Invio via PEC riuscito',
        description: `L' invio della notifica a ${recipient?.denomination} all'indirizzo PEC ${
          (step.details as SendDigitalDetails).digitalAddress?.address
        } è riuscito.`,
        linkText: 'Attestazione opponibile a terzi',
        recipient: `${recipient?.taxId} - ${recipient?.denomination}`,
      };
    case TimelineCategory.SEND_DIGITAL_FEEDBACK:
      const digitalFeedbackErrors = (step.details as SendDigitalDetails).errors;
      if (digitalFeedbackErrors && digitalFeedbackErrors.length > 0) {
        return {
          label: 'Invio per via digitale fallito',
          description: `L'invio della notifica a ${recipient?.denomination} per via digitale non è riuscito.`,
          linkText: 'Attestazione opponibile a terzi',
          recipient: `${recipient?.taxId} - ${recipient?.denomination}`,
        };
      }
      return {
        label: 'Invio per via digitale riuscito',
        description: `L'invio della notifica a ${recipient?.denomination} per via digitale è riuscito.`,
        linkText: 'Attestazione opponibile a terzi',
        recipient: `${recipient?.taxId} - ${recipient?.denomination}`,
      };
    case TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER:
      return {
        label: 'Invio via raccomandata semplice',
        description: `È in corso l'invio della notifica a ${
          recipient?.denomination
        } all'indirizzo ${
          (step.details as AnalogWorkflowDetails).physicalAddress?.address
        } tramite raccomandata semplice.`,
        linkText: 'Attestazione opponibile a terzi',
        recipient: `${recipient?.taxId} - ${recipient?.denomination}`,
      };
    case TimelineCategory.SEND_ANALOG_DOMICILE:
      if (
        (step.details as SendPaperDetails).serviceLevel ===
        PhysicalCommunicationType.REGISTERED_LETTER_890
      ) {
        return {
          label: 'Invio via raccomandata 890',
          description: `È in corso l'invio della notifica a ${
            recipient?.denomination
          } all'indirizzo ${
            (step.details as AnalogWorkflowDetails).physicalAddress?.address
          } tramite raccomandata 890.`,
          linkText: 'Vedi la ricevuta',
          recipient: `${recipient?.taxId} - ${recipient?.denomination}`,
        };
      }
      return {
        label: 'Invio via raccomandata A/R',
        description: `È in corso l'invio della notifica a ${
          recipient?.denomination
        } all'indirizzo ${
          (step.details as AnalogWorkflowDetails).physicalAddress?.address
        } tramite raccomandata A/R.`,
        linkText: 'Vedi la ricevuta',
        recipient: `${recipient?.taxId} - ${recipient?.denomination}`,
      };
    case TimelineCategory.SEND_PAPER_FEEDBACK:
      return {
        label: 'Aggiornamento stato raccomandata',
        description: `Si allega un aggiornamento dello stato della raccomandata.`,
        linkText: 'Vedi la ricevuta',
        recipient: `${recipient?.taxId} - ${recipient?.denomination}`,
      };
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
    documentsAvailable: notificationDetail.documentsAvailable
      ? notificationDetail.documentsAvailable
      : true,
  };
  /* eslint-disable functional/immutable-data */
  /* eslint-disable functional/no-let */
  // set which elements are visible
  parsedNotification.timeline = parsedNotification.timeline.map((t) => ({
    ...t,
    hidden: !TimelineAllowedStatus.includes(t.category),
  }));
  let isEffectiveDateStatus = false;
  // populate notification macro step with corresponding timeline micro steps
  for (const status of parsedNotification.notificationStatusHistory) {
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
 * @param  {NotificationDetail} notificationDetail
 * @returns NotificationDetail
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
 * @param  {preFilters} GetNotificationsParams
 * @param  {emptyValues} GetNotificationsParams
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
