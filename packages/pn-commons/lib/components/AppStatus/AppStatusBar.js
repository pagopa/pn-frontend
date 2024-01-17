import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { Stack, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useIsMobile } from '../../hooks';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
export const AppStatusBar = ({ status }) => {
    const theme = useTheme();
    const isMobile = useIsMobile();
    // labels
    const statusText = getLocalizedOrDefaultLabel('appStatus', `appStatus.statusDescription.${status.appIsFullyOperative ? 'ok' : 'not-ok'}`, "Status dell'applicazione in questo momento: verde OK, rosso con problemi.");
    // ATTENTION - a similar logic to choose the icon and its color is implemented in App.tsx
    const mainColor = status.appIsFullyOperative
        ? theme.palette.success.main
        : theme.palette.error.main;
    const IconComponent = status.appIsFullyOperative ? CheckCircleIcon : ErrorIcon;
    return (_jsxs(Stack, { component: "div", "data-testid": "app-status-bar", id: "appStatusBar", direction: isMobile ? 'column' : 'row', justifyContent: "center", alignItems: "center", sx: (theme) => ({
            mt: isMobile ? '23px' : '42px',
            py: '21px',
            px: '35px',
            width: '100%',
            backgroundColor: alpha(mainColor, theme.palette.action.hoverOpacity),
            borderColor: mainColor,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderRadius: '10px',
        }), children: [_jsx(IconComponent, { sx: {
                    width: '20px',
                    mr: isMobile ? 0 : '20px',
                    mb: isMobile ? '12px' : 0,
                    color: mainColor,
                } }), _jsx(Typography, { tabIndex: 0, "aria-label": statusText, variant: "body2", children: statusText })] }));
};
