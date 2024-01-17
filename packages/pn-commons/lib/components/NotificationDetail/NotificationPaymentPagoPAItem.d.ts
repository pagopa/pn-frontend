/// <reference types="react" />
import { PagoPAPaymentFullDetails } from '../../models';
type Props = {
    pagoPAItem: PagoPAPaymentFullDetails;
    loading: boolean;
    isSelected: boolean;
    handleFetchPaymentsInfo: () => void;
    handleDeselectPayment: () => void;
    isSinglePayment?: boolean;
    isCancelled: boolean;
    handleTrackEventDetailPaymentError?: () => void;
};
declare const NotificationPaymentPagoPAItem: React.FC<Props>;
export default NotificationPaymentPagoPAItem;
