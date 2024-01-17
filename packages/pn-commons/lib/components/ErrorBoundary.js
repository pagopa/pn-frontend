import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { IllusError } from '@pagopa/mui-italia';
import { getLocalizedOrDefaultLabel } from '../utility/localization.utility';
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.handleRefreshPage = () => {
            if (this.props.eventTrackingCallbackRefreshPage) {
                this.props.eventTrackingCallbackRefreshPage();
            }
            window.location.reload();
        };
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }
    componentDidCatch(_error, _errorInfo) {
        // You can also log the error to an error reporting service
        if (this.props.eventTrackingCallback) {
            this.props.eventTrackingCallback(_error, _errorInfo);
        }
    }
    render() {
        if (this.state.hasError) {
            return (_jsx(Box, { sx: { minHeight: '350px', height: '100%', display: 'flex', ...this.props.sx }, children: _jsxs(Box, { sx: { margin: 'auto', textAlign: 'center', width: '80vw' }, children: [_jsx(IllusError, {}), _jsx(Typography, { variant: "h4", color: "text.primary", sx: { margin: '20px 0 10px 0' }, children: getLocalizedOrDefaultLabel('common', 'error-boundary.title', 'Qualcosa è andato storto') }), _jsx(Typography, { variant: "body1", color: "text.primary", children: getLocalizedOrDefaultLabel('common', 'error-boundary.description', 'Non siamo riusciti a caricare la pagina. Ricaricala, oppure prova più tardi.') }), _jsx(Button, { id: "reloadButton", variant: "contained", sx: { marginTop: '30px' }, onClick: this.handleRefreshPage, children: getLocalizedOrDefaultLabel('common', 'error-boundary.action', 'Ricarica la pagina') })] }) }));
        }
        return this.props.children;
    }
}
export default ErrorBoundary;
