import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Typography } from '@mui/material';
import { useIsMobile } from '../../hooks';
import { formatDate, getNotificationStatusInfos } from '../../utility';
import NewNotificationBadge, { isNewNotification } from './NewNotificationBadge';
import StatusTooltip from './StatusTooltip';
const NotificationStatusChip = ({ data }) => {
    const { label, tooltip, color } = getNotificationStatusInfos(data.notificationStatus, {
        recipients: data.recipients,
    });
    return _jsx(StatusTooltip, { label: label, tooltip: tooltip, color: color });
};
const NotificationsDataSwitch = ({ data, type }) => {
    const isMobile = useIsMobile();
    if (type === 'badge') {
        return _jsx(NewNotificationBadge, { status: data.notificationStatus });
    }
    if (type === 'sentAt' && !isMobile) {
        return _jsx(_Fragment, { children: formatDate(data.sentAt) });
    }
    if (type === 'sentAt' && isMobile) {
        const newNotification = isNewNotification(data.notificationStatus);
        return newNotification ? (_jsxs(_Fragment, { children: [_jsx(Typography, { display: "inline", sx: { marginRight: '10px' }, children: _jsx(NewNotificationBadge, { status: data.notificationStatus }) }), _jsx(Typography, { display: "inline", variant: "body2", children: formatDate(data.sentAt) })] })) : (_jsx(Typography, { variant: "body2", children: formatDate(data.sentAt) }));
    }
    if (type === 'sender') {
        return _jsx(_Fragment, { children: data.sender });
    }
    if (type === 'subject') {
        return _jsx(_Fragment, { children: data.subject.length > 65 ? data.subject.substring(0, 65) + '...' : data.subject });
    }
    if (type === 'iun') {
        return _jsx(_Fragment, { children: data.iun });
    }
    if (type === 'notificationStatus') {
        return _jsx(NotificationStatusChip, { data: data });
    }
    if (type === 'recipients') {
        return (_jsx(_Fragment, { children: data.recipients.map((recipient) => (_jsx(Typography, { variant: "body2", children: recipient }, recipient))) }));
    }
    return _jsx(_Fragment, {});
};
export default NotificationsDataSwitch;
