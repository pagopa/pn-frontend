/// <reference types="react" />
import { NotificationDetailTableRow } from '../../models';
type Props = {
    rows: Array<NotificationDetailTableRow>;
};
/**
 * Table with the details of a notification
 * @param rows data to show
 */
declare const NotificationDetailTable: React.FC<Props>;
export default NotificationDetailTable;
