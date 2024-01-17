/// <reference types="react" />
import { Notification, NotificationColumnData, Row } from '../../models';
declare const NotificationsDataSwitch: React.FC<{
    data: Row<Notification>;
    type: keyof NotificationColumnData;
}>;
export default NotificationsDataSwitch;
