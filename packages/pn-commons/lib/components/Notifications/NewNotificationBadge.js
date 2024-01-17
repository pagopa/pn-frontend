import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Badge } from '@mui/material';
import { NotificationStatus } from '@pagopa-pn/pn-commons';
export const isNewNotification = (value) => {
    switch (value) {
        case NotificationStatus.VIEWED:
        case NotificationStatus.PAID:
        case NotificationStatus.CANCELLED:
            return false;
        default:
            return true;
    }
};
/**
 * Returns the current value for notification if the notification has already been viewed,
 * otherwise a blu dot badge followed by the current value
 * @param value
 * @returns
 */
const NewNotificationBadge = ({ status }) => {
    if (isNewNotification(status)) {
        return (_jsx(Badge, { "data-testid": "new-notification-badge", color: "primary", variant: "dot", sx: { ml: 0.5 } }));
    }
    return _jsx(_Fragment, {});
};
export default NewNotificationBadge;
