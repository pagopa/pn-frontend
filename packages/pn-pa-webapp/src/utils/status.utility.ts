import {
  getNotificationStatusLabelAndColor,
  NotificationStatus,
  NotificationDetailTimeline,
  NotificationStatusHistory,
} from '@pagopa-pn/pn-commons';

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
