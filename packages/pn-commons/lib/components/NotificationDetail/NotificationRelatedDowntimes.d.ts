/// <reference types="react" />
import { Downtime, NotificationStatusHistory } from '../../models';
type Props = {
    notificationStatusHistory: Array<NotificationStatusHistory>;
    fetchDowntimeEvents: (fromDate: string, toDate: string | undefined) => void;
    downtimeEvents: Array<Downtime>;
    fetchDowntimeLegalFactDocumentDetails: (legalFactId: string) => void;
    downtimeLegalFactUrl: string;
    clearDowntimeLegalFactData: () => void;
    apiId: string;
    disableDownloads?: boolean;
};
declare const NotificationRelatedDowntimes: (props: Props) => JSX.Element;
export default NotificationRelatedDowntimes;
