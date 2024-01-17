import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Typography } from '@mui/material';
const CourtesyPage = ({ icon, title, subtitle, onClick, onClickLabel }) => (_jsxs(Box, { "data-testid": "courtesy-page", sx: {
        maxWidth: '480px',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        mx: 'auto',
        my: 12,
    }, children: [_jsx(Box, { sx: { svg: { height: '64px' } }, children: icon }, void 0), _jsx(Typography, { mt: 4, mb: 1, align: "center", color: "textPrimary", variant: "h4", children: title }, void 0), subtitle && (_jsx(Typography, { align: "center", color: "textPrimary", children: subtitle }, void 0)), onClick && (_jsx(Button, { id: "courtesy-page-button", sx: { marginTop: '24px' }, variant: "contained", onClick: onClick, children: onClickLabel }, void 0))] }, void 0));
export default CourtesyPage;
