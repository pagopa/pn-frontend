import { NotificationDetail } from '../models';
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
export declare const useIsCancelled: ({ notification }: Props) => {
    cancelled: boolean;
    cancellationInProgress: boolean;
    cancellationInTimeline: boolean;
};
export {};
