import { NotificationDetail, TimelineCategory } from '../models/NotificationDetail';
import { NotificationStatus } from '../models/NotificationStatus';

type Props = {
  notification: NotificationDetail;
};

/**
 * Checks if notification is cancelled.
 *
 * The check is on notification status and if in timeline
 * there is an element with category cancelled or cancellation request
 *
 * @param notification Notification to check
 */
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
