import { TimelineCategory } from '../types/NotificationDetail';
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
        description: 'La notifica è stata consegnata'
      };
    case NotificationStatus.DELIVERING:
      return {
        color: 'default',
        label: 'Invio in corso',
        tooltip: "L'invio della notifica è in corso",
        description: "L'invio della notifica è in corso"
      };
    case NotificationStatus.UNREACHABLE:
      return {
        color: 'error',
        label: 'Destinatario irreperibile',
        tooltip: 'Il destinatario non è reperibile',
        description: 'Il destinatario non è reperibile'
      };
    case NotificationStatus.PAID:
      return {
        color: 'success',
        label: 'Pagata',
        tooltip: 'Il destinatario ha pagato i costi della notifica',
        description: 'Il destinatario ha pagato i costi della notifica'
      };
    case NotificationStatus.ACCEPTED:
      return {
        color: 'default',
        label: 'Depositata',
        tooltip: "L'ente ha depositato la notifica",
        description: "L'ente ha depositato la notifica"
      };
    case NotificationStatus.EFFECTIVE_DATE:
      return {
        color: 'info',
        label: 'Perfezionata per decorrenza termini',
        tooltip: 'Il destinatario non ha letto la notifica',
        description: 'Il destinatario non ha letto la notifica entro il termine stabilito'
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
        description: "L'ente ha annullato l'invio della notifica"
      };
    default:
      return {
        color: 'default',
        label: 'Non definito',
        tooltip: 'Stato sconosciuto',
        description: 'Stato sconosciuto'
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
