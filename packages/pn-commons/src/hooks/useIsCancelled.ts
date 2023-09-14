import { NotificationDetail, NotificationStatus, TimelineCategory } from '../types';

/**
 * Checks if notification is cancelled
 */

interface Props {
  notification: NotificationDetail;
}

export const useIsCancelled = ({ notification }: Props) => {
  const timelineCancelled = !!notification.timeline.find(
    (el) =>
      el.category === TimelineCategory.NOTIFICATION_CANCELLED ||
      el.category === TimelineCategory.NOTIFICATION_CANCELLATION_REQUEST
  );
  return {
    cancelled: notification.notificationStatus === NotificationStatus.CANCELLED,
    cancellationInProgress:
      notification.notificationStatus === NotificationStatus.CANCELLATION_IN_PROGRESS,
    cancellationInTimeline: timelineCancelled,
  };
};
