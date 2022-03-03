import { getNotificationStatusLabelAndColor, NotificationStatus } from '@pagopa-pn/pn-commons';
import { NotificationDetailTimeline, NotificationStatusHistory } from '../redux/notification/types';

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