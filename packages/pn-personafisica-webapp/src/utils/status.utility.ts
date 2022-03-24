import { getNotificationStatusLabelAndColor, NotificationStatus } from '@pagopa-pn/pn-commons';
import { NotificationDetailTimeline, NotificationStatusHistory } from '@pagopa-pn/pn-commons';

export function getNotificationStatusLabelAndColorFromTimelineCategory(
  timelineStep: NotificationDetailTimeline,
  notificationStatusHistory: Array<NotificationStatusHistory>
): {
  color: 'warning' | 'error' | 'success' | 'info' | 'default' | 'primary' | 'secondary' | undefined;
  label: string;
  tooltip: string;
} {
  const notificationStep = notificationStatusHistory.find((n) =>
    n.relatedTimelineElements.includes(timelineStep.elementId)
  );
  return getNotificationStatusLabelAndColor(notificationStep?.status as NotificationStatus);
}

export enum DelegationStatus {
  ACTIVE = 'Active',
  PENDING = 'Pending',
}

export function getDelegationStatusLabelAndColor(status: 'Active' | 'Pending'): {
  color: 'warning' | 'success' | 'info' | undefined;
  label: string;
} {
  switch (status) {
    case DelegationStatus.ACTIVE:
      return {
        color: 'success',
        label: 'Attiva',
      };
    case DelegationStatus.PENDING:
      return {
        color: 'warning',
        label: 'Attesa conferma',
      };
    default:
      return {
        color: 'info',
        label: 'Non definito',
      };
  }
}

export const DelegationAllowedStatus = [
  { value: 'All', label: 'Tutti gli stati' },
  { value: DelegationStatus.ACTIVE, label: 'Active' },
  { value: DelegationStatus.PENDING, label: 'Attesa conferma' },
];
