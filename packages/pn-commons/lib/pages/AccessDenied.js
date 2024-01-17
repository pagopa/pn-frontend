import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Stack, Typography } from '@mui/material';
import { getLocalizedOrDefaultLabel } from '../utility/localization.utility';
const AccessDenied = ({ isLogged, goToLogin, goToHomePage, message, subtitle, }) => {
    const finalMessage = message ??
        getLocalizedOrDefaultLabel('common', isLogged ? 'access-denied' : 'not-logged', 'Non hai le autorizzazioni necessarie per accedere a questa pagina');
    const finalSubTitle = subtitle ?? (isLogged ? '' : getLocalizedOrDefaultLabel('common', 'not-logged-subtitle', ''));
    return (_jsxs(Stack, { direction: "column", alignItems: "center", my: 4, px: 4, sx: { minHeight: '50vh' }, "data-testid": "access-denied", children: [_jsx(Box, { mt: 4, children: _jsx(Typography, { align: "center", color: "text.primary", variant: "h4", id: "login-page-title", children: finalMessage }) }), _jsx(Box, { my: 2, children: _jsx(Typography, { align: "center", color: "text.primary", variant: "body1", children: finalSubTitle }) }), _jsx(Box, { my: 4, children: _jsx(Button, { id: "login-button", variant: "contained", onClick: () => {
                        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                        isLogged ? goToHomePage() : goToLogin();
                    }, children: isLogged
                        ? getLocalizedOrDefaultLabel('common', 'button.go-to-home', 'Vai alla home page')
                        : getLocalizedOrDefaultLabel('common', 'button.go-to-login', 'Accedi') }) })] }));
};
export default AccessDenied;
