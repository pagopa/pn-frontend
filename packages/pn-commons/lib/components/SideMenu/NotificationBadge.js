import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { Box, Typography } from '@mui/material';
const NotificationBadge = ({ numberOfNotification, }) => (_jsx(Box, { sx: {
        width: '23px',
        height: '18px',
        borderRadius: '56px',
        padding: '3px, 8px, 3px, 8px',
        backgroundColor: '#0073E6',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }, children: _jsx(Typography, { sx: { color: 'white', fontSize: '12px' }, "data-testid": "notifications", children: numberOfNotification !== 0 && _jsx(_Fragment, { children: numberOfNotification }) }) }));
export default NotificationBadge;
