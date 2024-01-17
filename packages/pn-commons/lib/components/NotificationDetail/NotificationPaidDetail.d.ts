/// <reference types="react" />
import { PaymentHistory } from '../../types';
declare type NotificationPaidDetailProps = {
    paymentDetailsList: Array<PaymentHistory> | undefined;
    isSender?: boolean;
};
declare const NotificationPaidDetail: ({ paymentDetailsList, isSender }: NotificationPaidDetailProps) => JSX.Element;
export default NotificationPaidDetail;
