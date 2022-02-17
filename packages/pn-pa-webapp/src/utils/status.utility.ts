import { NotificationStatus } from '../redux/dashboard/types';

// TODO: aggiungere i colori del tema
export function getNotificationStatusLabelAndColor(status: NotificationStatus): {
  color: "warning" | "error" | "success" | "info" | "default" | "primary" | "secondary" | undefined;
  label: string;
  tooltip: string;
} {
  switch (status) {
    case NotificationStatus.DELIVERED:
      return {
        color: 'warning',
        label: 'Consegnata',
        tooltip: 'Consegnata: Il destinatario ha ricevuto la notifica',
      };
    case NotificationStatus.DELIVERING:
      return {
        color: 'warning',
        label: 'In inoltro',
        tooltip: "In inoltro: L'invio della notifica è in corso",
      };
    case NotificationStatus.UNREACHABLE:
      return {
        color: 'error',
        label: 'Destinatario irreperibile',
        tooltip: 'Destinatario irreperibile: Il destinatario non risulta reperibile',
      };
    case NotificationStatus.PAID:
      return {
        color: 'success',
        label: 'Pagata',
        tooltip: 'Pagata: Il destinatario ha pagato la notifica',
      };
    case NotificationStatus.RECEIVED:
      return {
        color: 'warning',
        label: 'Depositata',
        tooltip: 'Depositata: L’ente ha depositato la notifica',
      };
    case NotificationStatus.EFFECTIVE_DATE:
      return {
        color: 'info',
        label: 'Perfezionata per decorrenza termini',
        tooltip: 'Perfezionata per decorrenza termini: Il destinatario non ha letto la notifica',
      };
    case NotificationStatus.VIEWED:
      return {
        color: 'success',
        label: 'Perfezionata per visione',
        tooltip: 'Perfezionata per visione: Il destinatario ha letto la notifica',
      };
    case NotificationStatus.CANCELED:
      return {
        color: 'info',
        label: 'Annullata',
        tooltip: "Annullata: L'ente ha annullato l'invio della notifica",
      };
  }
}

export const NotificationAllowedStatus = [
  { value: 'All', label: 'Tutti gli stati' },
  { value: NotificationStatus.RECEIVED, label: 'Depositata' },
  { value: NotificationStatus.DELIVERED, label: 'Consegnata' },
  { value: NotificationStatus.DELIVERING, label: 'In inoltro' },
  { value: NotificationStatus.EFFECTIVE_DATE, label: 'Perfezionata per decorrenza termini' },
  { value: NotificationStatus.VIEWED, label: 'Perfezionata per visione' },
  { value: NotificationStatus.PAID, label: 'Pagata' },
  { value: NotificationStatus.CANCELED, label: 'Annullata' },
  { value: NotificationStatus.UNREACHABLE, label: 'Destinatario irreperibile' },
];