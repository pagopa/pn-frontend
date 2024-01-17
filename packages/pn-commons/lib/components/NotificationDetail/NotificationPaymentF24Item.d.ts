/// <reference types="react" />
import { F24PaymentDetails, PaymentAttachment, PaymentAttachmentSName } from '../../models';
type Props = {
    f24Item: F24PaymentDetails;
    timerF24: number;
    isPagoPaAttachment?: boolean;
    getPaymentAttachmentAction: (name: PaymentAttachmentSName, attachmentIdx?: number) => {
        abort: (reason?: string) => void;
        unwrap: () => Promise<PaymentAttachment>;
    };
    handleTrackDownloadF24?: () => void;
    handleTrackDownloadF24Success?: () => void;
    handleTrackDownloadF24Timeout?: () => void;
};
declare const NotificationPaymentF24Item: React.FC<Props>;
export default NotificationPaymentF24Item;
