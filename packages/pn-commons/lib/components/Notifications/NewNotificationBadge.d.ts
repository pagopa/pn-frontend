/// <reference types="react" />
import { NotificationStatus } from '@pagopa-pn/pn-commons';
export declare const isNewNotification: (value: NotificationStatus) => boolean;
/**
 * Returns the current value for notification if the notification has already been viewed,
 * otherwise a blu dot badge followed by the current value
 * @param value
 * @returns
 */
declare const NewNotificationBadge: React.FC<{
    status: NotificationStatus;
}>;
export default NewNotificationBadge;
