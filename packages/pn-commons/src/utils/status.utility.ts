import {
  DeliveryMode,
  INotificationDetailTimeline,
  NotificationPathChooseDetails,
  SendCourtesyMessageDetails,
  SendDigitalDetails,
  AnalogWorkflowDetails,
  TimelineCategory,
  PhysicalCommunicationType,
  SendPaperDetails,
  NotificationDetailRecipient,
  DigitalDomicileType,
} from './../types/NotificationDetail';
import { NotificationStatus } from '../types/NotificationStatus';

/**
 * Returns the mapping between current notification status and its color, label and descriptive message.
 * @param  {NotificationStatus} status
 * @returns string
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

export const TimelineAllowedStatus = [
  TimelineCategory.NOTIFICATION_PATH_CHOOSE,
  TimelineCategory.SCHEDULE_ANALOG_WORKFLOW,
  TimelineCategory.SCHEDULE_DIGITAL_WORKFLOW,
  TimelineCategory.SEND_DIGITAL_DOMICILE,
  TimelineCategory.SEND_DIGITAL_DOMICILE_FEEDBACK,
  TimelineCategory.SEND_DIGITAL_FEEDBACK,
  TimelineCategory.SEND_DIGITAL_DOMICILE_FAILURE,
  TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER,
  TimelineCategory.SEND_ANALOG_DOMICILE,
  TimelineCategory.SEND_PAPER_FEEDBACK,
];

/**
 * Returns the mapping between current notification timeline status and its label and descriptive message.
 * @param  {TimelineCategory} status
 * @returns string
 */
export function getNotificationTimelineStatusInfos(
  step: INotificationDetailTimeline,
  ricipients: Array<NotificationDetailRecipient>
): {
  label: string;
  description: string;
  linkText?: string;
  linkDowloadPath?: string;
} {
  const recipient = ricipients.find(
    (r) =>
      r.taxId ===
      (step.details as SendCourtesyMessageDetails | SendDigitalDetails | AnalogWorkflowDetails)
        .taxId
  );
  switch (step.category) {
    case TimelineCategory.NOTIFICATION_PATH_CHOOSE:
      if ((step.details as NotificationPathChooseDetails).deliveryMode === DeliveryMode.ANALOG) {
        return {
          label: 'Invio per via cartacea',
          description: "È in corso l' invio della notifica per via cartacea.",
          linkText: "Vai all'attestazione",
        };
      }
      return {
        label: 'Invio per via digitale',
        description: "È in corso l' invio della notifica per via digitale.",
        linkText: "Vai all'attestazione",
      };
    case TimelineCategory.SEND_COURTESY_MESSAGE:
      const type =
        (step.details as SendCourtesyMessageDetails).address.type === DigitalDomicileType.EMAIL
          ? 'email'
          : 'sms';
      return {
        label: 'Invio del messaggio di cortesia',
        description: `È in corso l' invio del messaggio di cortesia a ${recipient?.denomination} tramite ${type}`,
      };
    case TimelineCategory.SEND_DIGITAL_DOMICILE:
      return {
        label: 'Invio via PEC',
        description: `È in corso l' invio della notifica a ${
          recipient?.denomination
        } all'indirizzo PEC ${(step.details as SendDigitalDetails).address?.address}`,
      };
    case TimelineCategory.SEND_DIGITAL_DOMICILE_FEEDBACK:
      return {
        label: 'Invio via PEC riuscito',
        description: `L' invio della notifica a ${recipient?.denomination} all'indirizzo PEC ${
          (step.details as SendDigitalDetails).address?.address
        } è riuscito.`,
        linkText: "Vai all'attestazione",
      };
    case TimelineCategory.SEND_DIGITAL_DOMICILE_FAILURE:
      return {
        label: 'Invio via PEC non riuscito',
        description: `L' invio della notifica a ${recipient?.denomination} all'indirizzo PEC ${
          (step.details as SendDigitalDetails).address?.address
        } non è riuscito.`,
        linkText: "Vai all'attestazione",
      };
    case TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER:
      return {
        label: 'Invio via raccomandata semplice',
        description: `È in corso l' invio della notifica a ${
          recipient?.denomination
        } all'indirizzo ${
          (step.details as AnalogWorkflowDetails).address?.address
        } tramite raccomandata semplice.`,
        linkText: "Vai all'attestazione",
      };
    case TimelineCategory.SEND_ANALOG_DOMICILE:
      if (
        (step.details as SendPaperDetails).serviceLevel ===
        PhysicalCommunicationType.REGISTERED_LETTER_890
      ) {
        return {
          label: 'Invio via raccomandata 890',
          description: `È in corso l' invio della notifica a ${
            recipient?.denomination
          } all'indirizzo ${
            (step.details as AnalogWorkflowDetails).address?.address
          } tramite raccomandata 890.`,
          linkText: "Vai all'attestazione",
        };
      }
      return {
        label: 'Invio via raccomandata A/R',
        description: `È in corso l' invio della notifica a ${
          recipient?.denomination
        } all'indirizzo ${
          (step.details as AnalogWorkflowDetails).address?.address
        } tramite raccomandata A/R.`,
        linkText: "Vai all'attestazione",
      };
    case TimelineCategory.SEND_PAPER_FEEDBACK:
      return {
        label: 'Aggiornamento stato raccomandata',
        description: `Si allega un aggiornamento dello stato della raccomandata.`,
        linkText: 'Vedi la ricevuta',
      };
    default:
      return {
        label: 'Non definito',
        description: 'Stato sconosciuto',
      };
  }
}
