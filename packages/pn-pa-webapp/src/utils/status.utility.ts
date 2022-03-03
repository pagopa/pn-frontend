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
  const notificationStep = notificationStatusHistory.find(n => n.relatedTimelineElements.includes(timelineStep.elementId));
  return getNotificationStatusLabelAndColor(notificationStep?.status as NotificationStatus);
}
