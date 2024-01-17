/// <reference types="react" />
import { EventPaymentRecipientType, F24PaymentDetails, PaymentDetails } from '../../models';
type Props = {
    landingSiteUrl: string;
    handleTrackEventFn: (event: EventPaymentRecipientType, param?: object) => void;
    pagoPaF24: Array<PaymentDetails>;
    f24Only: Array<F24PaymentDetails>;
    allPaymentsIsPaid: boolean;
};
declare const NotificationPaymentTitle: React.FC<Props>;
export default NotificationPaymentTitle;
