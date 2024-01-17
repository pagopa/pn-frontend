import React from 'react';
import { EventPaymentRecipientType, NotificationDetailPayment, PaymentAttachment, PaymentAttachmentSName, PaymentDetails, PaymentsData } from '../../models';
type Props = {
    payments: PaymentsData;
    isCancelled: boolean;
    timerF24: number;
    landingSiteUrl: string;
    getPaymentAttachmentAction: (name: PaymentAttachmentSName, attachmentIdx?: number) => {
        abort: (reason?: string) => void;
        unwrap: () => Promise<PaymentAttachment>;
    };
    onPayClick: (noticeCode?: string, creditorTaxId?: string, amount?: number) => void;
    handleTrackEvent?: (event: EventPaymentRecipientType, param?: object) => void;
    handleFetchPaymentsInfo: (payment: Array<PaymentDetails | NotificationDetailPayment>) => void;
};
declare const _default: React.NamedExoticComponent<Props>;
export default _default;
