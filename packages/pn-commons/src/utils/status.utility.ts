import { useTranslation } from 'react-i18next';
import { NotificationStatus } from '../types/NotificationStatus';

// TODO: aggiungere i colori del tema
/**
 * Returns the mapping between current notification status and its color, label and descriptive message.
 * If you want to provide a translation for labels and messages, you have to provide your own translation file and pass
 * the namespace as parameter.
 * @param  {NotificationStatus} status
 * @param translations string - Namespace for translations file. Default value is status.
 * @returns string
 */
export function getNotificationStatusLabelAndColor(status: NotificationStatus, translations = 'status'): {
  color: 'warning' | 'error' | 'success' | 'info' | 'default' | 'primary' | 'secondary' | undefined;
  label: string;
  tooltip: string;
} {
  const { t } = useTranslation(translations);
  switch (status) {
    case NotificationStatus.DELIVERED:
      return {
        color: 'default',
        label: t('Consegnata'),
        tooltip: t('Il destinatario ha ricevuto la notifica'),
      };
    case NotificationStatus.DELIVERING:
      return {
        color: 'default',
        label: t('In inoltro'),
        tooltip: t("L'invio della notifica è in corso"),
      };
    case NotificationStatus.UNREACHABLE:
      return {
        color: 'error',
        label: t('Destinatario irreperibile'),
        tooltip: t('Il destinatario non risulta reperibile'),
      };
    case NotificationStatus.PAID:
      return {
        color: 'success',
        label: t('Pagata'),
        tooltip: t('Il destinatario ha pagato la notifica'),
      };
    case NotificationStatus.IN_VALIDATION:
      return {
        color: 'default',
        label: t('In Validazione'),
        tooltip: t('La notifica è in fase di validazione'),
      };
    case NotificationStatus.ACCEPTED:
      return {
        color: 'default',
        label: t('Depositata'),
        tooltip: t("L'ente ha depositato la notifica"),
      };
    case NotificationStatus.REFUSED:
      return {
        color: 'error',
        label: t('Non valida'),
        tooltip: t('La notifica non rispetta le validazioni'),
      };
    case NotificationStatus.EFFECTIVE_DATE:
      return {
        color: 'info',
        label: t('Perfezionata per decorrenza termini'),
        tooltip: t('Il destinatario non ha letto la notifica'),
      };
    case NotificationStatus.VIEWED:
      return {
        color: 'info',
        label: t('Perfezionata per visione'),
        tooltip: t('Il destinatario ha letto la notifica'),
      };
    case NotificationStatus.CANCELED:
      return {
        color: 'warning',
        label: t('Annullata'),
        tooltip: t("L'ente ha annullato l'invio della notifica"),
      };
    default:
      return {
        color: 'info',
        label: t('Non definito'),
        tooltip: t('Stato sconosciuto'),
      };
  }
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
