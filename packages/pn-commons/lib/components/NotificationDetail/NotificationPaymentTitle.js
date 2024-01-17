import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, Typography } from '@mui/material';
import { EventPaymentRecipientType } from '../../models';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
const NotificationPaymentTitle = ({ landingSiteUrl, handleTrackEventFn, pagoPaF24, f24Only, allPaymentsIsPaid, }) => {
    const FAQ_NOTIFICATION_COSTS = '/faq#costi-di-notifica';
    const notificationCostsFaqLink = `${landingSiteUrl}${FAQ_NOTIFICATION_COSTS}`;
    const FaqLink = (_jsx(Link, { href: notificationCostsFaqLink, onClick: () => handleTrackEventFn(EventPaymentRecipientType.SEND_MULTIPAYMENT_MORE_INFO), target: "_blank", fontWeight: "bold", sx: { cursor: 'pointer' }, "data-testid": "faqNotificationCosts", children: getLocalizedOrDefaultLabel('notifications', 'detail.payment.how') }));
    const getLabel = () => {
        if (pagoPaF24.length > 0 && f24Only.length > 0) {
            return (_jsxs(_Fragment, { children: [getLocalizedOrDefaultLabel('notifications', 'detail.payment.subtitle-mixed'), "\u00A0", FaqLink] }));
        }
        if (pagoPaF24.length === 1) {
            return (_jsxs(_Fragment, { children: [getLocalizedOrDefaultLabel('notifications', 'detail.payment.single-payment-subtitle'), "\u00A0", FaqLink] }));
        }
        if (pagoPaF24.length > 1) {
            return (_jsxs(_Fragment, { children: [getLocalizedOrDefaultLabel('notifications', 'detail.payment.subtitle'), "\u00A0", FaqLink] }));
        }
        return _jsx(_Fragment, { children: getLocalizedOrDefaultLabel('notifications', 'detail.payment.subtitle-f24') });
    };
    return allPaymentsIsPaid ? (_jsx(_Fragment, {})) : (_jsx(Typography, { variant: "body2", "data-testid": "notification-payment-recipient-subtitle", children: getLabel() }));
};
export default NotificationPaymentTitle;
