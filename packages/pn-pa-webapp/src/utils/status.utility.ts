import { NotificationStatus } from '../redux/dashboard/types';
import { NotificationDetailTimeline, NotificationStatusHistory } from '../redux/notification/types';

// TODO: aggiungere i colori del tema
export function getNotificationStatusLabelAndColor(status: NotificationStatus): {
  color: 'warning' | 'error' | 'success' | 'info' | 'default' | 'primary' | 'secondary' | undefined;
  label: string;
  tooltip: string;
} {
  switch (status) {
    case NotificationStatus.DELIVERED:
      return {
        color: 'default',
        label: 'Consegnata',
        tooltip: 'Il destinatario ha ricevuto la notifica',
      };
    case NotificationStatus.DELIVERING:
      return {
        color: 'default',
        label: 'In inoltro',
        tooltip: "L'invio della notifica è in corso",
      };
    case NotificationStatus.UNREACHABLE:
      return {
        color: 'error',
        label: 'Destinatario irreperibile',
        tooltip: 'Il destinatario non risulta reperibile',
      };
    case NotificationStatus.PAID:
      return {
        color: 'success',
        label: 'Pagata',
        tooltip: 'Il destinatario ha pagato la notifica',
      };
    case NotificationStatus.IN_VALIDATION:
      return {
        color: 'default',
        label: 'In Validazione',
        tooltip: 'La notifica è in fase di validazione',
      };
    case NotificationStatus.ACCEPTED:
      return {
        color: 'default',
        label: 'Depositata',
        tooltip: "L'ente ha depositato la notifica",
      };
    case NotificationStatus.REFUSED:
      return {
        color: 'error',
        label: 'Non valida',
        tooltip: 'La notifica non rispetta le validazioni',
      };
    case NotificationStatus.EFFECTIVE_DATE:
      return {
        color: 'info',
        label: 'Perfezionata per decorrenza termini',
        tooltip: 'Il destinatario non ha letto la notifica',
      };
    case NotificationStatus.VIEWED:
      return {
        color: 'info',
        label: 'Perfezionata per visione',
        tooltip: 'Il destinatario ha letto la notifica',
      };
    case NotificationStatus.CANCELED:
      return {
        color: 'warning',
        label: 'Annullata',
        tooltip: "L'ente ha annullato l'invio della notifica",
      };
    default:
      return {
        color: 'info',
        label: 'Non definito',
        tooltip: "Stato sconosciuto",
      };
  }
}

export function getNotificationStatusLabelAndColorFromTimelineCategory(
  timelineStep: NotificationDetailTimeline,
  notificationStatusHistory: Array<NotificationStatusHistory>
): {
  color: 'warning' | 'error' | 'success' | 'info' | 'default' | 'primary' | 'secondary' | undefined;
  label: string;
  tooltip: string;
} {
  // TODO: cambiare quando l'api restituirà la corrispondenza per id
  /* eslint-disable-next-line functional/no-let */
  let currentStatus;
  const timeLineTime = new Date(timelineStep.timestamp).getTime();
  for (const notificationStatus of notificationStatusHistory.slice().reverse()) {
    const currentTime = new Date(notificationStatus.activeFrom).getTime();
    if (currentTime <= timeLineTime) {
      currentStatus = notificationStatus.status;
      continue;
    }
    break;
  }
  return getNotificationStatusLabelAndColor(currentStatus as NotificationStatus);
}

export const NotificationAllowedStatus = [
  { value: 'All', label: 'Tutti gli stati' },
  { value: NotificationStatus.IN_VALIDATION, label: 'In Validazione' },
  { value: NotificationStatus.REFUSED, label: 'Non valida' },
  { value: NotificationStatus.ACCEPTED, label: 'Depositata' },
  { value: NotificationStatus.DELIVERED, label: 'Consegnata' },
  { value: NotificationStatus.DELIVERING, label: 'In inoltro' },
  { value: NotificationStatus.EFFECTIVE_DATE, label: 'Perfezionata per decorrenza termini' },
  { value: NotificationStatus.VIEWED, label: 'Perfezionata per visione' },
  { value: NotificationStatus.PAID, label: 'Pagata' },
  { value: NotificationStatus.CANCELED, label: 'Annullata' },
  { value: NotificationStatus.UNREACHABLE, label: 'Destinatario irreperibile' },
];
