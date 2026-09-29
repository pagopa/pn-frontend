import { NotificationTimelineResponse } from '../models';
import { NotificationDetail, TimelineCategory } from '../models/NotificationDetail';
import { NotificationStatus } from '../models/NotificationStatus';

type Props = {
  notification: NotificationDetail | NotificationTimelineResponse;
};

const isNotificationDetail = (
  notification: NotificationDetail | NotificationTimelineResponse
): notification is NotificationDetail => 'timeline' in notification;

/**
 * Checks if notification is cancelled.
 *
 * The check is on notification status and if in timeline
 * there is an element with category cancelled or cancellation request
 *
 * @param notification Notification to check
 */
export const useIsCancelled = ({ notification }: Props) => {
  const timelineCancelled = isNotificationDetail(notification)
    ? !!notification.timeline.find(
        (el) =>
          el.category === TimelineCategory.NOTIFICATION_CANCELLED ||
          el.category === TimelineCategory.NOTIFICATION_CANCELLATION_REQUEST
      )
    : notification.isCancelled;

  return {
    cancelled: !!notification.notificationStatusHistory.find(
      (item) => item.status === NotificationStatus.CANCELLED
    ),
    cancellationInProgress: !!notification.notificationStatusHistory.find(
      (item) => item.status === NotificationStatus.CANCELLATION_IN_PROGRESS
    ),
    cancellationInTimeline: timelineCancelled,
  };
};
